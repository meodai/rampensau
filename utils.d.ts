/**
 * returns a new shuffled array
 * @param {Array} array - The array to shuffle.
 * @param {function} rndFn - The random function to use.
 * @returns {Array} - The shuffled array.
 */
export declare function shuffleArray<T>(array: readonly T[], rndFn?: () => number): T[];
declare type FillFunction<T> = T extends number ? (amt: number, from: T, to: T) => T : (amt: number, from: T | null, to: T | null) => T;
/**
 * Linearly interpolates between two values.
 *
 * @param {number} amt - The interpolation amount (usually between 0 and 1).
 * @param {number} from - The starting value.
 * @param {number} to - The ending value.
 * @returns {number} - The interpolated value.
 */
export declare const lerp: FillFunction<number>;
/**
 * Scales and spreads an array to the target size using interpolation, with optional padding.
 *
 * This function takes an initial array of values, a target size, an optional padding value,
 * and an interpolation function (defaults to `lerp`). It returns a scaled and spread
 * version of the initial array to the target size using the specified interpolation function.
 *
 * The padding parameter (between 0 and 1) compresses the normalized domain from both ends,
 * matching the behavior of chroma.js's scale() function. This is particularly useful for
 * color scales to prevent the endpoints from being too extreme.
 *
 * When padding is 0 (default), the original algorithm is used where values are distributed
 * and interpolated across segments.
 *
 * When padding > 0, the normalized domain (0-1) is compressed to [padding, 1-padding],
 * allowing for more graceful handling of extreme values.
 *
 * @param {Array<T>} valuesToFill - The initial array of values.
 * @param {number} targetSize - The desired size of the resulting array.
 * @param {number} padding - Optional padding value between 0 and 1 (default: 0).
 * @param {FillFunction<T>} fillFunction - The interpolation function (default is lerp).
 * @returns {Array<T>} The scaled and spread array.
 * @throws {Error} If the initial array is invalid or target size is invalid.
 */
export declare const scaleSpreadArray: <T>(valuesToFill: T[], targetSize: number, padding?: number, fillFunction?: FillFunction<T>) => T[];
export declare type CurveMethod = "lamé" | "arc" | "pow" | "powY" | "powX" | ((i: number, curveAccent: number) => [number, number]);
/**
 * function pointOnCurve
 * @param curveMethod {String|Function} Defines how the curve is drawn
 * @param curveAccent {Number} Defines the accent of the curve
 * @returns {Function} A function that takes a number between 0 and 1 and returns the x and y coordinates of the curve at that point
 * @throws {Error} If the curveMethod is not a valid type
 */
export declare const pointOnCurve: (curveMethod: CurveMethod, curveAccent: number) => (t: number) => {
    x: number;
    y: number;
};
/**
 * makeCurveEasings generates two easing functions based on a curve method and accent.
 * @param {CurveMethod} curveMethod - The method used to generate the curve.
 * @param {number} curveAccent - The accent of the curve.
 * @returns {Object} An object containing two easing functions: sEasing and lEasing.
 */
export declare const makeCurveEasings: (curveMethod: CurveMethod, curveAccent: number) => {
    sEasing: (t: number) => number;
    lEasing: (t: number) => number;
};
export {};
