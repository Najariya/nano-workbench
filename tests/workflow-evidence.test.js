const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("sidepanel.js", "utf8");

assert.match(source, /const QA_EVIDENCE_TYPES=new Set\(\["screenshot","screenshot-ocr","screenshot-summary","voice-memo","meeting-notes"\]\)/);
assert.match(source, /function workflowEvidenceReport\(\)/);
assert.match(source, /Recent workflow evidence/);
assert.match(source, /No recent screenshot OCR, voice memo, or meeting notes evidence yet\./);
assert.match(source, /lastDoctorReport=.*workflowEvidenceReport\(\)/);

assert.match(source, /recordDiag\("screenshot-ocr"/);
assert.match(source, /Screenshot OCR completed/);
assert.match(source, /slice\(s\), confidence/);
assert.match(source, /recordDiag\("screenshot-summary"/);
assert.match(source, /Summary generated locally without storing screenshot text in diagnostics\./);

assert.match(source, /recordDiag\("meeting-notes","Started microphone recording"/);
assert.match(source, /recordDiag\("meeting-notes","Saved summarized meeting note"/);
assert.match(source, /transcript text is not stored in diagnostics/);

assert.match(source, /recordDiag\("voice-memo","Started quick voice memo"/);
assert.match(source, /recordDiag\("voice-memo","Saved quick voice memo"/);
assert.match(source, /Chrome Speech Recognition; transcript text is not stored in diagnostics\./);

assert.doesNotMatch(source, /recordDiag\("screenshot-ocr"[^;]+a\.text/);
assert.doesNotMatch(source, /recordDiag\("meeting-notes"[^;]+transcript:e/);
assert.doesNotMatch(source, /recordDiag\("voice-memo"[^;]+transcript:e/);

console.log("workflow-evidence.test.js passed");
