# RampenSau 🎢🐷🎨

**RampenSau** is a color palette generation library that utilizes **hue cycling** and
**easing functions** to generate color ramps. It can generate a sequence of hues, or use a list of hues to generate a color ramp.

Perfect for generating color palettes for data visualizations, visual design, generative art, or just for fun.

![generated RampenSau color palettes Animation](./rampensau.gif)

## Demos

- [Official Docs & Demo](https://meodai.github.io/rampensau/)
  Interactive Documentation with example function calls
- [1000 Generative Samples](https://codepen.io/meodai/pen/ExQWwar?editors=0010)
  Generating a 1000 palettes using similar settings in with lch
- [p5.js Exaomple](https://editor.p5js.org/meodai/sketches/dzEX_4wTN)
  3d example using p5.js's `color()` function
- [Syntax Highlighting](https://meodai.github.io/rampensau/highlighter.html)
  Generative syntax highlighting themes using RampenSau
- [Mini HDR Posters](https://codepen.io/meodai/pen/zYeXEyw)
  Generative posters using lCH (p3+ gamut)
- [Color Ratios](https://codepen.io/meodai/full/vYbwbym)
  Generative rectangles
- [p5.js Stamps](https://openprocessing.org/sketch/2628160)
  Fork of a sketch originally made by [Okazz](https://openprocessing.org/user/128718/?view=sketches).
- [Farbvelo Color Generator](https://farbvelo.elastiq.ch/).
  Project this code is based on

## Installation

**Rampensau** is bundled as both UMD and ES on npm. Install it using your package manager of choice:

```bash
npm install rampensau
```

You can then import RampenSau into your project:

```js
// ES style: import individual methods
import { generateColorRamp } from "rampensau";

// Depending on your setup, you might need to import the MJS version directly
import { generateColorRamp } from "rampensau/dist/index.mjs";

// CJS style
let generateColorRamp = require("rampensau");
```

Or include it directly in your HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/rampensau/dist/index.js"></script>
<!-- or -->
<script type="module">
  import { generateColorRamp } from "https://esm.sh/rampensau/";
</script>
```

## Basic Usage

```js
import { generateColorRamp } from 'rampensau';

const hslColorValues = generateColorRamp({
  // hue generation options
  total: 9,                           // number of colors in the ramp
  hStart: Math.random() * 360,         // hue at the start of the ramp
  hCycles: 1,                           // number of full hue cycles 
                                       // (.5 = 180°, 1 = 360°, 2 = 720°, etc.)
  hStartCenter: 0.5,                    // where in the ramp the hue should be centered
  hEasing: (x, fr) => x,                // hue easing function x is a value between 0 and 1 
                                       // fr is the size of each fraction of the ramp: (1 / total)

  // if you want to use a specific list of hues, you can pass an array of hues to the hueList option
  // all other hue options will be ignored

  // hueList: [...],                      // list of hues to use

  // saturation
  sRange: [0.4, 0.35],                 // saturation range
  sEasing: (x, fr) => Math.pow(x, 2),   // saturation easing function

  // lightness
  lRange: [Math.random() * 0.1, 0.9],  // lightness range
  lEasing: (x, fr) => Math.pow(x, 1.5), // lightness easing function

  transformFn: (color, i) => color; // function to adjust/convert the color after generation
}); // => [[0…360,0…1,0…1], …]
```

### generateColorRamp(Options{})

**generateColorRamp** is the core function of **RampenSau**. It returns an array of colors in **HSL** format (`[0…360, 0…1, 0…1]`). To get a better understanding of the options, it might be helpful to familiarize yourself with the [HSL color model](https://en.wikipedia.org/wiki/HSL_and_HSV) or to play with the interactive [Demo / Documentation](https://meodai.github.io/rampensau/).

The function returns an array of colors, each represented as an array of three values: `[Hue, Saturation, Lightness]`. Hue is in degrees `(0-360)`, while Saturation and Lightness are normalized values between `0 and 1`. We use the term "HXX" loosely because while the structure is similar to HSL, these base values can be mapped to various polar color models like HSL, HSV, LCH, or OKLCH.

**Important**: When converting to a specific model, map these values appropriately. For HSL, Saturation and Lightness map directly (usually scaled to percentages). For models like LCH or OKLCH, the library's Saturation value needs to be mapped and potentially scaled to represent Chroma, and Lightness maps to the corresponding Lightness component. The examples using CSS (`hsl()`, `oklch()`) and the Culori library demonstrate this mapping and scaling. The provided colorToCSS helper function handles this conversion automatically for common CSS formats.

#### Options

Every single option has a default value, so you can just call the function without any arguments.
It will generate a color ramp with 9 colors, starting at a random hue, with a single hue cycle.

While the function always generates some sort of color ramp, there are two main ways to generate hues independently of saturation and lightness: **Let the function generate a sequence of hues**, or **pass a list of hues** to use.

##### Hue sequence generation

If you want to generate a sequence of hues, you can use the following options:

- `total` int 3…∞           → Amount of colors the function will generate.
- `hStart` float 0…360      → Starting point of the hue ramp. 0 Red, 180 Teal etc..
- `hStartCenter`: float 0…1 → Center the hue in the color ramp. 0 = start, 0.5 = middle, 1 = end.
- `hCycles` float -∞…0…+∞   → Number of hue cycles. (.5 = 180°, 1 = 360°, 2 = 720°, etc.)
- `hEasing` function(x)     → Hue easing function

The `hStart` sets the starting point of the hue ramp. The `hStartCenter` sets where in the ramp the hue should be centered. If your ramp starts with a high or low lightness, you might want to center the hue in the middle of the ramp. That is why the default value for `hStartCenter` is `0.5`. (In the center of a given ramp).

The `hStartCenter` option tells the function where the start hue should be in your ramp. A value of `0` will generate a ramp that starts with the hue at the beginning of the ramp. A value of `0.5` will generate a ramp that starts with the hue in the middle of the ramp. A value of `1` will generate a ramp that starts with the hue at the end of the ramp.

The `hCycles` option sets the number of hue cycles. A value of `1` will generate a ramp with a single hue cycle. Meaning they will go around the color wheel once. A value of `0.5` will generate a ramp with 180° hue cycle (starting from hStart to its complementary hue). A value of `2` will rotate around the color wheel twice. A value of `-1` will generate a ramp with a reversed hue cycle. A value of `-0.5` will generate a ramp with a reversed 180° hue cycle. A value of `-2` will generate a ramp with a reversed 720° hue cycle.

**Note:** The further away `hCycles` is from `0`, the more hue variation you will get in the ramp. 

##### Hue List

If you want to use a specific list of hues, you can pass an array of hues to the `hueList` option. All other hue options will be ignored. For example, if you want to generate a ramp with 3 colors, but you want to use random unique hues, you can do this:

- `hueList` array [0…360]   → List of hues to use. All other hue options will be ignored.

**Example:**

```js
import {
  generateColorRamp,
  uniqueRandomHues,
} from "rampensau";

generateColorRamp({
  hueList: uniqueRandomHues({
    startHue: Math.random() * 360, 
    total: 5, 
    minHueDiffAngle: 90,
  })
})
```

The `uniqueRandomHues` function will generate a list of unique hues with a minimum distance of 90° between each hue. This list is then passed to the `hueList` option of `generateColorRamp`. `uniqueRandomHues` is also exported by RampenSau, so you can use it directly.

##### Saturation & Lightness

- `sRange` array [0…1,0…1]  → Saturation Range
- `lRange` array [0…1,0…1]  → Lightness Range

##### Easing Functions

Each of the color dimensions can be eased using a custom function.
The function takes an input value `x` and returns a value between 0 and 1:

- `hEasing` function(x)     → Hue easing function
- `sEasing` function(x)     → Saturation easing function
- `lEasing` function(x)     → Lightness easing function

##### Transform Function

- `transformFn` function(color, i) → Function to adjust/transform or convert the color after generation. The function takes the generated color and its index as arguments. You can use this function to apply any adjustments you want to the generated colors.

**Example:**

```js
const hslColorValues = generateColorRamp({
  transformFn: ([h, s, l], i) => {
    // Adjust the color to be more saturated
    return [h, s, .2 + l * .8];
  }
});
```

It could also be used to get a CSS String instead of the array. Just use the `colorToCSS` function from the color utility functions:

```js
const hslColorValues = generateColorRamp({
  transformFn: ([h, s, l]) => colorToCSS(color, 'oklch')
});
```

**TypeScript Node** `transformFn` is typed as `(color: number[], i: number) => number[] | string`. If you need to return anything else, you can use a type assertion to cast the return value to whatever you need.

### generateColorRampWithCurve(Options{})

**generateColorRampWithCurve** is a convenience function that uses pre-defined curve methods for easing functions. It accepts all the same options as `generateColorRamp` plus two additional options:

- `curveMethod` string      → The curve method to use for easing. One of `'lamé'`, `'sine'`, `'power'`, or `'linear'`.
- `curveAccent` float 0…5   → The accent of the curve, affecting how pronounced the curve's effect is.

**Note:** It is recommended to use `HSV` as the color space for the `curveMethod` option. It produces nicer looking ramps and is easier to work with, because the lightness and saturation are both 100% at the upper right corner of the the `HSV` slice.

**Example:**

```js
import { generateColorRampWithCurve } from 'rampensau';

const hslColorValues = generateColorRampWithCurve({
  total: 9,
  hStart: 180,
  curveMethod: 'lamé',
  curveAccent: 0.5,
  sRange: [0.4, 0.8],
  lRange: [0.2, 0.8],
}); // => [[0…360,0…1,0…1], …]
```

## Hue Generation Functions

### uniqueRandomHues(Options{})

Function returns an array of unique random hues. Mostly useful for generating a list of hues to use with `hueList`. Alternatively you can use `(x) => Math.random()` as the `hEasing` function in `generateColorRamp` but this will not guarantee unique hues.

- `startHue` float 0…360        → Starting point of the hue ramp. 0 Red, 180 Teal etc..
- `total` int 3…∞               → Amount of base colors.
- `minHueDiffAngle` float 0…360 → Minimum angle between hues.
- `rndFn` function()            → Random function. Defaults to `Math.random`.

### colorHarmonies.colorHarmony(Options{})

Function returns an array of hues based on color harmony theory.

Available harmonies:
- `complementary` - Base hue and its complement (180° opposite)
- `splitComplementary` - Base hue and two hues on either side of its complement
- `triadic` - Three hues evenly spaced around the color wheel
- `tetradic` - Four hues evenly spaced around the color wheel
- `monochromatic` - Just the base hue
- `doubleComplementary` - Two complementary pairs
- `compound` - A mix of complementary and analogous
- `analogous` - A series of adjacent hues

**Example:**

```js
import {
  generateColorRamp,
} from "rampensau";

import { colorHarmonies } from "rampensau/hueGeneration";

generateColorRamp({
  hueList: colorHarmonies.splitComplementary(Math.random() * 360),
  sRange: [0.4, 0.35],
  lRange: [Math.random() * 0.1, 0.9],
});
```

## Color Utility Functions

To keep the library small, RampenSau does not include any color conversion functions. 
However, it does provide a few utility functions to help you work with **RampenSau** or
its generated colors.

### colorToCSS(color, mode)

In order to use the colors generated by **RampenSau** in CSS or Canvas, you need to convert them to a CSS color format. This helper function does just that. It returns a CSS string from a color in the format generated from **generateColorRamp** (`[0…360,0…1,0…1]`).

- `color` array [0…360,0…1,0…1] → Color in format generated from **generateColorRamp** (`[0…360,0…1,0…1]`).
- `mode` string → Color mode to use. One of `hsl`, `hsv`, `lch` or `oklch`. Defaults to `oklch`. (Note that `hsl` is clamped to the sRGB gamut, while `lch` and `oklch` will make use of the full gamut supported by the target monitor / device.)

**Example**:
  
```js
import {
  colorToCSS
} from "rampensau/colorUtils";

console.log( 
  generateColorRamp().map(color => colorToCSS(color, 'oklch')) 
); // ['oklch(5.57% 40% 348.39)', 'oklch(14.59% 38.72% 314.74)', …]
```

### harveyHue(h)

Transforms a hue to create a more evenly distributed spectrum without the over-abundance of green and ultramarine in the standard HSL/HSV color wheel. Originally written by [@harvey](https://twitter.com/harvey_rayner/status/1748159440010809665) and adapted for use in RampenSau.

- `h` float 0…360 → Hue value to transform, normalized to 0-360 range.

**Example**:

```js
import { harveyHue } from "rampensau/colorUtils";

const transformedHue = harveyHue(0.5); // Returns a transformed hue value
```

## Using RampenSau with a color library

If you are already using a color library like [culori](https://culorijs.org/api/) you can use its
`formatCSS` function instead. Just don't forget to scale the chroma value to the [adequate range](https://culorijs.org/color-spaces/).

```js
culori.formatCss({ mode: 'oklch', 
  l: color[2],
  c: color[1] * 0.4,
  h: color[0],
})

culori.formatCss({ mode: 'lch', 
  l: color[2] * 100,
  c: color[1] * 150,
  h: color[0],
});
```

## Other Utility Functions

RampenSau also provides several utility functions for working with arrays and curves:

### Usage

```js
import { shuffleArray, lerp, scaleSpreadArray, pointOnCurve, makeCurveEasings } from 'rampensau/utils';
```

### shuffleArray(array, rndFn)

Returns a new shuffled array based on the input array.

- `array` array      → The array to shuffle
- `rndFn` function() → Random function. Defaults to `Math.random`

### scaleSpreadArray(valuesToFill, targetSize, fillFunction)

Scales and spreads an array to the target size using interpolation. 
In the context of RampenSau, this is used to create a smooth transition between colors.
Let's say you have an array of 3 colors and you want to create a ramp of 10 colors.
You can use this function to fill the gaps between the colors and create a smooth transition.

- `valuesToFill` array     → Initial array of values
- `targetSize` int         → Desired size of the resulting array
- `fillFunction` function  → Interpolation function (defaults to lerp)

### lerp(amt, from, to)

Linearly interpolates between two values. 
Mainly used for the `fillFunction` in `scaleSpreadArray`.

- `amt` float 0…1   → The interpolation amount
- `from` number     → The starting value
- `to` number       → The ending value

### pointOnCurve(curveMethod, curveAccent)

Returns a function that calculates the point on a curve at a given t value.

- `curveMethod` string or function → The curve method to use
- `curveAccent` float              → The accent of the curve

### makeCurveEasings(curveMethod, curveAccent)

Generates saturation and lightness easing functions based on a curve method.

- `curveMethod` string or function → The curve method to use
- `curveAccent` float              → The accent of the curve

## About the Name

For non-German speakers, "Rampe" in German means both a ramp (or gradient) and a theatrical stage. A "RampenSau" (literally "stage-sow/pig") is a German expression for someone who thrives in the spotlight - a natural performer. The name playfully combines this concept with the library's purpose of creating color ramps and gradients.

## License

Rampensau is distributed under the [MIT License](./LICENSE).
Feel free to use it in your projects, but please give credit where it's due. If you find this library useful, consider starring the repository on GitHub or sharing it with your friends and colleagues.
