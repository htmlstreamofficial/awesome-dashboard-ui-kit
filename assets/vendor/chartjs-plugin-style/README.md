# chartjs-plugin-style

[![npm](https://img.shields.io/npm/v/chartjs-plugin-style.svg?style=flat-square)](https://npmjs.com/package/chartjs-plugin-style) [![Bower](https://img.shields.io/bower/v/chartjs-plugin-style.svg?style=flat-square)](https://libraries.io/bower/chartjs-plugin-style) [![Travis](https://img.shields.io/travis/nagix/chartjs-plugin-style/master.svg?style=flat-square)](https://travis-ci.org/nagix/chartjs-plugin-style) [![Code Climate](https://img.shields.io/codeclimate/maintainability/nagix/chartjs-plugin-style.svg?style=flat-square)](https://codeclimate.com/github/nagix/chartjs-plugin-style)

*[Chart.js](https://www.chartjs.org) plugin for more styling options*

This plugin requires Chart.js 2.6.0 or later.

## Installation

You can download the latest version of chartjs-plugin-style from the [GitHub releases](https://github.com/nagix/chartjs-plugin-style/releases/latest).

To install via npm:

```bash
npm install chartjs-plugin-style --save
```

To install via bower:

```bash
bower install chartjs-plugin-style --save
```

To use CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-style@latest/dist/chartjs-plugin-style.min.js"></script>
```
```html
<script src="https://unpkg.com/chartjs-plugin-style@latest/dist/chartjs-plugin-style.min.js"></script>
```

## Usage

chartjs-plugin-style can be used with ES6 modules, plain JavaScript and module loaders.

chartjs-plugin-style requires [Chart.js](https://www.chartjs.org). Include Chart.js and chartjs-plugin-style.js to your page to enable style options.

Version 0.4 supports the bevel, drop shadow, inner glow, outer glow and overlay effects for datasets and the tooltip. More options are to be added in the upcoming releases.

### Usage in ES6 as module

Nothing else than importing the module should be enough.

```js
import 'chartjs-plugin-style';
```

## Tutorial and Samples

You can find a tutorial and samples at [nagix.github.io/chartjs-plugin-style](https://nagix.github.io/chartjs-plugin-style).

## Configuration

To configure this plugin, you can simply add the following properties to your datasets and tooltip. `point*` properties are used only in line, radar and scatter charts. `hover*` properties are not used in a tooptip.

### Shadow effect

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `shadowOffsetX` | `Number` | `0` | Indicates the horizontal distance the shadow should extend from the line. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowOffsetX).
| `shadowOffsetY` | `Number` | `0` | Indicates the vertical distance the shadow should extend from the line. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowOffsetY).
| `shadowBlur` | `Number` | `0` | Indicates the size of the blurring effect for the line; this value doesn't correspond to a number of pixels. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowBlur).
| `shadowColor` | `Color` | `'rgba(0, 0, 0, 0)'` | A standard CSS color value indicating the color of the shadow effect for the line. See [Colors](http://www.chartjs.org/docs/latest/general/colors.html#colors).
| `hoverShadowOffsetX` | `Number/Number[]` | `0` | The horizontal distance the shadow should extend from the element when hovered.
| `hoverShadowOffsetY` | `Number/Number[]` | `0` | The vertical distance the shadow should extend from the element when hovered.
| `hoverShadowBlur` | `Number/Number[]` | `0` | The size of the blurring effect when hovered.
| `hoverShadowColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The color of the shadow effect when hovered.
| `pointShadowOffsetX` | `Number/Number[]` | `0` | The horizontal distance the shadow should extend from the point.
| `pointShadowOffsetY` | `Number/Number[]` | `0` | The vertical distance the shadow should extend from the point.
| `pointShadowBlur` | `Number/Number[]` | `0` | The size of the blurring effect for the point.
| `pointShadowColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The color of the shadow effect for the point.
| `pointHoverShadowOffsetX` | `Number/Number[]` | `0` | The horizontal distance the shadow should extend from the point when hovered.
| `pointHoverShadowOffsetY` | `Number/Number[]` | `0` | The vertical distance the shadow should extend from the point when hovered.
| `pointHoverShadowBlur` | `Number/Number[]` | `0` | The size of the blurring effect for the point when hovered.
| `pointHoverShadowColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The color of the shadow effect for the point when hovered.

### Bevel effect

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `bevelWidth` | `Number/Number[]` | `0` | The width of the bevel effect.
| `bevelHighlightColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The highlight color of the bevel effect.
| `bevelShadowColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The shadow color of the bevel effect.
| `hoverBevelWidth` | `Number/Number[]` | `0` | The width of the bevel effect when hovered.
| `hoverBevelHighlightColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The highlight color of the bevel effect when hovered.
| `hoverBevelShadowColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The shadow color of the bevel effect when hovered.
| `pointBevelWidth` | `Number/Number[]` | `0` | The width of the bevel effect for the point.
| `pointBevelHighlightColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The highlight color of the bevel effect for the point.
| `pointBevelShadowColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The shadow color of the bevel effect for the point.
| `pointHoverBevelWidth` | `Number/Number[]` | `0` | The width of the bevel effect for the point when hovered.
| `pointHoverBevelHighlightColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The highlight color of the bevel effect for the point when hovered.
| `pointHoverBevelShadowColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The shadow color of the bevel effect for the point when hovered.

### Glow effects

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `innerGlowWidth` | `Number/Number[]` | `0` | The width of the inner glow effect.
| `innerGlowColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The color of the inner glow effect.
| `outerGlowWidth` | `Number/Number[]` | `0` | The width of the outer glow effect.
| `outerGlowColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The color of the outer glow effect.
| `hoverInnerGlowWidth` | `Number/Number[]` | `0` | The width of the inner glow effect when hovered.
| `hoverInnerGlowColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The color of the inner glow effect when hovered.
| `hoverOuterGlowWidth` | `Number/Number[]` | `0` | The width of the outer glow effect when hovered.
| `hoverOuterGlowColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The color of the outer glow effect when hovered.
| `pointInnerGlowWidth` | `Number/Number[]` | `0` | The width of the inner glow effect for the point.
| `pointInnerGlowColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The color of the inner glow effect for the point.
| `pointOuterGlowWidth` | `Number/Number[]` | `0` | The width of the outer glow effect for the point.
| `pointOuterGlowColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The color of the outer glow effect for the point.
| `pointHoverInnerGlowWidth` | `Number/Number[]` | `0` | The width of the inner glow effect for the point when hovered.
| `pointHoverInnerGlowColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The color of the inner glow effect for the point when hovered.
| `pointHoverOuterGlowWidth` | `Number/Number[]` | `0` | The width of the outer glow effect for the point when hovered.
| `pointHoverOuterGlowColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The color of the outer glow effect for the point when hovered.

### Overlay effect

Note that these properties are not used in a tooltip.

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `backgroundOverlayColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The background color overlaid on the element, which can be a standard CSS color value, a [CanvasPattern](https://developer.mozilla.org/en-US/docs/Web/API/CanvasPattern) or [CanvasGradient](https://developer.mozilla.org/en/docs/Web/API/CanvasGradient) object. See [Colors](http://www.chartjs.org/docs/latest/general/colors.html#colors).
| `backgroundOverlayMode` | `String/String[]` | `'source-over'` | Indicates the type of compositing operation to apply when overlaying a color. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation).
| `hoverBackgroundOverlayColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The background color overlaid on the element when hovered.
| `hoverBackgroundOverlayMode` | `String/String[]` | `'source-over'` | Indicates the type of compositing operation to apply when overlaying a color when hovered.
| `pointBackgroundOverlayColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The background color overlaid on the point.
| `pointBackgroundOverlayMode` | `String/String[]` | `'source-over'` | Indicates the type of compositing operation to apply when overlaying a color on the point.
| `pointHoverBackgroundOverlayColor` | `Color/Color[]` | `'rgba(0, 0, 0, 0)'` | The background color overlaid on the point when hovered.
| `pointHoverBackgroundOverlayMode` | `String/String[]` | `'source-over'` | Indicates the type of compositing operation to apply when overlaying a color on the point when hovered.

For example:

```js
{
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            data: [45, 20, 64, 32, 76, 51],
            shadowOffsetX: 3,
            shadowOffsetY: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            pointBevelWidth: 3,
            pointBevelHighlightColor: 'rgba(255, 255, 255, 0.75)',
            pointBevelShadowColor: 'rgba(0, 0, 0, 0.5)',
            pointShadowOffsetX: 3,
            pointShadowOffsetY: 3,
            pointShadowBlur: 10,
            pointShadowColor: 'rgba(0, 0, 0, 0.5)',
            pointHoverInnerGlowWidth: 20,
            pointHoverInnerGlowColor: 'rgba(255, 255, 0, 0.5)',
            pointHoverOuterGlowWidth: 20,
            pointHoverOuterGlowColor: 'rgba(255, 255, 0, 1)',
            backgroundOverlayColor: ctx.createPattern(img, 'repeat'),
            backgroundOverlayMode: 'multiply'
        }]
    },
    options: {
        tooltips: {
            bevelWidth: 3,
            bevelHighlightColor: 'rgba(255, 255, 255, 0.75)',
            bevelShadowColor: 'rgba(0, 0, 0, 0.5)'
            shadowOffsetX: 3,
            shadowOffsetY: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
    }
}
```

## Building

You first need to install node dependencies (requires [Node.js](https://nodejs.org/)):

```bash
npm install
```

The following commands will then be available from the repository root:

```bash
gulp build      # build dist files
gulp watch      # watch for changes and build automatically
gulp lint       # perform code linting
gulp package    # create an archive with dist files and samples
```

## License

chartjs-plugin-style is available under the [MIT license](https://opensource.org/licenses/MIT).
