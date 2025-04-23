import type { Vector2, Vector3 } from "./colorUtils";
import type { CurveMethod } from "./utils";
export declare type ModifiedEasingFn = (x: number, fr?: number) => number;
export declare type hueArguments = {
    hStart?: number;
    hStartCenter?: number;
    hCycles?: number;
    hEasing?: ModifiedEasingFn;
};
export declare type presetHues = {
    hueList: number[];
};
export declare type saturationArguments = {
    sRange?: Vector2;
    sEasing?: ModifiedEasingFn;
};
export declare type lightnessArguments = {
    lRange?: Vector2;
    lEasing?: ModifiedEasingFn;
};
declare type BaseGenerateColorRampArgument = {
    total?: number;
    transformFn?: (hsl: Vector3, i?: number) => Vector3 | string;
} & hueArguments & saturationArguments & lightnessArguments;
export declare type GenerateColorRampArgument = BaseGenerateColorRampArgument & {
    hueList?: never;
};
export declare type GenerateColorRampArgumentFixedHues = BaseGenerateColorRampArgument & presetHues;
/**
 * Generates a color ramp based on the HSL color space.
 * @param {GenerateColorRampArgument} args - The arguments to generate the ramp.
 * @returns {Array<number>} - The color ramp.
 */
export declare function generateColorRamp({ total, hStart, hStartCenter, hEasing, hCycles, sRange, sEasing, lRange, lEasing, transformFn, hueList, }?: GenerateColorRampArgument | GenerateColorRampArgumentFixedHues): Vector3[];
export declare const generateColorRampWithCurve: ({ total, hStart, hStartCenter, hCycles, sRange, lRange, hueList, curveMethod, curveAccent, transformFn, }?: (GenerateColorRampArgument | GenerateColorRampArgumentFixedHues) & {
    curveMethod?: CurveMethod | undefined;
    curveAccent?: number | undefined;
}) => Vector3[];
export {};
