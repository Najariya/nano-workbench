const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("sidepanel.html", "utf8");
const css = fs.readFileSync("sidepanel.css", "utf8");
const source = fs.readFileSync("sidepanel.js", "utf8");

assert.match(html, /id="shotBtn"/, "composer screenshot button is present");
assert.match(html, /id="screenshotMenu"/, "composer screenshot menu is present");
assert.match(html, /id="composerCaptureVisible"/, "visible capture menu item is present");
assert.match(html, /id="composerCaptureFull"/, "full-page capture menu item is present");

assert.match(css, /\.shot-fab/, "screenshot button has dedicated styling");
assert.match(css, /\.shot-menu/, "screenshot menu has dedicated styling");

assert.match(
  source,
  /\$\("shotBtn"\)&&\$\("shotBtn"\)\.addEventListener\("click"/,
  "screenshot button is wired without reading the later shotBtn const early",
);
assert.doesNotMatch(
  source,
  /shotBtn&&shotBtn\.addEventListener\("click"/,
  "screenshot button listener must not use shotBtn before initialization",
);
assert.match(source, /composerCaptureVisible"\)&&\$\("composerCaptureVisible"\)\.addEventListener/);
assert.match(source, /composerCaptureFull"\)&&\$\("composerCaptureFull"\)\.addEventListener/);
assert.match(source, /captureScreenshot\("visible"\)/);
assert.match(source, /captureScreenshot\("full"\)/);
assert.match(source, /m\.className="primary-btn small",m\.textContent="OCR \+ summarize"/);
assert.match(source, /g\.className="copy-btn",g\.textContent="Extract text"/);
assert.match(source, /u\.append\(m,g,h\)/);
assert.match(source, /async function screenshotOcrReadinessRows/);
assert.match(source, /Screenshot capture APIs/);
assert.match(source, /Screenshot OCR model/);
assert.match(source, /Screenshot OCR prep/);
assert.match(source, /LanguageModel\.availability\(\{expectedInputs:\[\{type:"image"\}\]\}\)/);

console.log("screenshot-composer-button.test.js passed");
