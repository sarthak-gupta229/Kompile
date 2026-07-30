import mongoose from "mongoose";
import { Sheet } from "../models/sheet.models.js";
import { SheetTopic } from "../models/sheetTopic.models.js";
import { SheetQuestion } from "../models/sheetQuestion.models.js";

const RAW_COLLECTION = "strivers_A2Z_sheet";

const pickPrimaryLink = (problem) =>
  problem.leetcode_link || problem.gfg_link || problem.article_link || "";

export const migrateStriverA2Z = async () => {
  const rawDoc = await mongoose.connection.db
    .collection(RAW_COLLECTION)
    .findOne({});

  if (!rawDoc) {
    console.log(`No document found in ${RAW_COLLECTION}, skipping.`);
    return;
  }

  const sheet = await Sheet.findOneAndUpdate(
    { slug: "strivers-a2z" },
    {
      $set: {
        name: rawDoc.sheet_name || "Strivers A2Z DSA Sheet",
        description:
          "Learn DSA from A to Z in a well-organized, structured way, compiled by Raj Vikramaditya (Striver).",
        source: "striver",
      },
    },
    { upsert: true, new: true },
  );

  let totalQuestions = 0;

  for (let stepIndex = 0; stepIndex < rawDoc.steps.length; stepIndex++) {
    const stepDoc = rawDoc.steps[stepIndex];

    const stepTopic = await SheetTopic.findOneAndUpdate(
      { sheetId: sheet._id, code: stepDoc.step, parentTopicId: null },
      { $set: { name: stepDoc.title, order: stepIndex } },
      { upsert: true, new: true },
    );

    const substeps = stepDoc.substeps || [];
    for (let subIndex = 0; subIndex < substeps.length; subIndex++) {
      const sub = substeps[subIndex];

      const substepTopic = await SheetTopic.findOneAndUpdate(
        {
          sheetId: sheet._id,
          code: sub.substep,
          parentTopicId: stepTopic._id,
        },
        { $set: { name: sub.title, order: subIndex } },
        { upsert: true, new: true },
      );

      const problems = sub.problems || [];
      for (let qIndex = 0; qIndex < problems.length; qIndex++) {
        const p = problems[qIndex];

        await SheetQuestion.findOneAndUpdate(
          { sheetId: sheet._id, topicId: substepTopic._id, title: p.name },
          {
            $set: {
              difficulty: "",
              platform: "",
              links: {
                primary: pickPrimaryLink(p),
                leetcode: p.leetcode_link || "",
                gfg: p.gfg_link || "",
                article: p.article_link || "",
                video: p.video_link || "",
              },
              order: qIndex,
            },
          },
          { upsert: true },
        );
        totalQuestions += 1;
      }
    }
  }

  await Sheet.findByIdAndUpdate(sheet._id, { $set: { totalQuestions } });
  console.log(`Striver A2Z migrated: ${totalQuestions} questions`);
};
