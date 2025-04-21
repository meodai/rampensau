/**
 * returns a new shuffled array
 * @param {Array} array - The array to shuffle.
 * @param {function} rndFn - The random function to use.
 * @returns {Array} - The shuffled array.
 */

export function shuffleArray<T>(array: readonly T[], rndFn = Math.random): T[] {
  // Create a copy of the input array
  const copy = [...array];

  let currentIndex = copy.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(rndFn() * currentIndex);
    currentIndex--;

    [copy[currentIndex], copy[randomIndex]] = [
      copy[randomIndex] as T,
      copy[currentIndex] as T,
    ];
  }

  return copy;
}

type FillFunction<T> = T extends number
  ? (amt: number, from: T, to: T) => T
  : (amt: number, from: T | null, to: T | null) => T;

/**
 * Linearly interpolates between two values.
 *
 * @param {number} amt - The interpolation amount (usually between 0 and 1).
 * @param {number} from - The starting value.
 * @param {number} to - The ending value.
 * @returns {number} - The interpolated value.
 */
export const lerp: FillFunction<number> = (amt, from, to) =>
  from + amt * (to - from);

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
export const scaleSpreadArray = <T>(
  valuesToFill: T[],
  targetSize: number,
  fillFunction: FillFunction<T> = lerp as unknown as FillFunction<T>
): T[] => {
  // Check that the valuesToFill array is not empty and that the target size is valid
  if (!valuesToFill || valuesToFill.length < 2) {
    throw new Error("valuesToFill array must have at least two values.");
  }
  if (targetSize < valuesToFill.length) {
    throw new Error(
      "Target size must be greater than or equal to the valuesToFill array length."
    );
  }
  // Create a copy of the valuesToFill array and add null values to it if necessary
  const valuesToAdd = targetSize - valuesToFill.length;
  const chunkArray = valuesToFill.map((value) => [value]);

  for (let i = 0; i < valuesToAdd; i++) {
    (chunkArray[i % (valuesToFill.length - 1)] as T[]).push(
      null as unknown as T
    );
  }

  // Fill each chunk with interpolated values using the specified interpolation function
  for (let i = 0; i < chunkArray.length - 1; i++) {
    const currentChunk = chunkArray[i] as T[];
    const nextChunk = chunkArray[i + 1] as T[];
    const currentValue = currentChunk[0] as T;
    const nextValue = nextChunk[0] as T;

    for (let j = 1; j < currentChunk.length; j++) {
      const percent = j / currentChunk.length;
      currentChunk[j] = fillFunction(percent, currentValue, nextValue);
    }
  }

  return chunkArray.flat() as T[];
};

export type CurveMethod =
  | "lamé"
  | "arc"
  | "pow"
  | "powY"
  | "powX"
  | ((i: number, curveAccent: number) => [number, number]);

/**
 * function pointOnCurve
 * @param curveMethod {String|Function} Defines how the curve is drawn
 * @param curveAccent {Number} Defines the accent of the curve
 * @returns {Function} A function that takes a number between 0 and 1 and returns the x and y coordinates of the curve at that point
 * @throws {Error} If the curveMethod is not a valid type
 */
export const pointOnCurve = (curveMethod: CurveMethod, curveAccent: number) => {
  return (t: number): { x: number; y: number } => {
    const limit = Math.PI / 2;
    const slice = limit / 1;
    const percentile = t;

    let x = 0,
      y = 0;

    if (curveMethod === "lamé") {
      const t = percentile * limit;
      const exp = 2 / (2 + 20 * curveAccent);
      const cosT = Math.cos(t);
      const sinT = Math.sin(t);
      x = Math.sign(cosT) * Math.abs(cosT) ** exp;
      y = Math.sign(sinT) * Math.abs(sinT) ** exp;
    } else if (curveMethod === "arc") {
      y = Math.cos(-Math.PI / 2 + t * slice + curveAccent);
      x = Math.sin(Math.PI / 2 + t * slice - curveAccent);
    } else if (curveMethod === "pow") {
      x = Math.pow(1 - percentile, 1 - curveAccent);
      y = Math.pow(percentile, 1 - curveAccent);
    } else if (curveMethod === "powY") {
      x = Math.pow(1 - percentile, curveAccent);
      y = Math.pow(percentile, 1 - curveAccent);
    } else if (curveMethod === "powX") {
      x = Math.pow(percentile, curveAccent);
      y = Math.pow(percentile, 1 - curveAccent);
    } else if (typeof curveMethod === "function") {
      const [xFunc, yFunc] = curveMethod(t, curveAccent) as [number, number];
      x = xFunc;
      y = yFunc;
    } else {
      throw new Error(
        `pointOnCurve() curveAccent parameter is expected to be "lamé" | "arc" | "pow" | "powY" | "powX" or a function but \`${curveMethod}\` given.`
      );
    }

    return { x, y };
  };
};

/**
 * makeCurveEasings generates two easing functions based on a curve method and accent.
 * @param {CurveMethod} curveMethod - The method used to generate the curve.
 * @param {number} curveAccent - The accent of the curve.
 * @returns {Object} An object containing two easing functions: sEasing and lEasing.
 */
export const makeCurveEasings = (
  curveMethod: CurveMethod,
  curveAccent: number
): {
  sEasing: (t: number) => number;
  lEasing: (t: number) => number;
} => {
  const point = pointOnCurve(curveMethod, curveAccent);

  return {
    sEasing: (t: number) => point(t).x,
    lEasing: (t: number) => point(t).y,
  };
};
