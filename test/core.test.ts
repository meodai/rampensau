import { describe, it, expect } from 'vitest';
import { generateColorRamp, generateColorRampWithCurve } from '../src/core';
import type { Vector3 } from '../src/colorUtils';

describe('generateColorRamp', () => {
  it('should generate the correct number of colors', () => {
    const colors = generateColorRamp({ total: 5 });
    expect(colors).toHaveLength(5);
  });

  it('should generate colors within HSL constraints', () => {
    const colors = generateColorRamp({ total: 10 });
    colors.forEach((color: Vector3) => {
      expect(color[0]).toBeGreaterThanOrEqual(0); // Hue
      expect(color[0]).toBeLessThanOrEqual(360);
      expect(color[1]).toBeGreaterThanOrEqual(0); // Saturation
      expect(color[1]).toBeLessThanOrEqual(1);
      expect(color[2]).toBeGreaterThanOrEqual(0); // Lightness
      expect(color[2]).toBeLessThanOrEqual(1);
    });
  });

  it('should respect hStart parameter', () => {
    const hStart = 180;
    const colors = generateColorRamp({ total: 5, hStart, hStartCenter: 0 });
    // The first color's hue should be close to hStart when hStartCenter is 0
    expect(colors[0]?.[0]).toBeCloseTo(hStart);
  });

  it('should respect hCycles parameter', () => {
    const hStart = 0;
    const hCycles = 1;
    const total = 5;
    const colors = generateColorRamp({ total, hStart, hCycles, hStartCenter: 0 });
    // With 1 cycle and hStartCenter 0, the last color should be close to the first
    expect(colors[total - 1]?.[0]).toBeCloseTo(colors[0]?.[0] as number, 0); // Allow some tolerance
  });

  it('should use hueList when provided', () => {
    const hueList = [0, 120, 240];
    const colors = generateColorRamp({ hueList });
    expect(colors).toHaveLength(hueList.length);
    expect(colors[0]?.[0]).toBe(hueList[0]);
    expect(colors[1]?.[0]).toBe(hueList[1]);
    expect(colors[2]?.[0]).toBe(hueList[2]);
  });

  it('should apply transformFn', () => {
    const transformFn = ([h, s, l]: Vector3): Vector3 => [h, s * 0.5, l];
    const colors = generateColorRamp({ total: 3, transformFn, sRange: [1, 1] });
    colors.forEach(color => {
      expect(color[1]).toBeLessThanOrEqual(0.5); // Saturation should be halved
    });
  });
});

describe('generateColorRampWithCurve', () => {
  it('should generate the correct number of colors', () => {
    const colors = generateColorRampWithCurve({ total: 7 });
    expect(colors).toHaveLength(7);
  });

  it('should generate colors within HSL constraints', () => {
    const colors = generateColorRampWithCurve({ total: 10 });
    colors.forEach((color: Vector3) => {
      expect(color[0]).toBeGreaterThanOrEqual(0);
      expect(color[0]).toBeLessThanOrEqual(360);
      expect(color[1]).toBeGreaterThanOrEqual(0);
      expect(color[1]).toBeLessThanOrEqual(1);
      expect(color[2]).toBeGreaterThanOrEqual(0);
      expect(color[2]).toBeLessThanOrEqual(1);
    });
  });

  it('should use curveMethod for easing', () => {
    // This test is a bit indirect, checking if output differs from default generateColorRamp
    // A more robust test would mock makeCurveEasings or check specific curve outputs
    const colorsCurve = generateColorRampWithCurve({ total: 5, curveMethod: 'lamé', curveAccent: 0.5 });
    const colorsDefault = generateColorRamp({ total: 5 }); // Uses default easings

    // Expecting the results to be different due to different easing functions
    // Note: This might fail if default easings happen to produce the same result for a specific input
    expect(colorsCurve).not.toEqual(colorsDefault);
  });
});
