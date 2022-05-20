export declare type FuncNumberReturn = (arg0: number) => number;
export declare type Vector2 = [number, number];
export declare type Vector3 = [number, number, number];
export declare type GenerateHSLRampArgument = {
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
export declare function generateHSLRamp({ total, hStart, hCycles, sRange, sEasing, lRange, lEasing, }?: GenerateHSLRampArgument): Vector3[];
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
