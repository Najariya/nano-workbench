const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("sidepanel.js", "utf8");
const html = fs.readFileSync("sidepanel.html", "utf8");

function sliceBetween(start, end) {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, `Missing start marker: ${start}`);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(endIndex, -1, `Missing end marker: ${end}`);
  return source.slice(startIndex, endIndex);
}

const helperSource = sliceBetween(
  "const VOICE_DISCLOSURE",
  "async function startMeetingNotes",
);

const context = {
  Date,
  window: {
    WBExport: {
      safeName(value) {
        return String(value || "")
          .replace(/[^\w -]+/g, "")
          .trim()
          .replace(/\s+/g, "-");
      },
    },
  },
  savedArrays: {
    memos: [{ title: "Existing", text: "Already here", ts: 1 }],
  },
  downloaded: [],
  downloadText(fileName, text) {
    context.downloaded.push({ fileName, text });
  },
  async getArr(key) {
    return context.savedArrays[key] || [];
  },
  async setArr(key, value) {
    context.savedArrays[key] = value;
  },
};

vm.createContext(context);
vm.runInContext(helperSource, context);

(async () => {
  const meeting = {
    kind: "meeting",
    title: "Weekly Review",
    text: "**Summary**\n\nDone.",
    transcript: "We agreed to ship the screenshot OCR fix.",
    words: 9,
    ts: Date.UTC(2026, 0, 1, 10, 30),
  };

  const markdown = context.memoMarkdown(meeting);
  assert.match(markdown, /^# Weekly Review/);
  assert.match(markdown, /## Transcript/);
  assert.match(markdown, /We agreed to ship the screenshot OCR fix/);
  assert.match(markdown, /Chrome Speech Recognition/);
  assert.match(markdown, /Record others only with consent/);

  const memoWithoutTranscript = context.memoMarkdown({
    title: "Quick memo",
    text: "Buy batteries.",
    ts: Date.UTC(2026, 0, 1),
  });
  assert.doesNotMatch(memoWithoutTranscript, /## Transcript/);
  assert.match(memoWithoutTranscript, /Chrome Speech Recognition/);

  context.exportMemo(meeting);
  assert.equal(context.downloaded.length, 1);
  assert.match(context.downloaded[0].fileName, /weekly-review\.md$/);
  assert.match(context.downloaded[0].text, /## Transcript/);

  const saved = await context.saveMemoItem(meeting);
  assert.equal(saved.kind, "meeting");
  assert.equal(saved.title, "Weekly Review");
  assert.equal(saved.words, 9);
  assert.equal(context.savedArrays.memos.length, 2);
  assert.equal(context.savedArrays.memos[0].title, "Weekly Review");

  assert.match(html, /data-cmd="meeting_notes"/);
  assert.match(html, /data-cmd="voice_memo"/);
  assert.match(html, /voice\/mic readiness/);
  assert.match(source, /meeting_notes:\{needs:null/);
  assert.match(source, /voice_memo:\{needs:null/);
  assert.match(source, /async function voiceReadinessRows/);
  assert.match(source, /Voice capture API/);
  assert.match(source, /Microphone permission/);
  assert.match(source, /navigator\.permissions\.query\(\{name:"microphone"\}\)/);

  console.log("voice-meeting-helpers.test.js passed");
})();
