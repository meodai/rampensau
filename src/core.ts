import { makeCurveEasings } from "./utils";
import { normalizeHue } from "./colorUtils";

import type { Vector2, Vector3 } from "./colorUtils";
import type { CurveMethod } from "./utils";

export type ModifiedEasingFn = (x: number, fr?: number) => number;

export type hueArguments = {
  hStart?: number;
  hStartCenter?: number;
  hCycles?: number;
  hEasing?: ModifiedEasingFn;
};
export type presetHues = {
  hueList: number[];
};
export type saturationArguments = {
  sRange?: Vector2;
  sEasing?: ModifiedEasingFn;
};
export type lightnessArguments = {
  lRange?: Vector2;
  lEasing?: ModifiedEasingFn;
};

type BaseGenerateColorRampArgument = {
  total?: number;
  transformFn?: (hsl: Vector3, i?: number) => Vector3 | string;
} & hueArguments &
  saturationArguments &
  lightnessArguments;

export type GenerateColorRampArgument = BaseGenerateColorRampArgument & {
  hueList?: never;
};

export type GenerateColorRampArgumentFixedHues = BaseGenerateColorRampArgument &
  presetHues;

/**
 * Generates a color ramp based on the HSL color space.
 * @param {GenerateColorRampArgument} args - The arguments to generate the ramp.
 * @returns {Array<number>} - The color ramp.
 */
export function generateColorRamp({
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

  hueList,
}:
  | GenerateColorRampArgument
  | GenerateColorRampArgumentFixedHues = {}): Vector3[] {
  // creates a range of lightness and saturation based on the corresponding min and max values
  const lDiff: number = lRange[1] - lRange[0];
  const sDiff: number = sRange[1] - sRange[0];

  // if hueList is provided, use it's length as the length of the ramp
  const length = hueList && hueList.length > 0 ? hueList.length : total;

  return Array.from({ length }, (_, i) => {
    const relI = i / (length - 1);
    const fraction = 1 / length;

    const hue = hueList
      ? (hueList[i] as number)
      : normalizeHue(
          hStart + // Add the starting hue
            (1 - hEasing(relI, fraction) - hStartCenter) * (360 * hCycles) // Calculate the hue based on the easing function
        );

    const saturation = sRange[0] + sDiff * sEasing(relI, fraction);
    const lightness = lRange[0] + lDiff * lEasing(relI, fraction);

    return transformFn([hue, saturation, lightness], i) as Vector3; // Ensure the array is of type Vector3
  });
}

export const generateColorRampWithCurve = ({
  total = 9,
  hStart = Math.random() * 360,
  hStartCenter = 0.5,
  hCycles = 1,
  sRange = [0.4, 0.35],
  lRange = [Math.random() * 0.1, 0.9],
  hueList,
  curveMethod = "lamé",
  curveAccent = 0.5,
  transformFn = ([h, s, l]) => [h, s, l],
}: (GenerateColorRampArgument | GenerateColorRampArgumentFixedHues) & {
  curveMethod?: CurveMethod;
  curveAccent?: number;
} = {}): Vector3[] => {
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
    hueList,
  });
};
