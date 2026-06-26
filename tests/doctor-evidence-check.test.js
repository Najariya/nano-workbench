const assert = require("node:assert/strict");

const {
  checkDoctorEvidence,
  formatResult,
  IMP_GATES,
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

const startedOnlyReport = `
Local AI Workbench Doctor

Recent workflow evidence
[10:00:01] screenshot-ocr: Screenshot OCR completed - 2 slice(s), confidence medium
[10:00:02] screenshot-summary: Screenshot text summarized - Summary generated locally without storing screenshot text in diagnostics.
[10:00:03] voice-memo: Started quick voice memo - Chrome Speech Recognition; transcript text is not stored in diagnostics.
[10:00:04] meeting-notes: Started microphone recording - Chrome Speech Recognition; transcript text is not stored in diagnostics.
`;

assert.equal(REQUIRED_EVENTS.length, 4);
assert.deepEqual(
  IMP_GATES.map((gate) => gate.id),
  ["IMP-032", "IMP-031", "IMP-028"],
);

const complete = checkDoctorEvidence(completeReport);
assert.equal(complete.ok, true);
assert.equal(complete.hasWorkflowSection, true);
assert.deepEqual(
  complete.present.map((item) => item.type),
  ["screenshot-ocr", "screenshot-summary", "voice-memo", "meeting-notes"],
);
assert.deepEqual(complete.missing, []);
assert.deepEqual(
  complete.impResults.map((item) => [item.id, item.ok]),
  [
    ["IMP-032", true],
    ["IMP-031", true],
    ["IMP-028", true],
  ],
);
assert.match(formatResult(complete), /Doctor completion gate: PASS/);
assert.match(formatResult(complete), /IMP-032 Screenshot OCR: PASS/);
assert.match(formatResult(complete), /IMP-031 Voice memo: PASS/);
assert.match(formatResult(complete), /IMP-028 Meeting notes: PASS/);

const missing = checkDoctorEvidence(missingReport);
assert.equal(missing.ok, false);
assert.equal(missing.hasWorkflowSection, true);
assert.deepEqual(
  missing.missing.map((item) => item.type),
  ["screenshot-summary", "meeting-notes"],
);
assert.match(formatResult(missing), /Missing: screenshot-summary, meeting-notes/);
assert.match(formatResult(missing), /IMP-032 Screenshot OCR: FAIL/);
assert.match(formatResult(missing), /IMP-028 Meeting notes: FAIL/);

const startedOnly = checkDoctorEvidence(startedOnlyReport);
assert.equal(startedOnly.ok, false);
assert.equal(startedOnly.impResults.find((item) => item.id === "IMP-031").ok, false);
assert.equal(startedOnly.impResults.find((item) => item.id === "IMP-028").ok, false);
assert.match(formatResult(startedOnly), /missing saved-workflow completion evidence/);

const noSection = checkDoctorEvidence("No recent evidence yet.");
assert.equal(noSection.ok, false);
assert.equal(noSection.hasWorkflowSection, false);

const unsafeReport = completeReport.replace(
  "transcript text is not stored in diagnostics.",
  "transcript saved.",
);
const unsafe = checkDoctorEvidence(unsafeReport);
assert.equal(unsafe.ok, false);
assert.equal(unsafe.impResults.find((item) => item.id === "IMP-031").ok, false);
assert.match(formatResult(unsafe), /missing safe-diagnostics privacy phrase/);

console.log("doctor-evidence-check.test.js passed");
