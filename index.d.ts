export declare type ModifiedEasingFn = (x: number, fr?: number) => number;
export declare type Vector2 = [number, number];
export declare type Vector3 = [number, number, number];
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
declare type BaseGenerateHSLRampArgument = {
    total?: number;
} & hueArguments & saturationArguments & lightnessArguments;
export declare type GenerateHSLRampArgument = BaseGenerateHSLRampArgument & {
    hueList?: never;
};
export declare type GenerateHSLRampArgumentFixedHues = BaseGenerateHSLRampArgument & presetHues;
/**
 * Generates a color ramp based on the HSL color space.
 * @param {GenerateHSLRampArgument} args - The arguments to generate the ramp.
 * @returns {Array<number>} - The color ramp.
 */
export declare function generateHSLRamp(args: GenerateHSLRampArgument): Vector3[];
export declare function generateHSLRamp(args: GenerateHSLRampArgumentFixedHues): Vector3[];
export declare function shuffleArray<T>(array: T[], rndFn?: () => number): T[];
export declare type colorHarmony = "complementary" | "splitComplementary" | "triadic" | "tetradic" | "analogous";
export declare type colorHarmonyFn = (h: number) => number[];
/**
 * Generates a list of hues based on a color harmony.
 * @param {number} h - The base hue.
 * @param {colorHarmony} harmony - The color harmony.
 * @returns {Array<number>} - The list of hues.
 */
export declare const colorHarmonies: {
    [key in colorHarmony]: colorHarmonyFn;
};
export declare type uniqueRandomHuesArguments = {
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
export declare function uniqueRandomHues({ startHue, total, minHueDiffAngle, rndFn, }?: {
    startHue?: number | undefined;
    total?: number | undefined;
    minHueDiffAngle?: number | undefined;
    rndFn?: (() => number) | undefined;
}): number[];
export declare function map(n: number, start1: number, stop1: number, start2: number, stop2: number): number;
export declare function scaleVector(vector: number[], originalScale?: [number, number][], targetScale?: [number, number][]): number[];
export declare function hslColorsToCSS(colors: Vector3[]): string[];
export declare const generateHSLRampParams: {
    hStart: {
        default: number;
        props: {
            min: number;
            max: number;
            step: number;
        };
    };
    hCycles: {
        default: number;
        props: {
            min: number;
            max: number;
            step: number;
        };
    };
    hStartCenter: {
        default: number;
        props: {
            min: number;
            max: number;
            step: number;
        };
    };
    minLight: {
        default: number;
        props: {
            min: number;
            max: number;
            step: number;
        };
    };
    maxLight: {
        default: number;
        props: {
            min: number;
            max: number;
            step: number;
        };
    };
    total: {
        default: number;
        props: {
            min: number;
            max: number;
            step: number;
        };
    };
    minSaturation: {
        default: number;
        props: {
            min: number;
            max: number;
            step: number;
        };
    };
    maxSaturation: {
        default: number;
        props: {
            min: number;
            max: number;
            step: number;
        };
    };
};
export {};
