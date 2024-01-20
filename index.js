var rampensau = (() => {
  var __defProp = Object.defineProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    colorHarmonies: () => colorHarmonies,
    colorToCSS: () => colorToCSS,
    generateColorRamp: () => generateColorRamp,
    generateColorRampParams: () => generateColorRampParams,
    harveyHue: () => harveyHue,
    lerp: () => lerp,
    scaleSpreadArray: () => scaleSpreadArray,
    shuffleArray: () => shuffleArray,
    uniqueRandomHues: () => uniqueRandomHues
  });
  function harveyHue(h) {
    if (h === 1 || h === 0)
      return h;
    h = 1 + h % 1;
    const seg = 1 / 6;
    const a = h % seg / seg * Math.PI / 2;
    const [b, c] = [seg * Math.cos(a), seg * Math.sin(a)];
    const i = Math.floor(h * 6);
    const cases = [c, 1 / 3 - b, 1 / 3 + c, 2 / 3 - b, 2 / 3 + c, 1 - b];
    return cases[i % 6];
  }
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
    adjustmentsFn = ([h, s, l]) => [h, s, l],
    hueList
  } = {}) {
    const lDiff = lRange[1] - lRange[0];
    const sDiff = sRange[1] - sRange[0];
    const length = hueList && hueList.length > 0 ? hueList.length : total;
    return Array.from({ length }, (_, i) => {
      const relI = i / (length - 1);
      const fraction = 1 / length;
      const hue = hueList ? hueList[i] : (360 + hStart + (1 - hEasing(relI, fraction) - hStartCenter) * (360 * hCycles)) % 360;
      const saturation = sRange[0] + sDiff * sEasing(relI, fraction);
      const lightness = lRange[0] + lDiff * lEasing(relI, fraction);
      return adjustmentsFn([hue, saturation, lightness]);
    });
  }
  function shuffleArray(array, rndFn = Math.random) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(rndFn() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex]
      ];
    }
    return array;
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
    monochromatic: (h) => [(h + 360) % 360],
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
    const huesToPickFrom = Array.from({
      length: Math.round(360 / minHueDiffAngle)
    }, (_, i) => (baseHue + i * minHueDiffAngle) % 360);
    let randomizedHues = shuffleArray(huesToPickFrom, rndFn);
    if (randomizedHues.length > total) {
      randomizedHues = randomizedHues.slice(0, total);
    }
    return randomizedHues;
  }
  var colorModsCSS = {
    oklch: (color) => [color[2] * 100 + "%", color[1] * 100 + "%", color[0]],
    lch: (color) => [color[2] * 100 + "%", color[1] * 100 + "%", color[0]],
    hsl: (color) => [color[0], color[1] * 100 + "%", color[2] * 100 + "%"]
  };
  var colorToCSS = (color, mode = "oklch") => `${mode}(${colorModsCSS[mode](color).join(" ")})`;
  var lerp = (amt, from, to) => from + amt * (to - from);
  var scaleSpreadArray = (initial, targetSize, fillFunction = lerp) => {
    if (initial.length === 0) {
      throw new Error("Initial array must not be empty.");
    }
    if (targetSize < initial.length) {
      throw new Error("Target size must be greater than or equal to the initial array length.");
    }
    const valuesToAdd = targetSize - initial.length;
    const chunkArray = initial.map((value) => [value]);
    for (let i = 0; i < valuesToAdd; i++) {
      chunkArray[i % (initial.length - 1)].push(null);
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
    }
  };
  return src_exports;
})();
