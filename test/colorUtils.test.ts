import { describe, it, expect } from 'vitest';
import { normalizeHue, harveyHue, colorHarmonies, uniqueRandomHues, hsv2hsl, colorToCSS } from '../src/colorUtils';
import type { Vector3 } from '../src/colorUtils';

describe('normalizeHue', () => {
  it('should normalize positive hues within the 0-360 range', () => {
    expect(normalizeHue(0)).toBe(0);
    expect(normalizeHue(360)).toBe(0); // 360 is normalized to 0
    expect(normalizeHue(720)).toBe(0); // 720 is normalized to 0
    expect(normalizeHue(450)).toBe(90); // 450 is normalized to 90
  });

  it('should normalize negative hues within the 0-360 range', () => {
    expect(normalizeHue(-360)).toBe(0); // -360 is normalized to 0
    expect(normalizeHue(-90)).toBe(270); // -90 is normalized to 270
    expect(normalizeHue(-450)).toBe(270); // -450 is normalized to 270
  });

  it('should handle edge cases correctly', () => {
    expect(normalizeHue(0)).toBe(0);
    expect(normalizeHue(-0)).toBe(0); // Negative zero should also normalize to 0
    expect(normalizeHue(360)).toBe(0); // 360 is normalized to 0
    expect(normalizeHue(-360)).toBe(0); // -360 is normalized to 0
  });
});


describe('harveyHue', () => {
  it('should return a value between 0 and 360', () => {
    expect(harveyHue(0)).toBeGreaterThanOrEqual(0);
    expect(harveyHue(0)).toBeLessThanOrEqual(360);
    expect(harveyHue(360)).toBeGreaterThanOrEqual(0);
    expect(harveyHue(360)).toBeLessThanOrEqual(360);
  });

  it('should normalize input hue to the 0-360 range', () => {
    expect(harveyHue(-360)).toBeGreaterThanOrEqual(0);
    expect(harveyHue(-360)).toBeLessThanOrEqual(360);
    expect(harveyHue(720)).toBeGreaterThanOrEqual(0);
    expect(harveyHue(720)).toBeLessThanOrEqual(360);
  });

  it('should handle edge cases correctly', () => {
    expect(harveyHue(0)).toBe(0);
    expect(harveyHue(360)).toBe(0); // 360 is normalized to 0
  });
});

describe('colorHarmonies', () => {
  it('complementary should return two hues 180 degrees apart', () => {
    const baseHue = 60;
    const harmony = colorHarmonies.complementary(baseHue);
    expect(harmony).toHaveLength(2);
    expect(harmony[0]).toBe(baseHue);
    expect(harmony[1]).toBe((baseHue + 180) % 360);
  });

  it('triadic should return three hues 120 degrees apart', () => {
    const baseHue = 30;
    const harmony = colorHarmonies.triadic(baseHue);
    expect(harmony).toHaveLength(3);
    expect(harmony[0]).toBe(baseHue);
    expect(harmony[1]).toBe((baseHue + 120) % 360);
    expect(harmony[2]).toBe((baseHue + 240) % 360);
  });

  // TODO: Add tests for other harmonies (splitComplementary, tetradic, etc.)
});

describe('uniqueRandomHues', () => {
  it('should generate the correct number of hues', () => {
    const total = 5;
    const hues = uniqueRandomHues({ total });
    expect(hues).toHaveLength(total);
  });

  it('should generate hues within the 0-360 range', () => {
    const hues = uniqueRandomHues({ total: 10 });
    hues.forEach(hue => {
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
    });
  });

  it('should generate unique hues', () => {
    const hues = uniqueRandomHues({ total: 6, minHueDiffAngle: 1 }); // Ensure uniqueness is likely
    const uniqueHues = new Set(hues);
    expect(hues.length).toBe(uniqueHues.size);
  });

  it('should respect minHueDiffAngle (probabilistically)', () => {
    const total = 4;
    const minHueDiffAngle = 90;
    const hues = uniqueRandomHues({ total, minHueDiffAngle });

    // Check differences between sorted hues
    const sortedHues = [...hues].sort((a, b) => a - b);
    for (let i = 0; i < sortedHues.length; i++) {
      const h1 = sortedHues[i] as number;
      const h2 = sortedHues[(i + 1) % sortedHues.length] as number;
      let diff = Math.round(Math.abs(h1 - h2));
      if (diff > 180) diff = 360 - diff; // Handle wrap-around difference
      // Because it picks from pre-calculated slots, the difference should be >= minHueDiffAngle
      expect(diff).toBeGreaterThanOrEqual(minHueDiffAngle);
    }
  });
});

describe('hsv2hsl', () => {
  it('should convert HSV black to HSL black', () => {
    const hsv: Vector3 = [0, 0, 0];
    const hsl = hsv2hsl(hsv);
    expect(hsl[0]).toBe(0); // Hue is irrelevant for black
    expect(hsl[1]).toBe(0); // Saturation
    expect(hsl[2]).toBe(0); // Lightness
  });

  it('should convert HSV white to HSL white', () => {
    const hsv: Vector3 = [0, 0, 1];
    const hsl = hsv2hsl(hsv);
    expect(hsl[0]).toBe(0); // Hue is irrelevant for white
    expect(hsl[1]).toBe(0); // Saturation
    expect(hsl[2]).toBe(1); // Lightness
  });

  it('should convert HSV red to HSL red', () => {
    const hsv: Vector3 = [0, 1, 1]; // Max saturation, max value
    const hsl = hsv2hsl(hsv);
    expect(hsl[0]).toBe(0);   // Hue
    expect(hsl[1]).toBe(1);   // Saturation
    expect(hsl[2]).toBe(0.5); // Lightness
  });

  it('should convert HSV gray to HSL gray', () => {
    const hsv: Vector3 = [0, 0, 0.5]; // No saturation, mid value
    const hsl = hsv2hsl(hsv);
    expect(hsl[0]).toBe(0);   // Hue
    expect(hsl[1]).toBe(0);   // Saturation
    expect(hsl[2]).toBe(0.5); // Lightness
  });
});

describe('colorToCSS', () => {
  it('should format HSL correctly', () => {
    const color: Vector3 = [120, 0.5, 0.75]; // H, S, L
    expect(colorToCSS(color, 'hsl')).toBe('hsl(120 50% 75%)');
  });

  it('should format LCH correctly', () => {
    // Note: Direct conversion from HSL to LCH isn't done here,
    // assuming input is already LCH-like for formatting purposes
    const color: Vector3 = [240, .8, .6]; // H, C, L (example values)
    expect(colorToCSS(color, 'lch')).toBe('lch(60% 80% 240)');
  });

  it('should format OKLCH correctly', () => {
     // Assuming input is OKLCH-like
    const color: Vector3 = [180, 0.2, 0.8]; // H, C, L (example values)
    expect(colorToCSS(color, 'oklch')).toBe('oklch(80% 20% 180)');
  });

  it('should format HSV correctly (by converting to HSL)', () => {
    const color: Vector3 = [0, 1, 1]; // HSV Red
    // Expected HSL: [0, 1, 0.5] => hsl(0 100% 50%)
    expect(colorToCSS(color, 'hsv')).toBe('hsl(0 100% 50%)');
  });

  it('should default to oklch if mode is omitted', () => {
     // Assuming input is OKLCH-like
    const color: Vector3 = [180, 0.2, 0.8];
    expect(colorToCSS(color)).toBe('oklch(80% 20% 180)');
  });
});
