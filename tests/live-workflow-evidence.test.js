const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  buildDoctorReport,
  collectEvidenceLines,
  evidenceLinesFromText,
  findExtensionId,
  main,
} = require("../tools/check-live-workflow-evidence");

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "nano-live-evidence-"));
const profile = path.join(tmp, "Default");
const extensionPath = path.join(tmp, "Nano Workbench");
const extensionId = "abcdefghijklmnopabcdefghijklmnop";
fs.mkdirSync(profile, { recursive: true });
fs.mkdirSync(extensionPath, { recursive: true });

fs.writeFileSync(
  path.join(profile, "Secure Preferences"),
  JSON.stringify({
    extensions: {
      settings: {
        [extensionId]: {
          path: extensionPath,
          location: 4,
        },
      },
    },
  }),
);

const idb = path.join(profile, "IndexedDB", `chrome-extension_${extensionId}_0.indexeddb.leveldb`);
fs.mkdirSync(idb, { recursive: true });
fs.writeFileSync(
  path.join(idb, "000003.log"),
  [
    "noise before",
    JSON.stringify({
      type: "screenshot-ocr",
      message: "Screenshot OCR completed for summary",
      hint: "2 slice(s), confidence medium",
      context: "Current tab",
    }),
    JSON.stringify({
      type: "screenshot-summary",
      message: "Screenshot text summarized",
      hint: "Summary generated locally without storing screenshot text in diagnostics.",
      context: "Current tab",
    }),
    JSON.stringify({
      type: "voice-memo",
      message: "Saved quick voice memo",
      hint: "12 words; transcript text is not stored in diagnostics.",
      context: "Generic chat",
    }),
    JSON.stringify({
      type: "meeting-notes",
      message: "Saved meeting transcript without AI summary",
      hint: "21 words, 7 seconds; transcript text is not stored in diagnostics.",
      context: "Generic chat",
    }),
    "private text that should not appear",
  ].join("\0"),
);

assert.equal(findExtensionId(profile, extensionPath), extensionId);

const extracted = collectEvidenceLines(profile, extensionId);
assert.equal(extracted.length, 4);
assert.ok(extracted.every((line) => /^\[stored\] /.test(line)));
assert.ok(extracted.some((line) => /screenshot-summary/.test(line)));
assert.ok(extracted.some((line) => /voice-memo/.test(line)));
assert.ok(extracted.some((line) => /meeting-notes/.test(line)));
assert.ok(!buildDoctorReport(extracted).includes("private text"));

const complete = main([
  "node",
  "tools/check-live-workflow-evidence.js",
  "--profile",
  profile,
  "--extension-path",
  extensionPath,
]);
assert.equal(complete.result.ok, true);

const startedOnly = evidenceLinesFromText(
  JSON.stringify({
    type: "voice-memo",
    message: "Started quick voice memo",
    hint: "Chrome Speech Recognition; transcript text is not stored in diagnostics.",
  }) +
    JSON.stringify({
      type: "meeting-notes",
      message: "Started microphone recording",
      hint: "Chrome Speech Recognition; transcript text is not stored in diagnostics.",
    }),
);
const startedReport = buildDoctorReport([
  "[stored] screenshot-ocr: Screenshot OCR completed - 2 slice(s), confidence medium",
  "[stored] screenshot-summary: Screenshot text summarized - Summary generated locally without storing screenshot text in diagnostics.",
  ...startedOnly,
]);
const started = require("../tools/check-doctor-evidence").checkDoctorEvidence(startedReport);
assert.equal(started.ok, false);
assert.equal(started.impResults.find((item) => item.id === "IMP-031").completionEvidence, false);
assert.equal(started.impResults.find((item) => item.id === "IMP-028").completionEvidence, false);

console.log("live-workflow-evidence.test.js passed");
