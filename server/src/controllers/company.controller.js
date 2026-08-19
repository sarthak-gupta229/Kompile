import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { Company } from "../models/company.models.js";
import { CompanyQuestion } from "../models/companyQuestion.models.js";
import { UserCompanyProgress } from "../models/userCompanyProgress.models.js";

export const getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().sort({ name: 1 }).lean();

  const withProgress = await Promise.all(
    companies.map(async (company) => {
      const solved = await UserCompanyProgress.countDocuments({
        userId: req.user._id,
        companyId: company._id,
      });

      return {
        ...company,
        solvedCount: solved,
        percentSolved: company.totalQuestions
          ? Math.round((solved / company.totalQuestions) * 100)
          : 0,
      };
    }),
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { companies: withProgress }, "Companies fetched"));
});

export const getCompanyQuestions = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  const {
    difficulty,
    topics,
    search,
    sortBy = "frequency",
    page = 1,
    limit = 50,
  } = req.query;

  const company = await Company.findById(companyId).lean();
  if (!company) throw new ApiError(404, "Company not found");

  const filter = { companyId };
  if (difficulty) filter.difficulty = difficulty;
  if (search) filter.title = { $regex: search, $options: "i" };

  if (topics) {
    const topicList = topics
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (topicList.length) {
      filter.topics = { $in: topicList };
    }
  }

  const sortField =
    sortBy === "acceptanceRate" ? "acceptanceRate" : "frequency";
  const skip = (Number(page) - 1) * Number(limit);

  const [questions, totalMatched, progress] = await Promise.all([
    CompanyQuestion.find(filter)
      .sort({ [sortField]: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    CompanyQuestion.countDocuments(filter),
    UserCompanyProgress.find({ userId: req.user._id, companyId }).lean(),
  ]);

  const completedSet = new Set(progress.map((p) => p.questionId.toString()));

  const questionsWithStatus = questions.map((q) => ({
    ...q,
    completed: completedSet.has(q._id.toString()),
  }));

  const overallSolved = await UserCompanyProgress.countDocuments({
    userId: req.user._id,
    companyId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        company: {
          ...company,
          solvedCount: overallSolved,
          percentSolved: company.totalQuestions
            ? Math.round((overallSolved / company.totalQuestions) * 100)
            : 0,
        },
        questions: questionsWithStatus,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalMatched,
          totalPages: Math.ceil(totalMatched / Number(limit)),
        },
      },
      "Company questions fetched",
    ),
  );
});

export const getCompanyTopics = asyncHandler(async (req, res) => {
  const { companyId } = req.params;

  const topics = await CompanyQuestion.distinct("topics", { companyId });

  return res
    .status(200)
    .json(new ApiResponse(200, topics.sort(), "Topics fetched"));
});

// POST /companies/:companyId/questions/:questionId/toggle
export const toggleCompanyQuestionProgress = asyncHandler(async (req, res) => {
  const { companyId, questionId } = req.params;

  const question = await CompanyQuestion.findOne({
    _id: questionId,
    companyId,
  });
  if (!question) throw new ApiError(404, "Question not found for this company");

  const existing = await UserCompanyProgress.findOne({
    userId: req.user._id,
    questionId,
  });

  if (existing) {
    await existing.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, { completed: false }, "Marked as incomplete"));
  }

  await UserCompanyProgress.create({
    userId: req.user._id,
    companyId,
    questionId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { completed: true }, "Marked as complete"));
});
