export * as utils from "./utils";
export * as colorUtils from "./colorUtils";
export { generateColorRamp, generateColorRampWithCurve } from "./core";
/**
 * A set of default parameters and sain ranges to use `generateColorRamp`
 * when coming up with random color ramps.
 */
/**
 * A set of default parameters and sane ranges to use with `generateColorRamp`
 * when coming up with random color ramps.
 */
export declare const generateColorRampParams: {
    total: {
        default: number;
        props: {
            min: number;
            max: number;
            step: number;
        };
    };
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
    curveMethod: {
        default: string;
        props: {
            options: string[];
        };
    };
    curveAccent: {
        default: number;
        props: {
            min: number;
            max: number;
            step: number;
        };
    };
};
