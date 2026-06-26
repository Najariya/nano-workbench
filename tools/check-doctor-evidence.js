#!/usr/bin/env node
"use strict";

const fs = require("node:fs");

const REQUIRED_EVENTS = [
  { type: "screenshot-ocr", label: "Screenshot OCR" },
  { type: "screenshot-summary", label: "Screenshot summary" },
  { type: "voice-memo", label: "Voice memo" },
  { type: "meeting-notes", label: "Meeting notes" },
];

function checkDoctorEvidence(reportText) {
  const text = String(reportText || "");
  const hasWorkflowSection = /Recent workflow evidence/i.test(text);
  const present = [];
  const missing = [];

  for (const item of REQUIRED_EVENTS) {
    const found = new RegExp(`\\b${item.type}\\b`, "i").test(text);
    (found ? present : missing).push(item);
  }

  return {
    ok: hasWorkflowSection && missing.length === 0,
    hasWorkflowSection,
    present,
    missing,
  };
}

function formatResult(result) {
  const lines = [];
  lines.push(`Doctor workflow evidence: ${result.ok ? "PASS" : "FAIL"}`);
  lines.push(`Workflow section: ${result.hasWorkflowSection ? "present" : "missing"}`);
  lines.push(
    "Present: " +
      (result.present.length ? result.present.map((item) => item.type).join(", ") : "none"),
  );
  lines.push(
    "Missing: " +
      (result.missing.length ? result.missing.map((item) => item.type).join(", ") : "none"),
  );
  return lines.join("\n");
}

function readInput(filePath) {
  if (filePath) return fs.readFileSync(filePath, "utf8");
  if (!process.stdin.isTTY) return fs.readFileSync(0, "utf8");
  throw new Error("Usage: node tools/check-doctor-evidence.js <doctor-report.txt>");
}

if (require.main === module) {
  try {
    const result = checkDoctorEvidence(readInput(process.argv[2]));
    console.log(formatResult(result));
    process.exitCode = result.ok ? 0 : 1;
  } catch (error) {
    console.error(error.message || String(error));
    process.exitCode = 1;
  }
}

module.exports = {
  REQUIRED_EVENTS,
  checkDoctorEvidence,
  formatResult,
};
