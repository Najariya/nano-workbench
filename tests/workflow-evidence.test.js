const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("sidepanel.js", "utf8");
const html = fs.readFileSync("sidepanel.html", "utf8");

assert.match(source, /const QA_EVIDENCE_TYPES=new Set\(\["screenshot","screenshot-ocr","screenshot-summary","voice-memo","meeting-notes"\]\)/);
assert.match(source, /function workflowEvidenceReport\(\)/);
assert.match(source, /const IMP_EVIDENCE_GATES=/);
assert.match(source, /completionTypes:\["voice-memo"\]/);
assert.match(source, /completion:\/Saved quick voice memo\/i/);
assert.match(source, /completionTypes:\["meeting-notes"\]/);
assert.match(source, /Saved summarized meeting note\|Saved meeting transcript without AI summary/);
assert.match(source, /function workflowCompletionGateResults\(\)/);
assert.match(source, /function workflowCompletionGateReport\(\)/);
assert.match(source, /IMP completion gates/);
assert.match(source, /Doctor completion gate: /);
assert.match(source, /completionEvidence/);
assert.match(source, /missing saved-workflow completion evidence/);
assert.match(source, /IMP-032/);
assert.match(source, /IMP-031/);
assert.match(source, /IMP-028/);
assert.match(source, /Recent workflow evidence/);
assert.match(source, /No recent screenshot OCR, voice memo, or meeting notes evidence yet\./);
assert.match(source, /lastDoctorReport=.*workflowEvidenceReport\(\).*workflowCompletionGateReport\(\)/);
assert.match(source, /workflowCompletionGateResults\(\)\.forEach/);
assert.match(html, /id="doctorEvidenceCopy"/);
assert.match(html, />Copy evidence</);
assert.match(source, /doctorEvidenceCopyBtn=\$\("doctorEvidenceCopy"\)/);
assert.match(source, /workflowEvidenceReport\(\)\+"\\n\\n"\+workflowCompletionGateReport\(\)/);
assert.match(source, /Workflow evidence copied/);

assert.match(source, /recordDiag\("screenshot-ocr"/);
assert.match(source, /Screenshot OCR completed/);
assert.match(source, /slice\(s\), confidence/);
assert.match(source, /recordDiag\("screenshot-summary"/);
assert.match(source, /Summary generated locally without storing screenshot text in diagnostics\./);

assert.match(source, /recordDiag\("meeting-notes","Started microphone recording"/);
assert.match(source, /recordDiag\("meeting-notes","Saved summarized meeting note"/);
assert.match(source, /recordDiag\("meeting-notes","Saved meeting transcript without AI summary"/);
assert.match(source, /transcript text is not stored in diagnostics/);

assert.match(source, /recordDiag\("voice-memo","Started quick voice memo"/);
assert.match(source, /recordDiag\("voice-memo",a\?"Saved quick voice memo transcript without AI cleanup":"Saved quick voice memo"/);
assert.match(source, /Saved quick voice memo transcript without AI cleanup/);
assert.match(source, /Chrome Speech Recognition; transcript text is not stored in diagnostics\./);

assert.doesNotMatch(source, /recordDiag\("screenshot-ocr"[^;]+a\.text/);
assert.doesNotMatch(source, /recordDiag\("meeting-notes"[^;]+transcript:e/);
assert.doesNotMatch(source, /recordDiag\("voice-memo"[^;]+transcript:e/);

console.log("workflow-evidence.test.js passed");
