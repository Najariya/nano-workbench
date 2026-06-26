const assert = require("node:assert/strict");

const {
  checkDoctorEvidence,
  formatResult,
  REQUIRED_EVENTS,
} = require("../tools/check-doctor-evidence");

const completeReport = `
Local AI Workbench Doctor

Recent workflow evidence
[10:00:01] screenshot-ocr: Screenshot OCR completed - 2 slice(s), confidence medium
[10:00:02] screenshot-summary: Screenshot text summarized - Summary generated locally without storing screenshot text in diagnostics.
[10:00:03] voice-memo: Saved quick voice memo - 12 words; transcript text is not stored in diagnostics.
[10:00:04] meeting-notes: Saved summarized meeting note - 22 words, 8 seconds; transcript text is not stored in diagnostics.
`;

const missingReport = `
Local AI Workbench Doctor

Recent workflow evidence
[10:00:01] screenshot-ocr: Screenshot OCR completed
[10:00:03] voice-memo: Saved quick voice memo
`;

assert.equal(REQUIRED_EVENTS.length, 4);

const complete = checkDoctorEvidence(completeReport);
assert.equal(complete.ok, true);
assert.equal(complete.hasWorkflowSection, true);
assert.deepEqual(
  complete.present.map((item) => item.type),
  ["screenshot-ocr", "screenshot-summary", "voice-memo", "meeting-notes"],
);
assert.deepEqual(complete.missing, []);
assert.match(formatResult(complete), /Doctor workflow evidence: PASS/);

const missing = checkDoctorEvidence(missingReport);
assert.equal(missing.ok, false);
assert.equal(missing.hasWorkflowSection, true);
assert.deepEqual(
  missing.missing.map((item) => item.type),
  ["screenshot-summary", "meeting-notes"],
);
assert.match(formatResult(missing), /Missing: screenshot-summary, meeting-notes/);

const noSection = checkDoctorEvidence("No recent evidence yet.");
assert.equal(noSection.ok, false);
assert.equal(noSection.hasWorkflowSection, false);

console.log("doctor-evidence-check.test.js passed");
