export type FuncNumberReturn = (arg0: number) => number;
export type Vector2 = [number, number];
export type Vector3 = [number, number, number];
export type GenerateHSLRampArgument = {
  total?: number;
  hStart?: number;
  hCycles?: number;
  sRange?: Vector2;
  lRange?: Vector2;
  sEasing?: FuncNumberReturn;
  lEasing?: FuncNumberReturn;
  slScale?: number;
};

/**
 * Generates a color ramp based on the HSL color space.
 * @param {GenerateHSLRampArgument} args - The arguments to generate the ramp.
 * @returns {Array<number>} - The color ramp.
 */
export function generateHSLRamp({
  total = 9,
  hStart = Math.random() * 360,
  hCycles = 1,
  sRange = [0.4, 0.35],
  sEasing = (x) => Math.pow(x, 2),
  lRange = [Math.random() * 0.1, 0.9],
  lEasing = (x) => Math.pow(x, 1.5),
}: GenerateHSLRampArgument = {}): Vector3[] {
  const hueSlice: number = 360 / total;
  const hues: number[] = new Array(total)
    .fill(0)
    .map((_, i): number => (360 + (hStart + i * hCycles * hueSlice)) % 360);
  const lDiff: number = lRange[1] - lRange[0];
  const sDiff: number = sRange[1] - sRange[0];

  const firstColor: Vector3 = [hues.pop() || 0, sRange[0], lRange[0]];

  const ramp: Vector3[] = new Array(total - 1)
    .fill(0)
    .map((_, i) => [
      hues.pop() || 0,
      sRange[0] + sDiff * sEasing((i + 1) / (total - 1)),
      lRange[0] + lDiff * lEasing((i + 1) / (total - 1)),
    ]);

  return [...[firstColor], ...ramp];
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
  minLight: {
    default: 0.1,
    props: { min: 0, max: 1, step: 0.001 },
  },
  maxLight: {
    default: 0.9,
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
