var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
__export(exports, {
  generateHSLRamp: () => generateHSLRamp,
  generateHSLRampParams: () => generateHSLRampParams,
  hslColorsToCSS: () => hslColorsToCSS,
  map: () => map,
  scaleVector: () => scaleVector
});
function generateHSLRamp({
  total = 9,
  hStart = Math.random() * 360,
  hStartCenter = 0.5,
  hEasing = (x) => Math.pow(x, 2),
  hCycles = 1,
  sRange = [0.4, 0.35],
  sEasing = (x) => Math.pow(x, 2),
  lRange = [Math.random() * 0.1, 0.9],
  lEasing = (x) => Math.pow(x, 1.5)
} = {}) {
  const lDiff = lRange[1] - lRange[0];
  const sDiff = sRange[1] - sRange[0];
  return new Array(total).fill(0).map((_, i) => {
    const relI = i / (total - 1);
    return [
      (360 + hStart + (1 - hEasing(relI, 1 / total) - hStartCenter) * (360 * hCycles)) % 360,
      sRange[0] + sDiff * sEasing(relI, 1 / total),
      lRange[0] + lDiff * lEasing(relI, 1 / total)
    ];
  });
}
function map(n, start1, stop1, start2, stop2) {
  return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}
function scaleVector(vector, originalScale = [
  [0, 360],
  [0, 1],
  [0, 1]
], targetScale = [
  [0, 360],
  [0, 100],
  [0, 100]
]) {
  return vector.map((vec, i) => {
    var _a, _b, _c, _d;
    return map(vec, ((_a = originalScale == null ? void 0 : originalScale[i]) == null ? void 0 : _a[0]) || 0, ((_b = originalScale == null ? void 0 : originalScale[i]) == null ? void 0 : _b[1]) || 1, ((_c = targetScale == null ? void 0 : targetScale[i]) == null ? void 0 : _c[0]) || 0, ((_d = targetScale == null ? void 0 : targetScale[i]) == null ? void 0 : _d[1]) || 100);
  });
}
function hslColorsToCSS(colors) {
  return colors.map((hsl) => {
    const [h, s, l] = scaleVector(hsl);
    return `hsl(${h}, ${s}%, ${l}%)`;
  });
}
var generateHSLRampParams = {
  hStart: {
    default: 0,
    props: { min: 0, max: 360, step: 0.1 }
  },
  hCycles: {
    default: 1,
    props: { min: -1.25, max: 1.5, step: 1e-3 }
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
  total: {
    default: 5,
    props: { min: 4, max: 50, step: 1 }
  },
  minSaturation: {
    default: 0.4,
    props: { min: 0, max: 1, step: 1e-3 }
  },
  maxSaturation: {
    default: 0.35,
    props: { min: 0, max: 1, step: 1e-3 }
  }
};
