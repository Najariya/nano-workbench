#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { checkDoctorEvidence, formatResult } = require("./check-doctor-evidence");

const SAFE_TYPES = new Set(["screenshot-ocr", "screenshot-summary", "voice-memo", "meeting-notes"]);
const SAFE_TYPE_RE = "(screenshot-ocr|screenshot-summary|voice-memo|meeting-notes)";

function parseArgs(argv) {
  const args = {
    extensionPath: process.cwd(),
    json: false,
    printReport: false,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--profile") args.profileDir = argv[++i];
    else if (arg === "--extension-id") args.extensionId = argv[++i];
    else if (arg === "--extension-path") args.extensionPath = argv[++i];
    else if (arg === "--json") args.json = true;
    else if (arg === "--print-report") args.printReport = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function defaultProfileDir() {
  return path.join(os.homedir(), "Library/Application Support/Google/Chrome/Default");
}

function readJsonMaybe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function findExtensionId(profileDir, extensionPath) {
  const wanted = path.resolve(extensionPath || process.cwd());
  const prefs = ["Secure Preferences", "Preferences"]
    .map((file) => readJsonMaybe(path.join(profileDir, file)))
    .filter(Boolean);

  for (const pref of prefs) {
    const settings = pref.extensions && pref.extensions.settings;
    if (!settings) continue;
    for (const [id, entry] of Object.entries(settings)) {
      const candidatePath = entry && entry.path;
      if (candidatePath && path.resolve(candidatePath) === wanted) return id;
    }
  }

  return "";
}

function listFiles(rootDir) {
  const out = [];
  if (!fs.existsSync(rootDir)) return out;
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile()) out.push(full);
    }
  }
  return out;
}

function printableStrings(buffer) {
  const strings = [];
  let current = "";
  for (const byte of buffer) {
    if (byte >= 32 && byte <= 126) current += String.fromCharCode(byte);
    else {
      if (current.length >= 8) strings.push(current);
      current = "";
    }
  }
  if (current.length >= 8) strings.push(current);
  return strings;
}

function decodeJsonString(value) {
  if (!value) return "";
  try {
    return JSON.parse(`"${value}"`);
  } catch {
    return value;
  }
}

function sanitize(value) {
  return String(value || "")
    .replace(/https?:\/\/[^\s)"]+/g, "[url]")
    .replace(/\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g, "[email]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 260);
}

function evidenceLinesFromText(text) {
  const lines = [];
  const typePattern = new RegExp(`"type"\\s*:\\s*"${SAFE_TYPE_RE}"`, "gi");

  for (const match of text.matchAll(typePattern)) {
    const type = match[1];
    if (!SAFE_TYPES.has(type)) continue;
    const nextType = text.indexOf('"type"', match.index + match[0].length);
    const block = text.slice(match.index, nextType > match.index ? nextType : match.index + 1200);
    const messageMatch = /"message"\s*:\s*"((?:\\.|[^"\\])*)"/.exec(block);
    const hintMatch = /"hint"\s*:\s*"((?:\\.|[^"\\])*)"/.exec(block);
    const message = sanitize(decodeJsonString(messageMatch && messageMatch[1]));
    const hint = sanitize(decodeJsonString(hintMatch && hintMatch[1]));
    if (message) lines.push(`[stored] ${type}: ${message}${hint ? ` - ${hint}` : ""}`);
  }

  const reportLinePattern = new RegExp(`\\[[^\\]]+\\]\\s*${SAFE_TYPE_RE}:\\s*([^\\r\\n]{1,300})`, "gi");
  for (const match of text.matchAll(reportLinePattern)) {
    const type = match[1];
    const rest = sanitize(match[2]);
    if (SAFE_TYPES.has(type) && rest) lines.push(`[stored] ${type}: ${rest}`);
  }

  return lines;
}

function collectEvidenceLines(profileDir, extensionId) {
  const candidateDirs = [
    path.join(profileDir, "Local Extension Settings", extensionId),
    path.join(profileDir, "IndexedDB", `chrome-extension_${extensionId}_0.indexeddb.leveldb`),
  ];
  const seen = new Set();
  const lines = [];
  for (const dir of candidateDirs) {
    for (const file of listFiles(dir)) {
      let buffer;
      try {
        buffer = fs.readFileSync(file);
      } catch {
        continue;
      }
      for (const text of printableStrings(buffer)) {
        if (!new RegExp(SAFE_TYPE_RE, "i").test(text)) continue;
        for (const line of evidenceLinesFromText(text)) {
          if (!seen.has(line)) {
            seen.add(line);
            lines.push(line);
          }
        }
      }
    }
  }
  return lines;
}

function buildDoctorReport(lines) {
  return [
    "Local AI Workbench Doctor",
    "",
    "Recent workflow evidence",
    ...(lines.length ? lines : ["No recent screenshot OCR, voice memo, or meeting notes evidence yet."]),
    "",
  ].join("\n");
}

function usage() {
  return [
    "Usage: node tools/check-live-workflow-evidence.js [options]",
    "",
    "Options:",
    "  --profile <dir>          Chrome profile directory. Defaults to Chrome Default profile.",
    "  --extension-id <id>      Extension id. Defaults to the unpacked extension matching cwd.",
    "  --extension-path <dir>   Unpacked extension path used for id lookup. Defaults to cwd.",
    "  --print-report          Print the reconstructed safe Doctor evidence report.",
    "  --json                  Print JSON output.",
  ].join("\n");
}

function main(argv = process.argv) {
  const args = parseArgs(argv);
  if (args.help) return { help: usage() };
  const profileDir = path.resolve(args.profileDir || defaultProfileDir());
  const extensionPath = path.resolve(args.extensionPath || process.cwd());
  const extensionId = args.extensionId || findExtensionId(profileDir, extensionPath);
  if (!extensionId) {
    throw new Error(
      `Could not find an unpacked extension id for ${extensionPath}. Pass --extension-id manually.`,
    );
  }
  const evidenceLines = collectEvidenceLines(profileDir, extensionId);
  const report = buildDoctorReport(evidenceLines);
  const result = checkDoctorEvidence(report);
  return { profileDir, extensionId, extensionPath, evidenceLines, report, result };
}

if (require.main === module) {
  try {
    const output = main();
    if (output.help) {
      console.log(output.help);
    } else if (parseArgs(process.argv).json) {
      console.log(
        JSON.stringify(
          {
            profileDir: output.profileDir,
            extensionId: output.extensionId,
            extensionPath: output.extensionPath,
            evidenceCount: output.evidenceLines.length,
            result: output.result,
          },
          null,
          2,
        ),
      );
    } else {
      console.log("Live workflow evidence scan");
      console.log(`Profile: ${output.profileDir}`);
      console.log(`Extension ID: ${output.extensionId}`);
      console.log(`Extension path: ${output.extensionPath}`);
      console.log(`Evidence lines: ${output.evidenceLines.length}`);
      console.log("");
      console.log(formatResult(output.result));
      if (parseArgs(process.argv).printReport) {
        console.log("");
        console.log(output.report.trimEnd());
      }
    }
    process.exitCode = output.help || output.result.ok ? 0 : 1;
  } catch (error) {
    console.error(error.message || String(error));
    process.exitCode = 1;
  }
}

module.exports = {
  buildDoctorReport,
  collectEvidenceLines,
  evidenceLinesFromText,
  findExtensionId,
  main,
};
