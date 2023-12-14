# RampenSau 🎢🐷

**RampenSau** is a color palette generation function that utilizes **hue cycling** and
**easing functions** to generate color ramps. It can generate a sequence of hues, or use a list of hues to generate a color ramp.

Perfect for generating color palettes for data visualizations, visual design, generative art, or just for fun.

![generated RampenSau color palettes Animation](./rampensau.gif)

## Demos

- [Official Docs & Demo](https://meodai.github.io/rampensau/)
  Interactive Documentation with example function calls
- [Two Random Color Ramps](https://codepen.io/meodai/pen/yLvgxQK?editors=0010)
  Simple set of ramps with random easing
- [Color Ratios](https://codepen.io/meodai/full/vYbwbym)
  Simple generative rectangles
- [Mini HDR Posters](https://codepen.io/meodai/pen/zYeXEyw)
  Generative posters using lCH (p3+ gamut)
- [1000 Generative Samples](https://codepen.io/meodai/pen/ExQWwar?editors=0010)
  Simple example generating a 1000 palettes using similar settings
- [Farbvelo Color Generator](https://farbvelo.elastiq.ch/).
  Project this code is based on

## Installation

**Rampensau** is bundled as both UMD and ES on npm. Install it using your package manager of choice:

```js
npm install rampensau
```

You can then import RampenSau into your project:

```js
// ES style: import individual methods
import { generateRandomColorRamp } from "rampensau";

// Depending on your setup, you might need to import the MJS version directly
import { generateRandomColorRamp } from "rampensau/dist/index.mjs";

// CJS style
let generateRandomColorRamp = require("rampensau");
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

function generateColorRamp  ({
  // hue generation options
  total   : 9,                           // number of colors in the ramp
  hStart  : Math.random() * 360,         // hue at the start of the ramp
  hCycles : 1,                           // number of full hue cycles 
                                         // (.5 = 180°, 1 = 360°, 2 = 720°, etc.)
  hStartCenter : 0.5,                    // where in the ramp the hue should be centered
  hEasing : (x, fr) => x,                // hue easing function x is a value between 0 and 1 
                                         // fr is the size of each fraction of the ramp: (1 / total)

  // if you want to use a specific list of hues, you can pass an array of hues to the hueList option
  // all other hue options will be ignored

  // hueList : […],                      // list of hues to use

  // saturation
  sRange  : [0.4, 0.35],                 // saturation range
  sEasing : (x, fr) => Math.pow(x, 2),   // saturation easing function

  // lightness
  lRange  : [Math.random() * 0.1, 0.9],  // lightness range
  lEasing : (x, fr) => Math.pow(x, 1.5), // lightness easing function
});
```

### generateColorRamp(Options{})

**generateColorRamp** is the core function of **RampenSau***, it returns an array of colors in **HSL** format (`[0…360, 0…1, 0…1]`). To get a better understanding of the options, it might be helpful to familiarize yourself with the [HSL color model](https://en.wikipedia.org/wiki/HSL_and_HSV) or to play with the interactive [Demo / Documentation](https://meodai.github.io/rampensau/).

The function returns an array of colors in HXX format (`[0…360,0…1,0…1]`). (HXX because you can use HSL, HSV, LCH, OKLCH et...) The first value is the hue, the second the saturation and the third the lightness. The hue is a value between 0 and 360, the saturation and lightness are values between 0 and 1. Typically you would convert the values to a polar color model like HSL, lCH or okLCh before using them. `hsl(${color[0]} ${color[1] * 100}% ${color[2]*100}%)` / `oklch(${color[2]*100}% ${color[1]*100}% color[0])` is a good choice for CSS. (See [colorToCSS](#colortocsscolor) helper function).

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

The `hStart` sets the starting point of the hue ramp. The `hStartCenter` sets where in the hue in the ramp the  should be centered. If your ramp starts with a high or low lightness, you might want to center the hue in the middle of the ramp. Thats is way the default value for `hStartCenter` is `0.5`. (In the center of a given ramp).

The `hStartCenter` option tells the function where the start hue should be in your ramp. A value of `0` will generate a ramp that starts with the hue at the beginning of the ramp. A value of `0.5` will generate a ramp that starts with the hue in the middle of the ramp. A value of `1` will generate a ramp that starts with the hue at the end of the ramp.

The `hCycles` option sets the number of hue cycles. A value of `1` will generate a ramp with a single hue cycle. A value of `0.5` will generate a ramp with 180° hue cycle (starting from hStart to its complementary hue). A value of `2` will rotate around the color wheel twice. A value of `-1` will generate a ramp with a reversed hue cycle. A value of `-0.5` will generate a ramp with a reversed 180° hue cycle. A value of `-2` will generate a ramp with a reversed 720° hue cycle.

The `hEasing` option sets the easing function for the hue. The function takes an input value `x` and returns a value between 0 and 1. The default value is `(x) => x` which will generate a linear ramp.

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
    minDistance: 90,
  })
})
```

The `uniqueRandomHues` function will generate a list of unique hues with a minimum distance of 90° between each hue. This list is then passed to the `hueList` option of `generateColorRamp`. `uniqueRandomHues` is also exported by RampenSau, so you can use it directly.

##### Saturation & Lightness

- `sRange` array [0…1,0…1]  → Saturation Range
- `lRange` array [0…1,0…1]  → Lightness Range

##### Easing Functions

Each of the color dimensions can be eased using a custom function.
The takes an input value `x` and returns a value between 0 and 1.:

- `hEasing` function(x)     → Hue easing function
- `sEasing` function(x)     → Saturation easing function
- `lEasing` function(x)     → Saturation easing function

## Hue Generation Functions

### uniqueRandomHues(Options{})

Function returns an array of unique random hues. Mostly useful for generating a list of hues to use with `hueList`. Alternatively you can use `(x) => Math.random()` as the `hEasing` function in `generateColorRamp` but this will not guarantee unique hues.

- `startHue` float 0…360        → Starting point of the hue ramp. 0 Red, 180 Teal etc..
- `total` int 3…∞               → Amount of base colors.
- `minHueDiffAngle` float 0…360 → Minimum angle between hues.
- `rndFn` function()            → Random function. Defaults to `Math.random`.

### colorHarmonies.colorHarmony(Options{})

Function returns an array of colors in HSL format (`[0…360,0…1,0…1]`).

- `colorHarmony` string → Color harmony to use. One of `complementary`, `analogous`, `triadic`, `tetradic`, `splitComplementary`, `square`, `rectangle`, `monochromatic`.
- `hStart` float 0…360 → Starting point of the hue ramp. 0 Red, 180 Teal etc..

Example:

```js
import {
  generateColorRamp,
  colorHarmonies,
} from "rampensau";

generateColorRamp({
  hueList: colorHarmonies.splitComplementary({
    hStart: Math.random() * 360,
  }),
  sRange: [0.4, 0.35],
  lRange: [Math.random() * 0.1, 0.9],
});
```

## Helper Function

### colorToCSS(color)

In order to use the colors generated by **RampenSau** in CSS or Canvas, you need to convert them to a CSS color format. This helper function does just that. It returns a CSS string from a color in color format generated from **generateColorRamp** (`[0…360,0…1,0…1]`) and scales the chroma value to the [adequate range](https://culorijs.org/color-spaces/) for the given color model.

- `color` array [0…360,0…1,0…1] → Color in color format generated from **generateColorRamp** (`[0…360,0…1,0…1]`).
- `mode` string → Color mode to use. One of `hsl`, `lch` or `oklch`. Defaults to `oklch`. (Note that `hsl` is clamped to the sRGB gamut, while `lch` and `oklch` will make use of the full gamut supported by the target monitor / device.)

**Example**:
  
  ```js
  import {
    generateColorRamp,
    colorToCSS,
  } from "rampensau";

  console.log( 
    generateColorRamp().map(color => colorToCSS(color, 'oklch')) 
  ); // ['oklch(0.0557 0.4 348.3975)', 'oklch(0.1459 0.3872 314.7438)', …]
  ```

## Using RampenSau with a color library

If you are already using a color library like [culori](https://culorijs.org/api/) you can use its
`formatCSS` function instead. Just don't forget to scale the chroma value to the [adequate range](https://culorijs.org/color-spaces/).

```js
culori.formatCss({ mode: 'oklch', {
  l: color[2],
  c: color[1] * 0.4,
  h: color[0],
})

culori.formatCss({ mode: 'lch', {
  l: color[2] * 100,
  c: color[1] * 150,
  h: color[0],
});
```

## License

Rampensau is distributed under the [MIT License](./LICENSE).
