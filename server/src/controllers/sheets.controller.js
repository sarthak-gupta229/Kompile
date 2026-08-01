import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Sheet } from "../models/sheet.models.js";
import { SheetTopic } from "../models/sheetTopic.models.js";
import { SheetQuestion } from "../models/sheetQuestion.models.js";
import { UserSheetProgress } from "../models/userSheetProgress.models.js";

export const getSheetDetail = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const sheet = await Sheet.findOne({ slug }).lean();

  if (!sheet) {
    throw new ApiError(400, "Sheet not found");
  }

  const sheetId = sheet._id;

  const [topics, questions, progress] = await Promise.all([
    SheetTopic.find({ sheetId }).sort({ order: 1 }).lean(),
    SheetQuestion.find({ sheetId }).sort({ order: 1 }).lean(),
    UserSheetProgress.find({ userId: req.user?._id, sheetId }).lean(),
  ]);

  const progressMap = new Map(
    progress.map((p) => [p.questionId.toString(), p]),
  );

  const questionsWithStatus = questions.map((q) => {
    const p = progressMap.get(q._id.toString());
    return {
      ...q,
      completed: p?.completed ?? false,
      bookmarked: p?.bookmarked ?? false,
    };
  });

  const topicWithQuestions = topics.map((topic) => {
    const topicQuestions = questionsWithStatus.filter(
      (q) => q.topicId.toString() === topic._id.toString(),
    );

    const solvedCount = topicQuestions.filter((q) => q.completed).length;
    const bookmarkedCount = topicQuestions.filter((q) => q.bookmarked).length;

    return {
      ...topic,
      questions: topicQuestions,
      solvedCount,
      bookmarkedCount,
      totalCount: topicQuestions.length,
    };
  });

  const overallSolved = progress.filter((p) => p.completed).length;
  const overallBookmarked = progress.filter((p) => p.bookmarked).length;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        sheet: {
          ...sheet,
          solvedCount: overallSolved,
          bookmarkedCount: overallBookmarked,
        },
        topics: topicWithQuestions,
      },
      "Sheet detail fetched",
    ),
  );
});

export const toggleQuestionProgress = asyncHandler(async (req, res) => {
  const { sheetId, questionId } = req.params;

  const question = await SheetQuestion.findOne({ _id: questionId, sheetId });
  if (!question) throw new ApiError(404, "Question not found in this sheet");

  const existing = await UserSheetProgress.findOne({
    userId: req.user._id,
    sheetId,
    questionId,
  });

  if (existing) {
    await existing.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, { completed: false }, "Marked incomplete"));
  }

  await UserSheetProgress.create({
    userId: req.user._id,
    sheetId,
    questionId,
    completed: true,
    completedAt: new Date(),
  });
  return res
    .status(200)
    .json(new ApiResponse(200, { completed: true }, "Marked complete"));
});

export const toggleBookmark = asyncHandler(async (req, res) => {
  const { sheetId, questionId } = req.params;

  const question = await SheetQuestion.findOne({ _id: questionId, sheetId });
  if (!question) throw new ApiError(404, "Question not found in this sheet");

  const existing = await UserSheetProgress.findOne({
    userId: req.user._id,
    sheetId,
    questionId,
  });

  if (existing) {
    existing.bookmarked = !existing.bookmarked;
    await existing.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { bookmarked: existing.bookmarked },
          existing.bookmarked ? "Bookmarked" : "Bookmark removed",
        ),
      );
  }

  await UserSheetProgress.create({
    userId: req.user._id,
    sheetId,
    questionId,
    bookmarked: true,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, { bookmarked: true }, "Bookmarked"));
});

export const getAllSheets = asyncHandler(async (req, res) => {
  const sheets = await Sheet.find().lean();

  const withProgress = await Promise.all(
    sheets.map(async (sheet) => {
      const solved = await UserSheetProgress.countDocuments({
        userId: req.user._id,
        sheetId: sheet._id,
      });
      return {
        ...sheet,
        solvedCount: solved,
        percentSolved: sheet.totalQuestions
          ? Math.round((solved / sheet.totalQuestions) * 100)
          : 0,
      };
    }),
  );

  return res
    .status(200)
    .json(new ApiResponse(200, withProgress, "Sheets fetched"));
});
