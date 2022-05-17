<h1><a href="https://meodai.github.io/fettepalette/"><img width="533" src="https://github.com/meodai/fettepalette/blob/main/fp.png" alt="fette palette" /></a></h1>

Color palette generation function using curves within the HSV color model.

Docs & Demo: https://meodai.github.io/fettepalette/

Based on the idea of "hue shifting". A technique used by [pixel-artists and illustrators](#reading-and-inspiration).

## Installation

FettePalette is bundled as both UMD and ES on npm. Install it using npm:

```js
npm install fettepalette
```

You can then import FettePalette into your project:

```js
// CJS style
let generateRandomColorRamp = require("fettepalette");

// ES style: import individual methods
import { generateRandomColorRamp } from "fettepalette";
```

## Usage

```js
import { generateRandomColorRamp } from 'fettepalette';

function generateRandomColorRamp  ({
  total:                10,    // total of base colors in the ramp

  centerHue:            180,   // at what hue should the generation start at

  hueCycle:             0.3,   // hsl spins how much should the hue change over
                               // the curve, 0: not at all, 1: one full rainbow

  offsetTint:           0.1,   // offset for the tints

  offsetShade:          0.1,   // offset of the shades

  curveMethod:         'arc',  // what method is used to draw the curve in the
                               // HSV color model, also takes a function 

  curveAccent:          0,     // how accentuated is the curve
                               // (depends heavely on curveMethod)

  tintShadeHueShift:    0.1,   // defines how shifted the hue is in
                               // for the shades and the tints

  offsetCurveModTint:  0.03,   // modifies the tint curve

  offsetCurveModShade: 0.03,   // modifies the shade curve

  minSaturationLight:  [0, 0], // defines the min saturation and light of all
                               // the colors

  maxSaturationLight:  [1, 1], // defines the max saturation and light of all
                               // the colors
  
  colorModel:          'hsl',  // defines the color model of the returned colors
                               // hsv and hsl are supported
});
```

### generateRandomColorRamp(Options{})

Function returns an ob object containing 4 arrays:

```js
{
    light: [], // tints
    dark: [], // shades
    base: [], // smedium colors
    all: [], // all colors
 }
```

Each array contains every color as an array of HSL coordinates `[h,s,l/b]` `[0…360,0…1,0…1]`

#### Options

- `total` int 3… → Amount of base colors.
- `centerHue` float 0…1 → 0 Red, 180 Teal etc..
- `hueCycle` float 0…1 → How much the color changes over the curve 0: not at all, 1: full rainbow
- `offsetTint` float 0…1 → Tint curve difference
- `offsetShade` float 0…1 → Shade curve difference
- `curveAccent` float 0…1 → How pronounced should the curve be, depends a lot on the curve method
- `tintShadeHueShift` float 0…1 → Shifts the colors for the shades and tints
- `curveMethod` string 'lamé'|'arc'|'pow'|'powY'|'powX' → method used to generate the curve. It also takes a function `(Number(0…1)) => [x,y]`
- `offsetCurveModTint` float 0…1 → amplifies the curveAccent of for the tint colors
- `offsetCurveModShade` float 0…1 → amplifies the curveAccent of for the shade colors
- `minSaturationLight` array [0…1, 0…1] → minium saturation and light of the generated colors
- `maxSaturationLight` array [0…1, 0…1] → maximum saturation and light of the generated colors
- `colorModel` string 'hsl'|'hsv' → defines the color model of the returned colors
hsv might be easier to convert into something else.

#### Saint Options

To makes it easy to integrate with your favourite settings pannel (dat.gui, tweakpane …), the script exports `generateRandomColorRampParams`, an onject that contains default and saint options to feed to the main function.

```js
{
  curveMethod: {
    default: 'lamé',
    props: { options: ['lamé', 'arc', 'pow', 'powY', 'powX'] },
  },
  curveAccent: {
    default: 0,
    props: { min: -0.095, max: 1, step: 0.001 },
  },
  total: {
    default: 9,
    props: { min: 3, max: 35, step: 1 },
  },
  centerHue: {
    default: 0,
    props: { min: 0, max: 360, step: 0.1 },
  },
  hueCycle: {
    default: 0.3,
    props: { min: -1.5, max: 1.5, step: 0.001 },
  },
  offsetTint: {
    default: 0.01,
    props: { min: 0, max: 0.4, step: 0.001 },
  },
  offsetShade: {
    default: 0.01,
    props: { min: 0, max: 0.4, step: 0.001 },
  },
  tintShadeHueShift: {
    default: 0.01,
    props: { min: 0, max: 1, step: 0.001 },
  },
  offsetCurveModTint: {
    default: 0.03,
    props: { min: 0, max: 0.4, step: 0.0001  },
  },
  offsetCurveModShade: {
    default: 0.03,
    props: { min: 0, max: 0.4, step: 0.0001  },
  },
  minSaturation: {
    default: 0,
    props: { min: 0, max: 1, step: 0.001  },
  },
  minLight: {
    default: 0,
    props: { min: 0, max: 1, step: 0.001  },
  },
  maxSaturation: {
    default: 1,
    props: { min: 0, max: 1, step: 0.001  },
  },
  maxLight: {
    default: 1,
    props: { min: 0, max: 1, step: 0.001  },
  },
}
```

Integration with [tweakpane](https://cocopon.github.io/tweakpane/)

```js
import { generateRandomColorRampParams } from "fettepalette";

const PARAMS = {};

Object.keys(generateRandomColorRampParams).forEach((key) => {
  const param = generateRandomColorRampParams[key];
  PARAMS[key] = param.default;
  pane.addInput(PARAMS, key, param.props);
});
```

## Reading and Inspiration

- Video: [Hue Shifting in Pixel Art](https://www.youtube.com/watch?v=PNtMAxYaGyg) by [Brandon James Greer](https://twitter.com/BJGpixel)
- Article: [How to make your own color palettes](https://medium.com/@greggunn/how-to-make-your-own-color-palettes-712959fbf021) by [Greg Gunn](https://www.ggunn.com/)
- Tweet: [Hue Shifting](https://twitter.com/ENDESGA/status/971690827482202112) by [ENDESGA](https://github.com/ENDESGA)
