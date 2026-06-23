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
declare type BaseGenerateColorRampArgument<T extends Vector3 | string = Vector3> = {
    total?: number;
    transformFn?: (hsl: Vector3, i?: number) => T;
} & hueArguments & saturationArguments & lightnessArguments;
export declare type GenerateColorRampArgument<T extends Vector3 | string = Vector3> = BaseGenerateColorRampArgument<T> & {
    hueList?: never;
};
export declare type GenerateColorRampArgumentFixedHues<T extends Vector3 | string = Vector3> = BaseGenerateColorRampArgument<T> & presetHues;
/**
 * Generates a color ramp based on the HSL color space.
 * @param {GenerateColorRampArgument} args - The arguments to generate the ramp.
 * @returns {Array<number>} - The color ramp.
 */
export declare function generateColorRamp<T extends Vector3 | string = Vector3>({ total, hStart, hStartCenter, hEasing, hCycles, sRange, sEasing, lRange, lEasing, transformFn, hueList, }?: GenerateColorRampArgument<T> | GenerateColorRampArgumentFixedHues<T>): T[];
export declare const generateColorRampWithCurve: <T extends string | [number, number, number] = [number, number, number]>({ total, hStart, hStartCenter, hCycles, sRange, lRange, hueList, curveMethod, curveAccent, transformFn, }?: (GenerateColorRampArgument<T> | GenerateColorRampArgumentFixedHues<T>) & {
    curveMethod?: CurveMethod | undefined;
    curveAccent?: number | undefined;
}) => T[];
export {};
