const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("sidepanel.js", "utf8");

function sliceBetween(start, end) {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, `Missing start marker: ${start}`);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(endIndex, -1, `Missing end marker: ${end}`);
  return source.slice(startIndex, endIndex);
}

const safeFilePartSource = sliceBetween(
  "function safeFilePart",
  "function screenshotFileName",
);
const screenshotFileNameSource = sliceBetween(
  "function screenshotFileName",
  "async function dataUrlToBlob",
);
const captureFullPageImageSource = sliceBetween(
  "async function captureFullPageImage",
  "function renderScreenshotResult",
);
const screenshotOcrSlicesSource = sliceBetween(
  "function screenshotOcrSlices",
  "function contrastCanvas",
);

const context = {
  SCREENSHOT_MAX_TILES_PER_PART: 20,
  SCREENSHOT_OCR_MAX_SLICES: 12,
  SCREENSHOT_OCR_OVERLAP: 80,
  SCREENSHOT_OCR_MIN_SLICE_HEIGHT: 1400,
  SCREENSHOT_OCR_MAX_SLICE_HEIGHT: 2600,
  SCREENSHOT_OCR_MIN_WIDTH: 1600,
  SCREENSHOT_OCR_MAX_WIDTH: 2200,
  SCREENSHOT_OCR_MAX_SCALE: 2.25,
  SCREENSHOT_OCR_MAX_PIXELS: 4800000,
  URL: {
    createObjectURL(blob) {
      return `blob:mock-${blob.partIndex}`;
    },
  },
  captureMetricsScript() {},
  scrollForCaptureScript() {},
  restoreCaptureScrollScript() {},
};

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function fakeCanvas(width, height, draw) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let index = 0; index < data.length; index += 4) {
    data[index] = 255;
    data[index + 1] = 255;
    data[index + 2] = 255;
    data[index + 3] = 255;
  }
  if (draw) draw(data, width, height);
  return {
    width,
    height,
    getContext() {
      return {
        getImageData() {
          return { width, height, data };
        },
      };
    },
  };
}

context.waitMs = async () => {};
context.captureVisibleDataUrl = async () => `data:image/png;base64,${context.captures.length}`;
context.stitchCaptures = async (frames, options) => {
  const record = {
    frames: frames.map((frame) => frame.y),
    options: { ...options },
  };
  context.stitched.push(record);
  return { partIndex: context.stitched.length, record };
};
context.runCaptureScript = async (tab, script, args = []) => {
  if (script === context.captureMetricsScript) return context.metrics;
  if (script === context.scrollForCaptureScript) {
    context.captures.push(args[0]);
    return { y: args[0] };
  }
  if (script === context.restoreCaptureScrollScript) {
    context.restoredTo = args;
    return null;
  }
  throw new Error("Unexpected capture script");
};

vm.createContext(context);
vm.runInContext(safeFilePartSource, context);
vm.runInContext(screenshotFileNameSource, context);
vm.runInContext(captureFullPageImageSource, context);
vm.runInContext(screenshotOcrSlicesSource, context);

async function runScenario(fullHeight) {
  context.metrics = { height: 1000, fullHeight, width: 800, x: 12, y: 345 };
  context.captures = [];
  context.stitched = [];
  context.progress = [];
  context.restoredTo = null;

  const result = await context.captureFullPageImage(
    { id: 1, windowId: 1 },
    { setText: (text) => context.progress.push(text) },
  );

  return {
    result,
    captures: [...context.captures],
    stitched: [...context.stitched],
    progress: [...context.progress],
    restoredTo: context.restoredTo,
  };
}

(async () => {
  const shortPage = await runScenario(10000);
  assert.equal(shortPage.result.parts.length, 1);
  assert.equal(shortPage.result.meta.tiles, 10);
  assert.deepEqual(plain(shortPage.result.parts.map((part) => part.meta.tiles)), [10]);
  assert.deepEqual(plain(shortPage.restoredTo), [12, 345]);

  const veryLongPage = await runScenario(55000);
  assert.equal(veryLongPage.result.parts.length, 3);
  assert.equal(veryLongPage.result.meta.tiles, 55);
  assert.equal(veryLongPage.result.meta.parts, 3);
  assert.deepEqual(
    plain(veryLongPage.result.parts.map((part) => part.meta.tiles)),
    [20, 20, 15],
  );
  assert.deepEqual(
    plain(veryLongPage.result.parts.map((part) => part.meta.startY)),
    [0, 20000, 40000],
  );
  assert.deepEqual(
    plain(veryLongPage.result.parts.map((part) => part.meta.endY)),
    [20000, 40000, 55000],
  );
  assert.deepEqual(plain(veryLongPage.restoredTo), [12, 345]);
  assert.equal(veryLongPage.captures.length, 55);
  assert.ok(veryLongPage.progress.some((text) => text.includes("will save in parts")));

  const filename = context.screenshotFileName(
    { title: "Very Long Page" },
    "full",
    1,
    3,
  );
  assert.match(filename, /full-page-part-01-of-03-very-long-page\.png$/);

  const visibleOcrSlices = context.screenshotOcrSlices(1400, 1000);
  assert.equal(visibleOcrSlices.length, 1);

  const tallOcrSlices = context.screenshotOcrSlices(1400, 20000);
  assert.ok(tallOcrSlices.length > 1);
  assert.ok(tallOcrSlices.length <= context.SCREENSHOT_OCR_MAX_SLICES);
  assert.equal(tallOcrSlices[0].y, 0);
  const lastTallSlice = tallOcrSlices[tallOcrSlices.length - 1];
  assert.ok(lastTallSlice.y + lastTallSlice.height >= 20000);
  assert.ok(tallOcrSlices.every((slice) => slice.total === tallOcrSlices.length));

  assert.ok(context.screenshotOcrScale(900, 1200) > 1);
  assert.ok(context.screenshotOcrScale(900, 1200) <= context.SCREENSHOT_OCR_MAX_SCALE);
  assert.ok(context.screenshotOcrScale(2800, 1200) < 1);
  const denseScale = context.screenshotOcrScale(1200, 5000);
  assert.ok(1200 * denseScale * 5000 * denseScale <= context.SCREENSHOT_OCR_MAX_PIXELS + 1);

  const blankBounds = context.screenshotContentBounds(fakeCanvas(120, 80));
  assert.deepEqual(plain(blankBounds), { x: 0, y: 0, width: 120, height: 80 });

  const croppedBounds = context.screenshotContentBounds(
    fakeCanvas(120, 80, (data, width) => {
      for (let y = 24; y < 56; y += 1) {
        for (let x = 36; x < 84; x += 1) {
          const index = 4 * (y * width + x);
          data[index] = 0;
          data[index + 1] = 0;
          data[index + 2] = 0;
        }
      }
    }),
  );
  assert.ok(croppedBounds.x > 0);
  assert.ok(croppedBounds.y > 0);
  assert.ok(croppedBounds.width < 120);
  assert.ok(croppedBounds.height < 80);

  console.log("screenshot-long-page.test.js passed");
})();
