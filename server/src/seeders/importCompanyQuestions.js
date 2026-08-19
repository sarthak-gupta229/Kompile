import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";
import { Company } from "../models/company.models.js";
import { CompanyQuestion } from "../models/companyQuestion.models.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Place every "<Company>_Thirty_Days.csv" file here before running
const DATA_DIR = path.join(__dirname, "data", "company-sheets");

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// "1786562329868_AMD_Thirty_Days.csv" -> "AMD"
// "Tcs_Thirty_Days.csv" -> "Tcs"
const extractCompanyName = (filename) => {
  const base = filename.replace(/\.csv$/i, "");
  const withoutLeadingId = base.replace(/^\d+_/, ""); // strip numeric prefix if present
  const withoutSuffix = withoutLeadingId.replace(/_Thirty_Days$/i, "");
  return withoutSuffix.replace(/_/g, " ").trim();
};

const titleCaseDifficulty = (raw) => {
  const map = { EASY: "Easy", MEDIUM: "Medium", HARD: "Hard" };
  return map[raw?.toUpperCase()] || "Medium";
};

const importOneFile = async (filePath, companyName) => {
  const csvContent = fs.readFileSync(filePath, "utf-8");
  const rows = parse(csvContent, { columns: true, skip_empty_lines: true });

  const company = await Company.findOneAndUpdate(
    { slug: slugify(companyName) },
    { $set: { name: companyName } },
    { upsert: true, returnDocument: "after" },
  );

  let count = 0;

  for (const row of rows) {
    const title = row["Title"]?.trim();
    if (!title) continue;

    const topics = (row["Topics"] || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await CompanyQuestion.findOneAndUpdate(
      { companyId: company._id, title },
      {
        $set: {
          difficulty: titleCaseDifficulty(row["Difficulty"]),
          frequency: parseFloat(row["Frequency"]) || 0,
          acceptanceRate: parseFloat(row["Acceptance Rate"]) || 0,
          link: row["Link"]?.trim() || "",
          topics,
        },
      },
      { upsert: true },
    );
    count += 1;
  }

  await Company.findByIdAndUpdate(company._id, { $set: { totalQuestions: count } });
  console.log(`${companyName}: ${count} questions imported`);
};

export const importAllCompanyCsvs = async () => {
  if (!fs.existsSync(DATA_DIR)) {
    console.log(`No data directory found at ${DATA_DIR}, skipping.`);
    return;
  }

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".csv"));

  if (files.length === 0) {
    console.log("No CSV files found to import.");
    return;
  }

  for (const file of files) {
    const companyName = extractCompanyName(file);
    const filePath = path.join(DATA_DIR, file);
    await importOneFile(filePath, companyName);
  }

  console.log(`\nDone. Imported ${files.length} company sheets.`);
};
