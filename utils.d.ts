/**
 * returns a new shuffled array
 * @param {Array} array - The array to shuffle.
 * @param {function} rndFn - The random function to use.
 * @returns {Array} - The shuffled array.
 */
export declare function shuffleArray<T>(array: T[], rndFn?: () => number): T[];
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
 * Scales and spreads an array to the target size using interpolation.
 *
 * This function takes an initial array of values, a target size, and an
 * interpolation function (defaults to `lerp`). It returns a scaled and spread
 * version of the initial array to the target size using the specified
 * interpolation function.
 * The initial entries are spread as evenly as possible across the target size
 * and the gaps are filled with interpolated values using the specified.
 *
 * In the context of color ramps, this function can be used to create a
 * smoother transition between colors by interpolating between the initial
 * color sets and filling in the gaps with intermediate colors.
 *
 * @param {Array} valuesToFill - The initial array of values.
 * @param {number} targetSize - The desired size of the resulting array.
 * @param {function} fillFunction - The interpolation function (default is lerp).
 * @returns {Array} The scaled and spread array.
 * @throws {Error} If the initial array is empty or target size is invalid.
 */
export declare const scaleSpreadArray: <T>(valuesToFill: T[], targetSize: number, fillFunction?: FillFunction<T>) => T[];
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
