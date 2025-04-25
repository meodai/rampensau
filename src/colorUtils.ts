import { shuffleArray } from "./utils.js";

export type Vector2 = [number, number];
export type Vector3 = [...Vector2, number];

/**
 * Converts a color from HSL to HSV.
 * @param {Array} hsl - The HSL color values.
 * @returns {Array} - The HSV color values.
 */
export function normalizeHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

/**
 * Get a more evenly distributed spectrum without the over abundance of green and ultramarine
 * https://twitter.com/harvey_rayner/status/1748159440010809665
 * @param h - The hue value to be converted 0-360
 * @returns h
 */
export function harveyHue(h: number): number {
  // modified this part to make it more usable with rampenSau
  h = normalizeHue(h) / 360; // this ensures the value stays within the 0-360 range and normalizes it to 0-1

  if (h === 1 || h === 0) return h;
  h = 1 + (h % 1);

  const seg = 1 / 6;
  const a = (((h % seg) / seg) * Math.PI) / 2;
  const [b, c] = [seg * Math.cos(a), seg * Math.sin(a)];
  const i = Math.floor(h * 6);
  const cases = [c, 1 / 3 - b, 1 / 3 + c, 2 / 3 - b, 2 / 3 + c, 1 - b];

  return (cases[i % 6] as number) * 360;
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
  complementary: (h) => [normalizeHue(h), normalizeHue(h + 180)],
  splitComplementary: (h) => [
    normalizeHue(h),
    normalizeHue(h + 150),
    normalizeHue(h - 150),
  ],
  triadic: (h) => [
    normalizeHue(h),
    normalizeHue(h + 120),
    normalizeHue(h + 240),
  ],
  tetradic: (h) => [
    normalizeHue(h),
    normalizeHue(h + 90),
    normalizeHue(h + 180),
    normalizeHue(h + 270),
  ],
  monochromatic: (h) => [normalizeHue(h), normalizeHue(h)], // min 2 for RampenSau
  doubleComplementary: (h) => [
    normalizeHue(h),
    normalizeHue(h + 180),
    normalizeHue(h + 30),
    normalizeHue(h + 210),
  ],
  compound: (h) => [
    normalizeHue(h),
    normalizeHue(h + 180),
    normalizeHue(h + 60),
    normalizeHue(h + 240),
  ],
  analogous: (h) => [
    normalizeHue(h),
    normalizeHue(h + 30),
    normalizeHue(h + 60),
    normalizeHue(h + 90),
    normalizeHue(h + 120),
    normalizeHue(h + 150),
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
