import mongoose from "mongoose";
import { Sheet } from "../models/sheet.models.js";
import { SheetTopic } from "../models/sheetTopic.models.js";
import { SheetQuestion } from "../models/sheetQuestion.models.js";

// raw collection already sitting in Atlas: love_babbar_sheet (1 document)
const RAW_COLLECTION = "love_babbar_sheet";

export const migrateLoveBabbar = async () => {
  const rawDoc = await mongoose.connection.db
    .collection(RAW_COLLECTION)
    .findOne({});

  if (!rawDoc) {
    console.log(`No document found in ${RAW_COLLECTION}, skipping.`);
    return;
  }

  const sheet = await Sheet.findOneAndUpdate(
    { slug: "love-babbar-450" },
    {
      $set: {
        name: rawDoc.sheet_name || "Love Babbar Sheet",
        description:
          "The DSA sheet by Love Babbar covering almost every concept in Data Structures and Algorithms.",
        source: "loveBabbar",
      },
    },
    { upsert: true, new: true },
  );

  let totalQuestions = 0;
  let topicOrder = 0;

  for (const [topicName, questions] of Object.entries(rawDoc.topics)) {
    const topic = await SheetTopic.findOneAndUpdate(
      { sheetId: sheet._id, name: topicName, parentTopicId: null },
      { $set: { order: topicOrder } },
      { upsert: true, new: true },
    );
    topicOrder += 1;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      await SheetQuestion.findOneAndUpdate(
        { sheetId: sheet._id, topicId: topic._id, title: q.title },
        {
          $set: {
            difficulty: q.difficulty || "",
            platform: q.platform || "",
            "links.primary": q.link || "",
            order: i,
          },
        },
        { upsert: true },
      );
      totalQuestions += 1;
    }
  }

  await Sheet.findByIdAndUpdate(sheet._id, { $set: { totalQuestions } });
  console.log(
    `Love Babbar migrated: ${totalQuestions} questions across ${topicOrder} topics`,
  );
};
