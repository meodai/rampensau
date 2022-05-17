export declare type FuncNumberReturn = (arg0: number) => number;
export declare type Vector2 = [number, number];
export declare type Vector3 = [number, number, number];
export declare type GenerateHSLRampArgument = {
    total?: number;
    hCenter?: number;
    hCycles?: number;
    sRange?: Vector2;
    lRange?: Vector2;
    sEasing?: FuncNumberReturn;
    lEasing?: FuncNumberReturn;
};
export default function generateHSLRamp({ total, hCenter, hCycles, sRange, sEasing, lRange, lEasing, }?: GenerateHSLRampArgument): Vector3[];
