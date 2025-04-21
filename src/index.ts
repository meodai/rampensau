export * as utils from "./utils";
export * as colorUtils from "./colorUtils";

export { generateColorRamp, generateColorRampWithCurve } from "./core";

/**
 * A set of default parameters and sain ranges to use `generateColorRamp`
 * when coming up with random color ramps.
 */
/**
 * A set of default parameters and sane ranges to use with `generateColorRamp`
 * when coming up with random color ramps.
 */
export const generateColorRampParams = {
  total: {
    default: 5,
    props: { min: 4, max: 50, step: 1 },
  },
  hStart: {
    default: 0,
    props: { min: 0, max: 360, step: 0.1 },
  },
  hCycles: {
    default: 1,
    props: { min: -2, max: 2, step: 0.001 },
  },
  hStartCenter: {
    default: 0.5,
    props: { min: 0, max: 1, step: 0.001 },
  },
  minLight: {
    default: Math.random() * 0.2,
    props: { min: 0, max: 1, step: 0.001 },
  },
  maxLight: {
    default: 0.89 + Math.random() * 0.11,
    props: { min: 0, max: 1, step: 0.001 },
  },
  minSaturation: {
    default: Math.random() < 0.5 ? 0.4 : 0.8 + Math.random() * 0.2,
    props: { min: 0, max: 1, step: 0.001 },
  },
  maxSaturation: {
    default: Math.random() < 0.5 ? 0.35 : 0.9 + Math.random() * 0.1,
    props: { min: 0, max: 1, step: 0.001 },
  },
  curveMethod: {
    default: "lamé",
    props: { options: ["lamé", "sine", "power", "linear"] },
  },
  curveAccent: {
    default: 0.5,
    props: { min: 0, max: 5, step: 0.01 },
  },
};
