import { createHash } from "node:crypto";
import mongoose from "mongoose";
import { parse } from "csv-parse/sync";
import { Sheet } from "../models/sheet.models.js";
import { SheetTopic } from "../models/sheetTopic.models.js";
import { SheetQuestion } from "../models/sheetQuestion.models.js";
import { ApiError } from "../utils/api-error.js";

const linkColumns = ["primary", "leetcode", "gfg", "article", "video"];
const columns = ["question_id", "topic", "subtopic", "topic_path", "title", "difficulty", ...linkColumns];
const normalize = (value) => value.trim().toLowerCase();
const questionKey = (topicId, title) => JSON.stringify([String(topicId), normalize(title)]);
const topicKey = (parent, name) => JSON.stringify([String(parent ?? ""), normalize(name)]);

function parseRows(csv) {
  if (typeof csv !== "string" || !csv.trim()) throw new ApiError(400, "Upload a CSV file.");
  try {
    return parse(csv, {
      bom: true,
      trim: true,
      skip_empty_lines: true,
      info: true,
      columns: (headers) => {
        const keys = headers.map(normalize);
        if (new Set(keys).size !== keys.length || keys.some((key) => !columns.includes(key)) ||
            !["topic", "title"].every((key) => keys.includes(key))) {
          throw new Error("Use the template headers and include topic and title.");
        }
        return keys;
      },
    });
  } catch (error) {
    throw new ApiError(400, `Invalid CSV. ${error.lines ? `Check row ${error.lines} for malformed columns or quoting.` : error.message}`);
  }
}

function csvCell(value = "") {
  const text = String(value ?? "");
  const safe = /^[=+\-@\t\r\n]/.test(text) ? "'" + text : text;
  return '"' + safe.replaceAll('"', '""') + '"';
}

function readCell(record, key) {
  const value = (record[key] ?? "").trim();
  return /^'[=+\-@]/.test(value) ? value.slice(1) : value;
}

function validLink(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function sheetTemplate() {
  return columns.join(",") + "\n";
}

export async function sheetCsv(sheet) {
  const [topics, questions] = await Promise.all([
    SheetTopic.find({ sheetId: sheet._id }).lean(),
    SheetQuestion.find({ sheetId: sheet._id }).sort({ order: 1, _id: 1 }).lean(),
  ]);
  const byId = new Map(topics.map((topic) => [String(topic._id), topic]));
  return sheetTemplate() + questions.map((question) => {
    const path = [];
    const visited = new Set();
    let topic = byId.get(String(question.topicId));
    while (topic && !visited.has(String(topic._id))) {
      visited.add(String(topic._id));
      path.unshift(topic.name);
      topic = byId.get(String(topic.parentTopicId));
    }
    return [
      String(question._id), path[0], path[1], path.length > 2 ? JSON.stringify(path) : "",
      question.title, question.difficulty, ...linkColumns.map((key) => question.links?.[key]),
    ].map(csvCell).join(",");
  }).join("\n");
}

export async function planSheetImport(input, session = null) {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const sheetId = input.sheetId || null;
  if (!name || name.length > 120 || description.length > 1000) {
    throw new ApiError(400, "Enter a sheet name of 1–120 characters and a description up to 1,000 characters.");
  }
  if (sheetId && !mongoose.isObjectIdOrHexString(sheetId)) throw new ApiError(400, "Invalid sheet ID.");
  const rows = parseRows(input.csv);
  if (!rows.length || rows.length > 5000) throw new ApiError(400, "Upload between 1 and 5,000 question rows.");
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  let sheet = null;
  let topics = [];
  let questions = [];
  if (sheetId) {
    sheet = await Sheet.findOne({ _id: sheetId, deletedAt: null }).session(session).lean();
    if (!sheet) throw new ApiError(404, "Sheet not found.");
    topics = await SheetTopic.find({ sheetId }).sort({ _id: 1 }).session(session).lean();
    questions = await SheetQuestion.find({ sheetId }).sort({ _id: 1 }).session(session).lean();
  } else if (!slug || await Sheet.exists({ slug }).session(session)) {
    throw new ApiError(409, "Choose a unique sheet name containing letters or numbers.");
  }

  const revision = createHash("sha256")
    .update(JSON.stringify([name, description, input.csv, sheet, topics, questions]))
    .digest("hex");
  const topicsByName = new Map(topics.map((topic) => [topicKey(topic.parentTopicId, topic.name), topic]));
  const questionsById = new Map(questions.map((question) => [String(question._id), question]));
  const existingByKey = new Map(questions.map((question) => [questionKey(question.topicId, question.title), question]));
  const seenKeys = new Set();
  const seenIds = new Set();
  const newTopics = [];
  const changes = [];
  const errors = [];
  const warnings = [];
  let nextTopicOrder = topics.reduce((max, topic) => Math.max(max, topic.order), -1) + 1;
  let nextQuestionOrder = questions.reduce((max, question) => Math.max(max, question.order), -1) + 1;

  function ensureTopic(topicName, parent) {
    const parentTopicId = parent?._id ?? null;
    const key = topicKey(parentTopicId, topicName);
    if (!topicsByName.has(key)) {
      const _id = new mongoose.Types.ObjectId();
      const order = nextTopicOrder++;
      const code = parent ? `${parent.code ?? parent.order + 1}.${order + 1}` : String(order + 1);
      const topic = { _id, parentTopicId, name: topicName, code, order };
      topicsByName.set(key, topic);
      newTopics.push(topic);
    }
    return topicsByName.get(key);
  }

  for (const { record, info } of rows) {
    const row = info.lines;
    const id = readCell(record, "question_id").toLowerCase();
    const title = readCell(record, "title");
    const topicName = readCell(record, "topic");
    const subtopic = readCell(record, "subtopic");
    const topicPath = readCell(record, "topic_path");
    let path = [topicName, subtopic].filter(Boolean);
    if (topicPath) {
      try {
        path = JSON.parse(topicPath);
        if (!Array.isArray(path) || path.length < 3 || path.length > 25 ||
            path.some((part) => typeof part !== "string" || !part.trim() || part.trim().length > 250)) {
          throw new Error();
        }
        path = path.map((part) => part.trim());
      } catch {
        errors.push({ row, message: "Topic path must be a JSON array of 3–25 topic names. Leave it blank for topic and subtopic." });
        continue;
      }
    }
    const difficulty = normalize(readCell(record, "difficulty"));
    const links = Object.fromEntries(linkColumns.map((key) => [key, readCell(record, key)]));
    const existing = questionsById.get(id);
    if (!title || !topicName || [title, topicName, subtopic].some((value) => value.length > 250)) {
      errors.push({ row, message: "Topic and title are required. Names can contain up to 250 characters." });
      continue;
    }
    if (difficulty && !["easy", "medium", "hard"].includes(difficulty)) {
      errors.push({ row, message: "Difficulty must be easy, medium, hard, or blank." });
      continue;
    }
    if (Object.values(links).some((value) => !validLink(value))) {
      errors.push({ row, message: "Links must be valid HTTP or HTTPS URLs." });
      continue;
    }
    if (id && !existing) {
      errors.push({ row, message: "Question ID does not belong to this sheet. Leave it blank for new questions." });
      continue;
    }
    const topic = path.reduce((parent, part) => ensureTopic(part, parent), null);
    const key = questionKey(topic._id, title);
    if (seenKeys.has(key) || (id && seenIds.has(id))) {
      errors.push({ row, message: "Duplicate question or question ID in the CSV." });
      continue;
    }
    if (existingByKey.has(key) && String(existingByKey.get(key)._id) !== id) {
      errors.push({ row, message: "This question already exists. Use its question_id from the sheet export." });
      continue;
    }
    seenKeys.add(key);
    if (id) seenIds.add(id);
    const platform = links.leetcode ? "leetcode" : links.gfg ? "gfg" : existing?.platform ?? "";
    const update = { topicId: topic._id, title, difficulty, platform, links, order: existing?.order ?? nextQuestionOrder++ };
    const changed = !existing || ["topicId", "title", "difficulty", "platform"].some((field) =>
      String(existing[field] ?? "") !== String(update[field] ?? "")) ||
      linkColumns.some((field) => (existing?.links?.[field] ?? "") !== links[field]);
    changes.push({ id, row, title, topic: path.join(" / "),
      action: existing ? (changed ? "Edit" : "Unchanged") : "Add", update });
  }
  if (sheet && questions.length > seenIds.size) {
    warnings.push("Existing questions omitted from this CSV stay in the sheet.");
  }

  return { name, description, slug, revision, sheet, newTopics, changes, existingCount: questions.length, errors, warnings };
}

export function sheetPreview(plan) {
  const rows = plan.changes.map(({ row, title, topic, action }) => ({ row, title, topic, action }));
  return {
    revision: plan.revision, errors: plan.errors, warnings: plan.warnings, rows,
    topicsAdded: plan.newTopics.length,
    added: rows.filter(({ action }) => action === "Add").length,
    edited: rows.filter(({ action }) => action === "Edit").length,
  };
}

export async function publishSheet(input) {
  try {
    return await mongoose.connection.transaction(async (session) => {
      const plan = await planSheetImport(input, session);
      if (plan.errors.length) throw new ApiError(400, "Fix the CSV errors before publishing.", plan.errors);
      if (input.revision !== plan.revision) throw new ApiError(409, "The import changed. Preview it again before publishing.");
      const totalQuestions = plan.existingCount + plan.changes.filter(({ action }) => action === "Add").length;
      const fields = { name: plan.name, description: plan.description, totalQuestions };
      const sheet = plan.sheet
        ? await Sheet.findByIdAndUpdate(plan.sheet._id, { $set: fields, $inc: { __v: 1 } }, { session, returnDocument: "after" })
        : (await Sheet.create([{ ...fields, slug: plan.slug }], { session }))[0];
      const sheetId = sheet._id;
      if (plan.newTopics.length) {
        await SheetTopic.insertMany(plan.newTopics.map((topic) => ({ ...topic, sheetId })), { session });
      }
      const writes = plan.changes.filter(({ action }) => action !== "Unchanged").map(({ id, update }) =>
        id ? { updateOne: { filter: { _id: id, sheetId }, update: { $set: update } } }
          : { insertOne: { document: { ...update, sheetId } } });
      if (writes.length) await SheetQuestion.bulkWrite(writes, { session });
      return { _id: sheetId, name: sheet.name, slug: sheet.slug, totalQuestions };
    });
  } catch (error) {
    if (error.code === 11000) throw new ApiError(409, "The sheet name is already in use. Preview the import again.");
    throw error;
  }
}
