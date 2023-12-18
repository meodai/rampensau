export type ModifiedEasingFn = (x: number, fr?: number) => number;
export type Vector2 = [number, number];
export type Vector3 = [number, number, number];
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
    return [
      hueList
        ? hueList[i] // If a hue list is provided, use it otherwise calculate the hue based on the hue arguments
        : (((360 + // Ensure the hue is always positive
            hStart + // Add the starting hue
            (1 - hEasing(relI, fraction) - hStartCenter) * (360 * hCycles)) % // Calculate the hue based on the easing function
            360) as number), // Ensure the hue is always positive and within the range of 0-360
      sRange[0] + sDiff * sEasing(relI, fraction),
      lRange[0] + lDiff * lEasing(relI, fraction),
    ] as Vector3; // Ensure the array is of type Vector3
  });
}

/**
 * shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @param {function} rndFn - The random function to use.
 * @returns {Array} - The shuffled array.
 * @see https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
export function shuffleArray<T>(array: T[], rndFn = Math.random): T[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(rndFn() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex] as T,
      array[currentIndex] as T,
    ];
  }

  return array;
}

export type colorHarmony =
  | "complementary"
  | "splitComplementary"
  | "triadic"
  | "tetradic"
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
  complementary: (h) => [h, (h + 180) % 360],
  splitComplementary: (h) => [h, (h + 150) % 360, (h + 210) % 360],
  triadic: (h) => [h, (h + 120) % 360, (h + 240) % 360],
  tetradic: (h) => [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360],
  analogous: (h) => [
    h,
    (h + 30) % 360,
    (h + 60) % 360,
    (h + 90) % 360,
    (h + 120) % 360,
    (h + 150) % 360,
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
 * functions to convert from the ramp's colors values to CSS color functions.
 */
const colorModsCSS = {
  oklch: (color) => [color[2] * 100 + "%", color[1] * 100 + "%", color[0]],
  lch: (color) => [color[2] * 100 + "%", color[1] * 100 + "%", color[0]],
  hsl: (color) => [color[0], color[1] * 100 + "%", color[2] * 100 + "%"],
};

export type colorToCSSxLCHMode = "oklch" | "lch" | "hsl";
/**
 * Converts Hxx (Hue, Chroma, Lightness) values to a CSS `oklch()` color function string.
 *
 * @param {Object} hxx - An object with hue, chroma, and lightness properties.
 * @param {number} hxx.hue - The hue value.
 * @param {number} hxx.chroma - The chroma value.
 * @param {number} hxx.lightness - The lightness value.
 * @returns {string} - The CSS color function string in the format `oklch(lightness% chroma hue)`.
 */
export const colorToCSS = (
  color: Vector3,
  mode: colorToCSSxLCHMode = "oklch"
): string => `${mode}(${colorModsCSS[mode](color).join(" ")})`;

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
 * @param {Array} initial - The initial array of values.
 * @param {number} targetSize - The desired size of the resulting array.
 * @param {function} fillFunction - The interpolation function (default is lerp).
 * @returns {Array} The scaled and spread array.
 * @throws {Error} If the initial array is empty or target size is invalid.
 */
export const scaleSpreadArray = <T>(
  initial: T[],
  targetSize: number,
  fillFunction: FillFunction<T> = lerp as unknown as FillFunction<T>
): T[] => {
  if (initial.length === 0) {
    throw new Error("Initial array must not be empty.");
  }
  if (targetSize < initial.length) {
    throw new Error(
      "Target size must be greater than or equal to the initial array length."
    );
  }

  const valuesToAdd = targetSize - initial.length;
  const chunkArray = initial.map((value) => [value]);

  for (let i = 0; i < valuesToAdd; i++) {
    (chunkArray[i % (initial.length - 1)] as T[]).push(null as unknown as T);
  }

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

/**
 * A set of default parameters and sain ranges to use `generateColorRamp`
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
    props: { min: -1.25, max: 1.5, step: 0.001 },
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
};
