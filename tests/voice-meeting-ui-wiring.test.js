const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("sidepanel.js", "utf8");
const html = fs.readFileSync("sidepanel.html", "utf8");
const css = fs.readFileSync("sidepanel.css", "utf8");

for (const id of [
  "meetingBar",
  "meetingText",
  "meetingStop",
  "audioNotesBtn",
  "recordMemo",
  "memoStatus",
  "memoList",
  "clearMemos",
]) {
  assert.match(html, new RegExp(`id="${id}"`), `${id} exists in the UI`);
}

assert.match(html, /Stop &amp; summarize/);
assert.match(html, /Quick voice memo/);
assert.match(css, /\.meeting-bar/);
assert.match(css, /\.memo-record/);
assert.match(css, /\.memo-actions/);
assert.match(css, /\.memo-transcript/);

assert.match(source, /const VOICE_DISCLOSURE="Transcription uses Chrome Speech Recognition/);
assert.match(source, /async function ensureAudioNotesAcknowledged/);
assert.match(source, /Type START to remember this and begin/);
assert.match(source, /async function startMeetingNotes/);
assert.match(source, /async function stopMeetingNotes/);
assert.match(source, /\$\("meetingStop"\)&&\$\("meetingStop"\)\.addEventListener\("click",\(\)=>stopMeetingNotes\(\)\)/);
assert.match(source, /\$\("audioNotesBtn"\)&&\$\("audioNotesBtn"\)\.addEventListener\("click",\(\)=>\{closeMore\(\),startMeetingNotes\(\)\}\)/);

for (const section of [
  "\\*\\*Summary\\*\\*",
  "\\*\\*Key points\\*\\*",
  "\\*\\*Decisions\\*\\*",
  "\\*\\*Action items\\*\\*",
  "\\*\\*Follow-ups / open questions\\*\\*",
]) {
  assert.match(source, new RegExp(section), `${section} appears in meeting summary prompt`);
}

assert.match(source, /\$\("recordMemo"\)\.addEventListener\("click",toggleMemoRecording\)/);
assert.match(source, /async function toggleMemoRecording/);
assert.match(source, /Chrome Speech Recognition/);
assert.match(source, /chrome\.tabs\.create\(\{url:chrome\.runtime\.getURL\("mic-permission\.html"\)\}\)/);

assert.match(source, /r\.textContent="meeting"===n\.kind\?"Meeting":"Voice"/);
assert.match(source, /e\.textContent="Transcript saved locally"/);
assert.match(source, /u\.title="Copy note"/);
assert.match(source, /m\.title="Copy transcript"/);
assert.match(source, /g\.title="Export Markdown"/);
assert.match(source, /h\.title="Delete"/);
assert.match(source, /navigator\.clipboard\.writeText\(n\.transcript\|\|n\.text\|\|""\)/);

assert.match(source, /Voice capture API/);
assert.match(source, /Microphone permission/);
assert.match(source, /navigator\.permissions\.query\(\{name:"microphone"\}\)/);

console.log("voice-meeting-ui-wiring.test.js passed");
