export declare type Vector2 = [number, number];
export declare type Vector3 = [...Vector2, number];
/**
 * Converts a color from HSL to HSV.
 * @param {Array} hsl - The HSL color values.
 * @returns {Array} - The HSV color values.
 */
export declare function normalizeHue(h: number): number;
/**
 * Get a more evenly distributed spectrum without the over abundance of green and ultramarine
 * https://twitter.com/harvey_rayner/status/1748159440010809665
 * @param h - The hue value to be converted 0-360
 * @returns h
 */
export declare function harveyHue(h: number): number;
export declare type colorHarmony = "complementary" | "splitComplementary" | "triadic" | "tetradic" | "monochromatic" | "doubleComplementary" | "compound" | "analogous";
export declare type colorHarmonyFn = (h: number) => number[];
/**
 * Generates a list of hues based on a color harmony.
 * @param {number} h - The base hue.
 * @param {colorHarmony} harmony - The color harmony.
 * @returns {Array<number>} - The list of hues.
 */
export declare const colorHarmonies: {
    [key in colorHarmony]: colorHarmonyFn;
};
export declare type uniqueRandomHuesArguments = {
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
export declare function uniqueRandomHues({ startHue, total, minHueDiffAngle, rndFn, }?: {
    startHue?: number | undefined;
    total?: number | undefined;
    minHueDiffAngle?: number | undefined;
    rndFn?: (() => number) | undefined;
}): number[];
/**
 * Converts a color from HSV to HSL.
 * @param {Array} hsv - The HSV color values.
 * @returns {Array} - The HSL color values.
 */
export declare const hsv2hsl: ([h, s, v]: [number, number, number]) => [number, number, number];
export declare type colorToCSSMode = "oklch" | "lch" | "hsl" | "hsv";
/**
 * Converts color values to a CSS color function string.
 *
 * @param {Vector3} color - Array of three color values based on the color mode.
 * @param {colorToCSSMode} mode - The color mode to use (oklch, lch, hsl, or hsv).
 * @returns {string} - The CSS color function string in the appropriate format.
 */
export declare const colorToCSS: (color: [number, number, number], mode?: colorToCSSMode) => string;
