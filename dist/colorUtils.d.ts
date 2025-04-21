export declare type Vector2 = [number, number];
export declare type Vector3 = [...Vector2, number];
/**
 * Get a more evenly distributed spectrum without the over abundance of green and ultramarine
 * https://twitter.com/harvey_rayner/status/1748159440010809665
 * @param h
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
export declare type colorToCSSxLCHMode = "oklch" | "lch" | "hsl";
/**
 * Converts Hxx (Hue, Chroma, Lightness) values to a CSS `oklch()` color function string.
 *
 * @param {Object} hxx - An object with hue, chroma, and lightness properties.
 * @param {number} hxx.hue - The hue value.
 * @param {number} hxx.chroma - The chroma value.
 * @param {number} hxx.lightness - The lightness value.
 * @returns {string} - The CSS color function string in the format `oklch(lightness% chroma hue)`.
 */
export declare const colorToCSS: (color: [number, number, number], mode?: colorToCSSxLCHMode) => string;
