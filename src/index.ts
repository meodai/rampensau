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

type BaseGenerateHSLRampArgument = {
  total?: number;
} & hueArguments &
  saturationArguments &
  lightnessArguments;

export type GenerateHSLRampArgument = BaseGenerateHSLRampArgument & {
  hueList?: never;
};

export type GenerateHSLRampArgumentFixedHues = BaseGenerateHSLRampArgument &
  presetHues;

/**
 * Generates a color ramp based on the HSL color space.
 * @param {GenerateHSLRampArgument} args - The arguments to generate the ramp.
 * @returns {Array<number>} - The color ramp.
 */

export function generateHSLRamp(args: GenerateHSLRampArgument): Vector3[];
export function generateHSLRamp(
  args: GenerateHSLRampArgumentFixedHues
): Vector3[];
export function generateHSLRamp({
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
}: GenerateHSLRampArgument | GenerateHSLRampArgumentFixedHues = {}): Vector3[] {
  const lDiff: number = lRange[1] - lRange[0];
  const sDiff: number = sRange[1] - sRange[0];

  const length = hueList && hueList.length > 0 ? hueList.length : total;

  return Array.from({ length }, (_, i) => {
    const relI = i / (length - 1);
    const fraction = 1 / length;
    return [
      hueList
        ? hueList[i]
        : (((360 +
            hStart +
            (1 - hEasing(relI, fraction) - hStartCenter) * (360 * hCycles)) %
            360) as number), // Ensure the first element is always a number
      sRange[0] + sDiff * sEasing(relI, fraction),
      lRange[0] + lDiff * lEasing(relI, fraction),
    ] as Vector3; // Ensure the array is of type Vector3
  });
}

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

export function map(
  n: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number
): number {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

export function scaleVector(
  vector: number[],
  originalScale: [number, number][] = [
    [0, 360],
    [0, 1],
    [0, 1],
  ],
  targetScale: [number, number][] = [
    [0, 360],
    [0, 100],
    [0, 100],
  ]
): number[] {
  return vector.map((vec, i) =>
    map(
      vec,
      originalScale?.[i]?.[0] || 0,
      originalScale?.[i]?.[1] || 1,
      targetScale?.[i]?.[0] || 0,
      targetScale?.[i]?.[1] || 100
    )
  );
}

export function hslColorsToCSS(colors: Vector3[]): string[] {
  return colors.map((hsl) => {
    const [h, s, l] = scaleVector(hsl);
    return `hsl(${h}, ${s}%, ${l}%)`;
  });
}

export const generateHSLRampParams = {
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
  total: {
    default: 5,
    props: { min: 4, max: 50, step: 1 },
  },
  minSaturation: {
    default: 0.4,
    props: { min: 0, max: 1, step: 0.001 },
  },
  maxSaturation: {
    default: 0.35,
    props: { min: 0, max: 1, step: 0.001 },
  },
};
