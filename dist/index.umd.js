(function(root, factory) {
      if (typeof define === 'function' && define.amd) {
      	define([], factory);
      } else if (typeof module === 'object' && module.exports) {
      	module.exports = factory();
      } else {
      	root.rampensau = factory();
      }
    }
    (typeof self !== 'undefined' ? self : this, function() {
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
    generateHSLRamp: () => generateHSLRamp,
    generateHSLRampParams: () => generateHSLRampParams,
    hslColorsToCSS: () => hslColorsToCSS,
    map: () => map,
    scaleVector: () => scaleVector
  });
  function generateHSLRamp({
    total = 9,
    hCenter = Math.random() * 360,
    hCycles = 1,
    sRange = [0.4, 0.35],
    sEasing = (x) => Math.pow(x, 2),
    lRange = [Math.random() * 0.1, 0.9],
    lEasing = (x) => Math.pow(x, 1.5)
  } = {}) {
    const hueSlice = 360 / total;
    const hues = new Array(total).fill(0).map((_, i) => (360 + (-180 + hCenter + i * hCycles * hueSlice)) % 360);
    const lDiff = lRange[1] - lRange[0];
    const sDiff = sRange[1] - sRange[0];
    const firstColor = [hues.pop() || 0, sRange[0], lRange[0]];
    const ramp = new Array(total - 1).fill(0).map((_, i) => [
      hues.pop() || 0,
      sRange[0] + sDiff * sEasing((i + 1) / (total - 1)),
      lRange[0] + lDiff * lEasing((i + 1) / (total - 1))
    ]);
    return [...[firstColor], ...ramp];
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
    hCenter: {
      default: 0,
      props: { min: 0, max: 360, step: 0.1 }
    },
    hCycles: {
      default: 1,
      props: { min: -1.25, max: 1.5, step: 1e-3 }
    },
    minLight: {
      default: 0.1,
      props: { min: 0, max: 1, step: 1e-3 }
    },
    maxLight: {
      default: 0.9,
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
  return src_exports;
})();
return rampensau; }));
