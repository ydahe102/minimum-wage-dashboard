import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";

const projectRoot = path.resolve(import.meta.dirname, "..");
const sourcePath = path.join(projectRoot, "tmp-wages", "wages_general.csv");
const outputPath = path.join(projectRoot, "public", "data", "wages_clean.csv");

function parseWage(value) {
  if (!value) return null;
  const parsed = Number(String(value).replace(/[$,\s]/g, ""));
  return Number.isNaN(parsed) ? null : parsed;
}

const source = fs.readFileSync(sourcePath, "utf8");
const parsed = Papa.parse(source, {
  header: true,
  skipEmptyLines: true,
});

const grouped = new Map();

for (const row of parsed.data) {
  const wage = parseWage(row.wage);
  if (wage == null || !row.jurisdiction || !row.effective_date) continue;

  const key = `${row.jurisdiction}__${row.effective_date}`;
  const existing = grouped.get(key);
  const cleaned = {
    jurisdiction: row.jurisdiction.trim(),
    effective_date: row.effective_date.trim(),
    wage: wage.toFixed(2),
    note: row.note?.trim() ?? "",
  };

  if (!existing || Number(cleaned.wage) > Number(existing.wage)) {
    grouped.set(key, cleaned);
  } else if (existing && cleaned.note && !existing.note.includes(cleaned.note)) {
    existing.note = [existing.note, cleaned.note].filter(Boolean).join(" ");
  }
}

const rows = [...grouped.values()].sort((a, b) => {
  const jurisdictionCompare = a.jurisdiction.localeCompare(b.jurisdiction);
  if (jurisdictionCompare !== 0) return jurisdictionCompare;
  return a.effective_date.localeCompare(b.effective_date);
});

const csv = Papa.unparse(rows, {
  columns: ["jurisdiction", "effective_date", "wage", "note"],
});

fs.writeFileSync(outputPath, `${csv}\n`, "utf8");
console.log(`Wrote ${rows.length} rows to ${outputPath}`);
