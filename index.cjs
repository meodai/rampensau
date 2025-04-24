"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  colorUtils: () => colorUtils_exports,
  generateColorRamp: () => generateColorRamp,
  generateColorRampParams: () => generateColorRampParams,
  generateColorRampWithCurve: () => generateColorRampWithCurve,
  utils: () => utils_exports
});
module.exports = __toCommonJS(index_exports);

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  lerp: () => lerp,
  makeCurveEasings: () => makeCurveEasings,
  pointOnCurve: () => pointOnCurve,
  scaleSpreadArray: () => scaleSpreadArray,
  shuffleArray: () => shuffleArray
});
function shuffleArray(array, rndFn = Math.random) {
  const copy = [...array];
  let currentIndex = copy.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(rndFn() * currentIndex);
    currentIndex--;
    [copy[currentIndex], copy[randomIndex]] = [
      copy[randomIndex],
      copy[currentIndex]
    ];
  }
  return copy;
}
var lerp = (amt, from, to) => from + amt * (to - from);
var scaleSpreadArray = (valuesToFill, targetSize, fillFunction = lerp) => {
  if (!valuesToFill || valuesToFill.length < 2) {
    throw new Error("valuesToFill array must have at least two values.");
  }
  if (targetSize < valuesToFill.length) {
    throw new Error(
      "Target size must be greater than or equal to the valuesToFill array length."
    );
  }
  const valuesToAdd = targetSize - valuesToFill.length;
  const chunkArray = valuesToFill.map((value) => [value]);
  for (let i = 0; i < valuesToAdd; i++) {
    chunkArray[i % (valuesToFill.length - 1)].push(
      null
    );
  }
  for (let i = 0; i < chunkArray.length - 1; i++) {
    const currentChunk = chunkArray[i];
    const nextChunk = chunkArray[i + 1];
    const currentValue = currentChunk[0];
    const nextValue = nextChunk[0];
    for (let j = 1; j < currentChunk.length; j++) {
      const percent = j / currentChunk.length;
      currentChunk[j] = fillFunction(percent, currentValue, nextValue);
    }
  }
  return chunkArray.flat();
};
var pointOnCurve = (curveMethod, curveAccent) => {
  return (t) => {
    const limit = Math.PI / 2;
    const slice = limit / 1;
    const percentile = t;
    let x = 0, y = 0;
    if (curveMethod === "lam\xE9") {
      const t2 = percentile * limit;
      const exp = 2 / (2 + 20 * curveAccent);
      const cosT = Math.cos(t2);
      const sinT = Math.sin(t2);
      x = Math.sign(cosT) * Math.abs(cosT) ** exp;
      y = Math.sign(sinT) * Math.abs(sinT) ** exp;
    } else if (curveMethod === "arc") {
      y = Math.cos(-Math.PI / 2 + t * slice + curveAccent);
      x = Math.sin(Math.PI / 2 + t * slice - curveAccent);
    } else if (curveMethod === "pow") {
      x = Math.pow(1 - percentile, 1 - curveAccent);
      y = Math.pow(percentile, 1 - curveAccent);
    } else if (curveMethod === "powY") {
      x = Math.pow(1 - percentile, curveAccent);
      y = Math.pow(percentile, 1 - curveAccent);
    } else if (curveMethod === "powX") {
      x = Math.pow(percentile, curveAccent);
      y = Math.pow(percentile, 1 - curveAccent);
    } else if (typeof curveMethod === "function") {
      const [xFunc, yFunc] = curveMethod(t, curveAccent);
      x = xFunc;
      y = yFunc;
    } else {
      throw new Error(
        `pointOnCurve() curveAccent parameter is expected to be "lam\xE9" | "arc" | "pow" | "powY" | "powX" or a function but \`${curveMethod}\` given.`
      );
    }
    return { x, y };
  };
};
var makeCurveEasings = (curveMethod, curveAccent) => {
  const point = pointOnCurve(curveMethod, curveAccent);
  return {
    sEasing: (t) => point(t).x,
    lEasing: (t) => point(t).y
  };
};

// src/colorUtils.ts
var colorUtils_exports = {};
__export(colorUtils_exports, {
  colorHarmonies: () => colorHarmonies,
  colorToCSS: () => colorToCSS,
  harveyHue: () => harveyHue,
  hsv2hsl: () => hsv2hsl,
  uniqueRandomHues: () => uniqueRandomHues
});
function harveyHue(h) {
  if (h === 1 || h === 0) return h;
  h = 1 + h % 1;
  const seg = 1 / 6;
  const a = h % seg / seg * Math.PI / 2;
  const [b, c] = [seg * Math.cos(a), seg * Math.sin(a)];
  const i = Math.floor(h * 6);
  const cases = [c, 1 / 3 - b, 1 / 3 + c, 2 / 3 - b, 2 / 3 + c, 1 - b];
  return cases[i % 6];
}
var colorHarmonies = {
  complementary: (h) => [(h + 360) % 360, (h + 540) % 360],
  splitComplementary: (h) => [
    (h + 360) % 360,
    (h + 510) % 360,
    (h + 570) % 360
  ],
  triadic: (h) => [(h + 360) % 360, (h + 480) % 360, (h + 600) % 360],
  tetradic: (h) => [
    (h + 360) % 360,
    (h + 450) % 360,
    (h + 540) % 360,
    (h + 630) % 360
  ],
  monochromatic: (h) => [(h + 360) % 360, (h + 360) % 360],
  // Two identical hues since RampenSau needs a min of 2 colors
  doubleComplementary: (h) => [
    (h + 360) % 360,
    (h + 540) % 360,
    (h + 390) % 360,
    (h + 630) % 360
  ],
  compound: (h) => [
    (h + 360) % 360,
    (h + 540) % 360,
    (h + 420) % 360,
    (h + 600) % 360
  ],
  analogous: (h) => [
    (h + 360) % 360,
    (h + 390) % 360,
    (h + 420) % 360,
    (h + 450) % 360,
    (h + 480) % 360,
    (h + 510) % 360
  ]
};
function uniqueRandomHues({
  startHue = 0,
  total = 9,
  minHueDiffAngle = 60,
  rndFn = Math.random
} = {}) {
  minHueDiffAngle = Math.min(minHueDiffAngle, 360 / total);
  const baseHue = startHue || rndFn() * 360;
  const huesToPickFrom = Array.from(
    {
      length: Math.round(360 / minHueDiffAngle)
    },
    (_, i) => (baseHue + i * minHueDiffAngle) % 360
  );
  let randomizedHues = shuffleArray(huesToPickFrom, rndFn);
  if (randomizedHues.length > total) {
    randomizedHues = randomizedHues.slice(0, total);
  }
  return randomizedHues;
}
var hsv2hsl = ([h, s, v]) => {
  const l = v - v * s / 2;
  const m = Math.min(l, 1 - l);
  const s_hsl = m === 0 ? 0 : (v - l) / m;
  return [h, s_hsl, l];
};
var colorModsCSS = {
  oklch: (color) => [color[2] * 100 + "%", color[1] * 100 + "%", color[0]],
  lch: (color) => [color[2] * 100 + "%", color[1] * 100 + "%", color[0]],
  hsl: (color) => [color[0], color[1] * 100 + "%", color[2] * 100 + "%"],
  hsv: (color) => {
    const [h, s, l] = hsv2hsl(color);
    return [h, s * 100 + "%", l * 100 + "%"];
  }
};
var colorToCSS = (color, mode = "oklch") => {
  const cssMode = mode === "hsv" ? "hsl" : mode;
  return `${cssMode}(${colorModsCSS[mode](color).join(" ")})`;
};

// src/core.ts
function generateColorRamp({
  total = 9,
  hStart = Math.random() * 360,
  hStartCenter = 0.5,
  hEasing = (x) => x,
  hCycles = 1,
  sRange = [0.4, 0.35],
  sEasing = (x) => Math.pow(x, 2),
  lRange = [Math.random() * 0.1, 0.9],
  lEasing = (x) => Math.pow(x, 1.5),
  transformFn = ([h, s, l]) => [h, s, l],
  hueList
} = {}) {
  const lDiff = lRange[1] - lRange[0];
  const sDiff = sRange[1] - sRange[0];
  const length = hueList && hueList.length > 0 ? hueList.length : total;
  return Array.from({ length }, (_, i) => {
    const relI = i / (length - 1);
    const fraction = 1 / length;
    const hue = hueList ? hueList[i] : (360 + // Ensure the hue is always positive
    hStart + // Add the starting hue
    (1 - hEasing(relI, fraction) - hStartCenter) * (360 * hCycles)) % // Calculate the hue based on the easing function
    360;
    const saturation = sRange[0] + sDiff * sEasing(relI, fraction);
    const lightness = lRange[0] + lDiff * lEasing(relI, fraction);
    return transformFn([hue, saturation, lightness], i);
  });
}
var generateColorRampWithCurve = ({
  total = 9,
  hStart = Math.random() * 360,
  hStartCenter = 0.5,
  hCycles = 1,
  sRange = [0.4, 0.35],
  lRange = [Math.random() * 0.1, 0.9],
  hueList,
  curveMethod = "lam\xE9",
  curveAccent = 0.5,
  transformFn = ([h, s, l]) => [h, s, l]
} = {}) => {
  const { sEasing, lEasing } = makeCurveEasings(curveMethod, curveAccent);
  return generateColorRamp({
    total,
    hStart,
    hStartCenter,
    hCycles,
    sRange,
    lRange,
    sEasing,
    lEasing,
    transformFn,
    hueList
  });
};

// src/index.ts
var generateColorRampParams = {
  total: {
    default: 5,
    props: { min: 4, max: 50, step: 1 }
  },
  hStart: {
    default: 0,
    props: { min: 0, max: 360, step: 0.1 }
  },
  hCycles: {
    default: 1,
    props: { min: -2, max: 2, step: 1e-3 }
  },
  hStartCenter: {
    default: 0.5,
    props: { min: 0, max: 1, step: 1e-3 }
  },
  minLight: {
    default: Math.random() * 0.2,
    props: { min: 0, max: 1, step: 1e-3 }
  },
  maxLight: {
    default: 0.89 + Math.random() * 0.11,
    props: { min: 0, max: 1, step: 1e-3 }
  },
  minSaturation: {
    default: Math.random() < 0.5 ? 0.4 : 0.8 + Math.random() * 0.2,
    props: { min: 0, max: 1, step: 1e-3 }
  },
  maxSaturation: {
    default: Math.random() < 0.5 ? 0.35 : 0.9 + Math.random() * 0.1,
    props: { min: 0, max: 1, step: 1e-3 }
  },
  curveMethod: {
    default: "lam\xE9",
    props: { options: ["lam\xE9", "sine", "power", "linear"] }
  },
  curveAccent: {
    default: 0.5,
    props: { min: 0, max: 5, step: 0.01 }
  }
};
