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
    generateHSLRampParams: () => generateHSLRampParams
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
  var generateHSLRampParams = {
    total: {
      default: 30,
      props: { min: 3, max: 50, step: 1 }
    },
    hCenter: {
      default: 0,
      props: { min: 0, max: 360, step: 0.1 }
    },
    hCycles: {
      default: 1,
      props: { min: -1.25, max: 1.5, step: 1e-3 }
    },
    minSaturation: {
      default: 0.4,
      props: { min: 0, max: 1, step: 1e-3 }
    },
    maxSaturation: {
      default: 0.35,
      props: { min: 0, max: 1, step: 1e-3 }
    },
    minLight: {
      default: 0.1,
      props: { min: 0, max: 1, step: 1e-3 }
    },
    maxLight: {
      default: 0.9,
      props: { min: 0, max: 1, step: 1e-3 }
    }
  };
  return src_exports;
})();
return rampensau; }));
