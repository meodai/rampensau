# RampenSau 🐷

**RampenSau** is a color palette generation function that utilizes **hue cycling** and
**easing functions** to generate color ramps. 

Perfect for generating color palettes for data visualizations, visual design, generative art, or just for fun. 

![generated Rampensau color palettes Animation](./rampensau.gif)

Check out a simple [demo](https://codepen.io/meodai/pen/yLvgxQK?editors=0010) or see it in action over on [farbvelo](https://farbvelo.elastiq.ch/).

## Installation

**Rampensau** is bundled as both UMD and ES on npm. Install it using your package manager of choice:

```js
npm install rampensau
```

You can then import rampensau into your project:

```js
// CJS style
let generateRandomColorRamp = require("rampensau");

// ES style: import individual methods
import { generateRandomColorRamp } from "rampensau";
```

Or include it directly in your HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/rampensau/dist/index.js"></script>
<!-- or -->
<script type="module">
  import { generateHSLRamp } from "https://cdn.jsdelivr.net/npm/rampensau/dist/index.mjs";
</script>
```

## Usage

```js
import { generateHSLRamp } from 'rampensau';

function generateHSLRamp  ({
  total   : 9,                           // number of colors in the ramp
  hStart  : Math.random() * 360,         // hue at the start of the ramp
  hCycles : 1,                           // number of full hue cycles 
                                         // (.5 = 180°, 1 = 360°, 2 = 720°, etc.)
  hStartCenter : 0.5,                    // where in the ramp the hue should be centered
  hEasing : (x, fr) => x,                // hue easing function

  sRange  : [0.4, 0.35],                 // saturation range
  sEasing : (x, fr) => Math.pow(x, 2),   // saturation easing function

  lRange  : [Math.random() * 0.1, 0.9],  // lightness range
  lEasing : (x, fr) => Math.pow(x, 1.5), // lightness easing function
});
```

### generateHSLRamp(Options{})

Function returns an array of colors in HSL format (`[0…360,0…1,0…1]`).
(But it can easily to any other cartesian color format)

#### Options

Either:

- `total` int 3…∞           → Amount of base colors.
- `hStart` float 0…360      → Starting point of the hue ramp. 0 Red, 180 Teal etc..
- `hStartCenter`: float 0…1      → Center the hue in the color ramp.
- `hCycles` float -∞…0…+∞   → Number of hue cycles. (.5 = 180°, 1 = 360°, 2 = 720°, etc.)

Or:

- `hueList` array [0…360]   → List of hues to use. All other hue options will be ignored.

- `sRange` array [0…1,0…1]  → Saturation Range
- `lRange` array [0…1,0…1]  → Lightness Range

##### Hue Start & Center

The `hStart` sets the starting point of the hue ramp. The `hStartCenter` sets where in the hue in the ramp the  should be centered. If your ramp starts with a high or low lightness, you might want to center the hue in the middle of the ramp. Thats is way the default value for `hStartCenter` is `0.5`. (In the center of a given ramp).

##### Hue List

If you want to use a specific list of hues, you can pass an array of hues to the `hueList` option. All other hue options will be ignored. For example, if you want to generate a ramp with 3 colors, but you want to use random unique hues, you can do this:

```js
import {
  generateHSLRamp,
  uniqueRandomHues,
} from "rampensau";

generateHSLRamp({
  hueList: uniqueRandomHues({
    startHue: Math.random() * 360, 
    total: 5, 
    minDistance: 90,
  })
})
```

##### Easing Functions

Each of the color dimensions can be eased using a custom function.
The takes an input value `x` and returns a value between 0 and 1.:

- `hEasing` function(x)     → Hue easing function
- `sEasing` function(x)     → Saturation easing function
- `lEasing` function(x)     → Saturation easing function

### uniqueRandomHues(Options{})

Function returns an array of unique random hues. Mostly useful for generating a list of hues to use with `hueList`. Alternatively you can use `(x) => Math.random()` as the `hEasing` function in `generateHSLRamp` but this will not guarantee unique hues.

- `startHue` float 0…360        → Starting point of the hue ramp. 0 Red, 180 Teal etc..
- `total` int 3…∞               → Amount of base colors.
- `minHueDiffAngle` float 0…360 → Minimum angle between hues.
- `rndFn` function()            → Random function. Defaults to `Math.random`.

### colorHarmonies[colorHarmony](Options{})

Function returns an array of colors in HSL format (`[0…360,0…1,0…1]`).

- `colorHarmony` string → Color harmony to use. One of `complementary`, `analogous`, `triadic`, `tetradic`, `splitComplementary`, `square`, `rectangle`, `monochromatic`.
- `hStart` float 0…360 → Starting point of the hue ramp. 0 Red, 180 Teal etc..

Example:

```js
import {
  generateHSLRamp,
  colorHarmonies,
} from "rampensau";

generateHSLRamp({
  hueList: colorHarmonies.splitComplementary({
    hStart: Math.random() * 360,
  }),
  sRange: [0.4, 0.35],
  lRange: [Math.random() * 0.1, 0.9],
});
```

## License

Rampensau is distributed under the MIT License.
