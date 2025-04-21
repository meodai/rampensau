import { shuffleArray } from "./utils.js";

export type Vector2 = [number, number];
export type Vector3 = [...Vector2, number];

/**
 * Get a more evenly distributed spectrum without the over abundance of green and ultramarine
 * https://twitter.com/harvey_rayner/status/1748159440010809665
 * @param h
 * @returns h
 */
export function harveyHue(h: number): number {
  if (h === 1 || h === 0) return h;
  h = 1 + (h % 1);

  const seg = 1 / 6;
  const a = (((h % seg) / seg) * Math.PI) / 2;
  const [b, c] = [seg * Math.cos(a), seg * Math.sin(a)];
  const i = Math.floor(h * 6);
  const cases = [c, 1 / 3 - b, 1 / 3 + c, 2 / 3 - b, 2 / 3 + c, 1 - b];

  return cases[i % 6] as number;
}

export type colorHarmony =
  | "complementary"
  | "splitComplementary"
  | "triadic"
  | "tetradic"
  | "monochromatic"
  | "doubleComplementary"
  | "compound"
  | "analogous";
export type colorHarmonyFn = (h: number) => number[];

/**
 * Generates a list of hues based on a color harmony.
 * @param {number} h - The base hue.
 * @param {colorHarmony} harmony - The color harmony.
 * @returns {Array<number>} - The list of hues.
 */
export const colorHarmonies: {
  [key in colorHarmony]: colorHarmonyFn;
} = {
  complementary: (h) => [(h + 360) % 360, (h + 540) % 360],
  splitComplementary: (h) => [
    (h + 360) % 360,
    (h + 510) % 360,
    (h + 570) % 360,
  ],
  triadic: (h) => [(h + 360) % 360, (h + 480) % 360, (h + 600) % 360],
  tetradic: (h) => [
    (h + 360) % 360,
    (h + 450) % 360,
    (h + 540) % 360,
    (h + 630) % 360,
  ],
  monochromatic: (h) => [(h + 360) % 360],
  doubleComplementary: (h) => [
    (h + 360) % 360,
    (h + 540) % 360,
    (h + 390) % 360,
    (h + 630) % 360,
  ],
  compound: (h) => [
    (h + 360) % 360,
    (h + 540) % 360,
    (h + 420) % 360,
    (h + 600) % 360,
  ],
  analogous: (h) => [
    (h + 360) % 360,
    (h + 390) % 360,
    (h + 420) % 360,
    (h + 450) % 360,
    (h + 480) % 360,
    (h + 510) % 360,
  ],
};

export type uniqueRandomHuesArguments = {
  startHue?: number;
  total?: number;
  minHueDiffAngle?: number;
  rndFn?: () => number;
};
/**
 * Generates a list of unique hues.
 * @param {uniqueRandomHuesArguments} args - The arguments to generate the hues.
 * @returns {Array<number>} - The list of hues.
 */
export function uniqueRandomHues({
  startHue = 0,
  total = 9,
  minHueDiffAngle = 60,
  rndFn = Math.random,
} = {}): number[] {
  minHueDiffAngle = Math.min(minHueDiffAngle, 360 / total);
  const baseHue = startHue || rndFn() * 360;
  const huesToPickFrom = Array.from(
    {
      length: Math.round(360 / minHueDiffAngle),
    },
    (_, i) => (baseHue + i * minHueDiffAngle) % 360
  );

  let randomizedHues = shuffleArray(huesToPickFrom, rndFn);
  if (randomizedHues.length > total) {
    randomizedHues = randomizedHues.slice(0, total);
  }
  return randomizedHues;
}

/**
 * Converts a color from HSV to HSL.
 * @param {Array} hsv - The HSV color values.
 * @returns {Array} - The HSL color values.
 */
export const hsv2hsl = ([h, s, v]: Vector3): Vector3 => {
  const l = v - (v * s) / 2;
  const m = Math.min(l, 1 - l);
  const s_hsl = m === 0 ? 0 : (v - l) / m;
  return [h, s_hsl, l];
};

/**
 * functions to convert from the ramp's colors values to CSS color functions.
 */
const colorModsCSS = {
  oklch: (color) => [color[2] * 100 + "%", color[1] * 100 + "%", color[0]],
  lch: (color) => [color[2] * 100 + "%", color[1] * 100 + "%", color[0]],
  hsl: (color) => [color[0], color[1] * 100 + "%", color[2] * 100 + "%"],
  hsv: (color) => {
    const [h, s, l] = hsv2hsl(color);
    return [h, s * 100 + "%", l * 100 + "%"];
  },
};

export type colorToCSSMode = "oklch" | "lch" | "hsl" | "hsv";

/**
 * Converts color values to a CSS color function string.
 *
 * @param {Vector3} color - Array of three color values based on the color mode.
 * @param {colorToCSSMode} mode - The color mode to use (oklch, lch, hsl, or hsv).
 * @returns {string} - The CSS color function string in the appropriate format.
 */
export const colorToCSS = (
  color: Vector3,
  mode: colorToCSSMode = "oklch"
): string => {
  const cssMode = mode === "hsv" ? "hsl" : mode; // Use HSL for HSV input
  return `${cssMode}(${colorModsCSS[mode](color).join(" ")})`;
};
