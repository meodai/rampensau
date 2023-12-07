# Rampensau 🐷

Rampensau is a color palette generation function that utilizes hue cycling and 
easing functions to generate color ramps. 

The perfect tool for generating color palettes for data visualizations, visual design, generative art, or just for fun.


![generated Rampensau color palettes Animation](./rampensau.gif)

Check out a simple [demo](https://codepen.io/meodai/pen/yLvgxQK?editors=0010) or see it in action over on [farbvelo](https://farbvelo.elastiq.ch/).

## Installation

Rampensau is bundled as both UMD and ES on npm. Install it using your package manager of choice:

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
  hCenter : 0.5,                         // where in the ramp the hue should be centered
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

- `total` int 3…∞           → Amount of base colors.
- `hStart` float 0…360      → Starting point of the hue ramp. 0 Red, 180 Teal etc..
- `hCenter`: float 0…1      → Center the hue in the color ramp.
- `hCycles` float -∞…0…+∞   → Number of hue cycles. (.5 = 180°, 1 = 360°, 2 = 720°, etc.)
- `sRange` array [0…1,0…1]  → Saturation Range
- `lRange` array [0…1,0…1]  → Lightness Range

##### Hue Start & Center

The `hStart` sets the starting point of the hue ramp. The `hCenter` sets where in the hue in the ramp the  should be centered. If your ramp starts with a high or low lightness, you might want to center the hue in the middle of the ramp. Thats is way the default value for `hCenter` is `0.5`. (In the center of a given ramp).

##### Easing Functions

Each of the color dimensions can be eased using a custom function. 
The takes an input value `x` and returns a value between 0 and 1.:

- `hEasing` function(x)     → Hue easing function
- `sEasing` function(x)     → Saturation easing function
- `lEasing` function(x)     → Saturation easing function

## License

Rampensau is distributed under the MIT License.
