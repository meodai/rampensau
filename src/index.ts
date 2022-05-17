export type FuncNumberReturn = (arg0: number) => number;
export type Vector2 = [number, number];
export type Vector3 = [number, number, number];
export type GenerateHSLRampArgument = {
  total?: number;
  hCenter?: number;
  hCycles?: number;
  sRange?: Vector2;
  lRange?: Vector2;
  sEasing?: FuncNumberReturn;
  lEasing?: FuncNumberReturn;
};

/**  
 * Generates a color ramp based on the HSL color space.
 * @param {GenerateHSLRampArgument} args - The arguments to generate the ramp.
 * @returns {Array<number>} - The color ramp.
*/
export default function generateHSLRamp({
  total = 9,
  hCenter = Math.random() * 360,
  hCycles = 1,
  sRange = [0.4, 0.35],
  sEasing = (x) => Math.pow(x, 2),
  lRange = [Math.random() * 0.1, 0.9],
  lEasing = (x) => Math.pow(x, 1.5),
}: GenerateHSLRampArgument = {}): Vector3[] {
  const hueSlice: number = 360 / total;
  const hues: number[] = new Array(total)
    .fill(0)
    .map(
      (_, i): number => 360 + ((-180 + hCenter + i * hCycles * hueSlice) % 360)
    );
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
