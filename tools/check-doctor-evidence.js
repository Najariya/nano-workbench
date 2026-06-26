#!/usr/bin/env node
"use strict";

const fs = require("node:fs");

const REQUIRED_EVENTS = [
  { type: "screenshot-ocr", label: "Screenshot OCR" },
  { type: "screenshot-summary", label: "Screenshot summary" },
  { type: "voice-memo", label: "Voice memo" },
  { type: "meeting-notes", label: "Meeting notes" },
];

const IMP_GATES = [
  {
    id: "IMP-032",
    label: "Screenshot OCR",
    requires: ["screenshot-ocr", "screenshot-summary"],
    completionTypes: ["screenshot-summary"],
    completionPattern: /Screenshot text summarized/i,
    privacyTypes: ["screenshot-summary"],
    privacyPattern: /without storing screenshot text/i,
  },
  {
    id: "IMP-031",
    label: "Voice memo",
    requires: ["voice-memo"],
    completionTypes: ["voice-memo"],
    completionPattern: /Saved quick voice memo/i,
    privacyTypes: ["voice-memo"],
    privacyPattern: /transcript text is not stored in diagnostics/i,
  },
  {
    id: "IMP-028",
    label: "Meeting notes",
    requires: ["meeting-notes"],
    completionTypes: ["meeting-notes"],
    completionPattern: /Saved summarized meeting note|Saved meeting transcript without AI summary/i,
    privacyTypes: ["meeting-notes"],
    privacyPattern: /transcript text is not stored in diagnostics/i,
  },
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

  const presentTypes = new Set(present.map((item) => item.type));
  const workflowLines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const impResults = IMP_GATES.map((gate) => {
    const missingTypes = gate.requires.filter((type) => !presentTypes.has(type));
    const privacyEvidence = workflowLines.some((line) => {
      return (
        gate.privacyTypes.some((type) => new RegExp(`\\b${type}\\b`, "i").test(line)) &&
        gate.privacyPattern.test(line)
      );
    });
    const completionEvidence = workflowLines.some((line) => {
      return (
        gate.completionTypes.some((type) => new RegExp(`\\b${type}\\b`, "i").test(line)) &&
        gate.completionPattern.test(line)
      );
    });
    return {
      id: gate.id,
      label: gate.label,
      ok: missingTypes.length === 0 && privacyEvidence && completionEvidence,
      missingTypes,
      privacyEvidence,
      completionEvidence,
    };
  });

  return {
    ok: hasWorkflowSection && missing.length === 0 && impResults.every((item) => item.ok),
    hasWorkflowSection,
    present,
    missing,
    impResults,
  };
}

function formatResult(result) {
  const lines = [];
  lines.push(`Doctor completion gate: ${result.ok ? "PASS" : "FAIL"}`);
  lines.push(`Workflow section: ${result.hasWorkflowSection ? "present" : "missing"}`);
  lines.push(
    "Present: " +
      (result.present.length ? result.present.map((item) => item.type).join(", ") : "none"),
  );
  lines.push(
    "Missing: " +
      (result.missing.length ? result.missing.map((item) => item.type).join(", ") : "none"),
  );
  for (const item of result.impResults || []) {
    const gaps = [];
    if (item.missingTypes.length) gaps.push(`missing ${item.missingTypes.join(", ")}`);
    if (!item.privacyEvidence) gaps.push("missing safe-diagnostics privacy phrase");
    if (!item.completionEvidence) gaps.push("missing saved-workflow completion evidence");
    lines.push(
      `${item.id} ${item.label}: ${item.ok ? "PASS" : "FAIL"}${gaps.length ? ` (${gaps.join("; ")})` : ""}`,
    );
  }
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
  IMP_GATES,
  REQUIRED_EVENTS,
  checkDoctorEvidence,
  formatResult,
};
