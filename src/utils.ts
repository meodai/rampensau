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
export const scaleSpreadArray = <T>(
  valuesToFill: T[],
  targetSize: number,
  padding = 0,
  fillFunction: FillFunction<T> = lerp as unknown as FillFunction<T>
): T[] => {
  // Validation checks
  if (!valuesToFill || valuesToFill.length < 2) {
    throw new Error("valuesToFill array must have at least two values.");
  }
  if (targetSize < 1 && padding > 0) {
    throw new Error("Target size must be at least 1");
  }
  if (targetSize < valuesToFill.length && padding === 0) {
    throw new Error(
      "Target size must be greater than or equal to the valuesToFill array length."
    );
  }

  const result = new Array(targetSize);

  // For case without padding, use the original algorithm optimized
  if (padding <= 0) {
    const len = valuesToFill.length;
    const lastIdx = len - 1;
    const totalAdded = targetSize - len;

    // Calculate how many items are added per segment
    // The original logic distributed 'valuesToAdd' in a round-robin fashion
    // starting from the first segment.
    const baseAdds = Math.floor(totalAdded / lastIdx);
    const remainder = totalAdded % lastIdx;

    let currentResultIdx = 0;

    for (let i = 0; i < lastIdx; i++) {
      const startVal = valuesToFill[i] as T;
      const endVal = valuesToFill[i + 1] as T;

      // A segment consists of the start value + any added intermediate values.
      // If i < remainder, this segment gets an extra slot (matching the original round-robin).
      const segmentLen = 1 + baseAdds + (i < remainder ? 1 : 0);

      for (let j = 0; j < segmentLen; j++) {
        const t = j / segmentLen;
        result[currentResultIdx++] = fillFunction(t, startVal, endVal);
      }
    }

    // The loop above handles [start, ...intermediates] for every segment.
    // We must manually add the very last value of the input array,
    // as it is never a 'start' value for a segment.
    result[currentResultIdx] = valuesToFill[lastIdx];

    return result;
  }

  // Implement chroma.js style padding (Optimized)

  // The padding essentially shifts the start and end of the normalized range
  const domainStart = padding;
  const domainEnd = 1 - padding;
  const lenMinus1 = valuesToFill.length - 1;

  // Optimization: Pre-calculate normalized positions once
  // This avoids creating a new array and iterating it inside the main loop (O(N) -> O(1))
  const normalizedPositions = new Float64Array(valuesToFill.length);
  for (let i = 0; i < valuesToFill.length; i++) {
    normalizedPositions[i] = i / lenMinus1;
  }

  let segmentIndex = 0;

  // Generate evenly spaced positions in the target array
  for (let i = 0; i < targetSize; i++) {
    // Generate normalized position (0-1)
    const t = targetSize === 1 ? 0.5 : i / (targetSize - 1);

    // Apply padding by adjusting t
    const adjustedT = domainStart + t * (domainEnd - domainStart);

    // Optimization: Monotonic search.
    // Since 'i' increases, 'adjustedT' increases. We can continue searching
    // from the previous segmentIndex instead of searching from 0 every time.
    while (
      segmentIndex < lenMinus1 &&
      adjustedT > (normalizedPositions[segmentIndex + 1] as number)
    ) {
      segmentIndex++;
    }

    // Get the segment boundaries in normalized space
    const segmentStart = normalizedPositions[segmentIndex] as number;
    const segmentEnd = normalizedPositions[segmentIndex + 1] as number;

    // Calculate relative position within segment (0-1)
    let segmentT = 0;
    if (segmentEnd > segmentStart) {
      segmentT = (adjustedT - segmentStart) / (segmentEnd - segmentStart);
    }

    // Get the values from the segments
    const fromValue = valuesToFill[segmentIndex] as T;
    const toValue = valuesToFill[segmentIndex + 1] as T;

    // Get the interpolated value from the correct segment
    result[i] = fillFunction(segmentT, fromValue, toValue);
  }

  return result;
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
        `pointOnCurve() curveMethod parameter is expected to be "lamé" | "arc" | "pow" | "powY" | "powX" or a function but \`${curveMethod}\` given.`
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
