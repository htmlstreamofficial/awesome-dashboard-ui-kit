/*
 * @license
 * chartjs-plugin-style
 * https://github.com/nagix/chartjs-plugin-style/
 * Version: 0.4.0
 *
 * Copyright 2019 Akihiko Kusanagi
 * Released under the MIT license
 * https://github.com/nagix/chartjs-plugin-style/blob/master/LICENSE.md
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('chart.js')) :
	typeof define === 'function' && define.amd ? define(['chart.js'], factory) :
	(factory(global.Chart));
}(this, (function (Chart) { 'use strict';

Chart = Chart && Chart.hasOwnProperty('default') ? Chart['default'] : Chart;

'use strict';

var helpers$2 = Chart.helpers;

var resolve = helpers$2.options.resolve;

var OFFSET = 1000000;

function isColorOption(key) {
	return key.indexOf('Color') !== -1;
}

var styleHelpers = {

	styleKeys: [
		'shadowOffsetX',
		'shadowOffsetY',
		'shadowBlur',
		'shadowColor',
		'bevelWidth',
		'bevelHighlightColor',
		'bevelShadowColor',
		'innerGlowWidth',
		'innerGlowColor',
		'outerGlowWidth',
		'outerGlowColor',
		'backgroundOverlayColor',
		'backgroundOverlayMode'
	],

	lineStyleKeys: [
		'shadowOffsetX',
		'shadowOffsetY',
		'shadowBlur',
		'shadowColor',
		'outerGlowWidth',
		'outerGlowColor'
	],

	pointStyleKeys: [
		'pointShadowOffsetX',
		'pointShadowOffsetY',
		'pointShadowBlur',
		'pointShadowColor',
		'pointBevelWidth',
		'pointBevelHighlightColor',
		'pointBevelShadowColor',
		'pointInnerGlowWidth',
		'pointInnerGlowColor',
		'pointOuterGlowWidth',
		'pointOuterGlowColor',
		'pointBackgroundOverlayColor',
		'pointBackgroundOverlayMode'
	],

	hoverStyleKeys: [
		'hoverShadowOffsetX',
		'hoverShadowOffsetY',
		'hoverShadowBlur',
		'hoverShadowColor',
		'hoverBevelWidth',
		'hoverBevelHighlightColor',
		'hoverBevelShadowColor',
		'hoverInnerGlowWidth',
		'hoverInnerGlowColor',
		'hoverOuterGlowWidth',
		'hoverOuterGlowColor',
		'hoverBackgroundOverlayColor',
		'hoverBackgroundOverlayMode'
	],

	pointHoverStyleKeys: [
		'pointHoverShadowOffsetX',
		'pointHoverShadowOffsetY',
		'pointHoverShadowBlur',
		'pointHoverShadowColor',
		'pointHoverBevelWidth',
		'pointHoverBevelHighlightColor',
		'pointHoverBevelShadowColor',
		'pointHoverInnerGlowWidth',
		'pointHoverInnerGlowColor',
		'pointHoverOuterGlowWidth',
		'pointHoverOuterGlowColor',
		'pointHoverBackgroundOverlayColor',
		'pointHoverBackgroundOverlayMode'
	],

	drawBackground: function(view, drawCallback) {
		var borderWidth = view.borderWidth;

		view.borderWidth = 0;
		drawCallback();
		view.borderWidth = borderWidth;
	},

	drawBorder: function(view, drawCallback) {
		var backgroundColor = view.backgroundColor;

		if (view.borderWidth) {
			view.backgroundColor = 'rgba(0, 0, 0, 0)';
			drawCallback();
			view.backgroundColor = backgroundColor;
		}
	},

	drawShadow: function(chart, offsetX, offsetY, blur, color, drawCallback, backmost) {
		var ctx = chart.ctx;
		var pixelRatio = chart.currentDevicePixelRatio;

		ctx.save();

		ctx.shadowOffsetX = (offsetX + OFFSET) * pixelRatio;
		ctx.shadowOffsetY = offsetY * pixelRatio;
		ctx.shadowBlur = blur * pixelRatio;
		ctx.shadowColor = color;
		if (backmost) {
			ctx.globalCompositeOperation = 'destination-over';
		}
		ctx.translate(-OFFSET, 0);

		drawCallback();

		ctx.restore();
	},

	setPath: function(ctx, drawCallback) {
		ctx.save();
		ctx.beginPath();
		ctx.clip();
		drawCallback();
		ctx.restore();
	},

	drawBevel: function(chart, width, highlightColor, shadowColor, drawCallback) {
		var ctx = chart.ctx;
		var pixelRatio = chart.currentDevicePixelRatio;
		var shadowOffset = (width * pixelRatio) * 5 / 6;

		if (!width) {
			return;
		}

		ctx.save();
		ctx.clip();

		// Make stencil
		ctx.translate(-OFFSET, 0);
		this.setPath(ctx, drawCallback);
		ctx.rect(0, 0, chart.width, chart.height);

		// Draw bevel shadow
		ctx.fillStyle = 'black';
		ctx.shadowOffsetX = OFFSET * pixelRatio - shadowOffset;
		ctx.shadowOffsetY = -shadowOffset;
		ctx.shadowBlur = shadowOffset;
		ctx.shadowColor = shadowColor;
		// Workaround for the issue on Windows version of FireFox
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1333090
		// If the destination has transparency, the result will be different
		if (!(navigator && navigator.userAgent.match('Windows.+Firefox'))) {
			ctx.globalCompositeOperation = 'source-atop';
		}
		ctx.fill('evenodd');

		// Draw Bevel highlight
		ctx.shadowOffsetX = OFFSET * pixelRatio + shadowOffset;
		ctx.shadowOffsetY = shadowOffset;
		ctx.shadowColor = highlightColor;
		ctx.fill('evenodd');

		ctx.restore();
	},

	drawGlow: function(chart, width, color, borderWidth, drawCallback, isOuter) {
		var ctx = chart.ctx;
		var pixelRatio = chart.currentDevicePixelRatio;

		if (!width) {
			return;
		}

		ctx.save();

		// Clip inner or outer area
		this.setPath(ctx, drawCallback);
		if (isOuter) {
			ctx.rect(0, 0, chart.width, chart.height);
		}
		ctx.clip('evenodd');

		// Set path
		ctx.translate(-OFFSET, 0);
		this.setPath(ctx, drawCallback);
		if (!isOuter) {
			ctx.rect(0, 0, chart.width, chart.height);
		}

		// Draw glow
		ctx.lineWidth = borderWidth;
		ctx.strokeStyle = 'black';
		ctx.fillStyle = 'black';
		ctx.shadowOffsetX = OFFSET * pixelRatio;
		ctx.shadowBlur = width * pixelRatio;
		ctx.shadowColor = color;
		ctx.fill('evenodd');
		if (borderWidth) {
			ctx.stroke();
		}

		ctx.restore();
	},

	drawInnerGlow: function(chart, width, color, borderWidth, drawCallback) {
		this.drawGlow(chart, width, color, borderWidth, drawCallback);
	},

	drawOuterGlow: function(chart, width, color, borderWidth, drawCallback) {
		this.drawGlow(chart, width, color, borderWidth, drawCallback, true);
	},

	drawBackgroundOverlay: function(chart, color, mode, drawCallback) {
		var ctx = chart.ctx;

		if (!color) {
			return;
		}

		ctx.save();
		this.setPath(ctx, drawCallback);
		ctx.fillStyle = color;
		ctx.globalCompositeOperation = mode;
		ctx.fill();
		ctx.restore();
	},

	opaque: function(color) {
		return helpers$2.color(color).alpha() > 0;
	},

	getHoverColor: function(color) {
		return color !== undefined ? helpers$2.getHoverColor(color) : color;
	},

	mergeStyle: function(target, source) {
		this.styleKeys.forEach(function(key) {
			target[key] = source[key];
		});
		return target;
	},

	saveStyle: function(element) {
		var model = element._model;
		var previousStyle = element.$previousStyle;

		if (previousStyle) {
			this.mergeStyle(previousStyle, model);
		}
	},

	resolveStyle: function(chart, element, index, options, hover) {
		var dataset = chart.data.datasets[element._datasetIndex];
		var custom = element.custom || {};
		var keys = this.styleKeys;
		var hoverableKeys = hover ? this.hoverStyleKeys : keys;
		var values = {};
		var i, ilen, key, hoverableKey, optionValue;

		for (i = 0, ilen = keys.length; i < ilen; ++i) {
			key = keys[i];
			hoverableKey = hoverableKeys[i];
			optionValue = options[key];
			values[key] = resolve([
				custom[hoverableKey],
				dataset[hoverableKey],
				hover && isColorOption(key) ? this.getHoverColor(optionValue) : optionValue
			], undefined, index);
		}

		return values;
	},

	resolveLineStyle: function(custom, dataset, options) {
		var keys = this.lineStyleKeys;
		var values = {};
		var i, ilen, key;

		for (i = 0, ilen = keys.length; i < ilen; ++i) {
			key = keys[i];
			values[key] = resolve([custom[key], dataset[key], options[key]]);
		}

		return values;
	},

	resolvePointStyle: function(chart, element, index, options, hover) {
		var dataset = chart.data.datasets[element._datasetIndex];
		var custom = element.custom || {};
		var keys = this.styleKeys;
		var customKeys = hover ? this.hoverStyleKeys : keys;
		var pointKeys = hover ? this.pointHoverStyleKeys : this.pointStyleKeys;
		var values = {};
		var i, ilen, key, optionValue;

		for (i = 0, ilen = keys.length; i < ilen; ++i) {
			key = keys[i];
			optionValue = options[key];
			values[key] = resolve([
				custom[customKeys[i]],
				dataset[pointKeys[i]],
				!hover ? dataset[key] : isColorOption(key) ? this.getHoverColor(optionValue) : optionValue,
				optionValue
			], undefined, index);
		}

		return values;
	}
};

'use strict';

var helpers$1 = Chart.helpers;

/**
 * Ported from Chart.js 2.7.3.
 *
 * Helper method to merge the opacity into a color
 * For Chart.js 2.7.3 backward compatibility
 */
function mergeOpacity(colorString, opacity) {
	// opacity is not used in Chart.js 2.8 or later
	if (opacity === undefined) {
		return colorString;
	}
	var color = helpers$1.color(colorString);
	return color.alpha(opacity * color.alpha()).rgbaString();
}

var Tooltip = Chart.Tooltip;

var StyleTooltip = Tooltip.extend({

	initialize: function() {
		Tooltip.prototype.initialize.apply(this, arguments);

		var model = this._model;
		var tooltipOpts = this._options;

		model.shadowOffsetX = tooltipOpts.shadowOffsetX;
		model.shadowOffsetY = tooltipOpts.shadowOffsetY;
		model.shadowBlur = tooltipOpts.shadowBlur;
		model.shadowColor = tooltipOpts.shadowColor;
		model.bevelWidth = tooltipOpts.bevelWidth;
		model.bevelHighlightColor = tooltipOpts.bevelHighlightColor;
		model.bevelShadowColor = tooltipOpts.bevelShadowColor;
		model.innerGlowWidth = tooltipOpts.innerGlowWidth;
		model.innerGlowColor = tooltipOpts.innerGlowColor;
		model.outerGlowWidth = tooltipOpts.outerGlowWidth;
		model.outerGlowColor = tooltipOpts.outerGlowColor;
	},

	update: function() {
		Tooltip.prototype.update.apply(this, arguments);

		var me = this;
		var model = me._model;
		var opts = me._options;

		model.shadowOffsetX = opts.shadowOffsetX;
		model.shadowOffsetY = opts.shadowOffsetY;
		model.shadowBlur = opts.shadowBlur;
		model.shadowColor = opts.shadowColor;
		model.bevelWidth = opts.bevelWidth;
		model.bevelHighlightColor = opts.bevelHighlightColor;
		model.bevelShadowColor = opts.bevelShadowColor;
		model.innerGlowWidth = opts.innerGlowWidth;
		model.innerGlowColor = opts.innerGlowColor;
		model.outerGlowWidth = opts.outerGlowWidth;
		model.outerGlowColor = opts.outerGlowColor;

		return me;
	},

	drawBackground: function(pt, vm, ctx, tooltipSize, opacity) {
		var me = this;
		var args = arguments;
		var chart = me._chart;
		var bevelExtra = styleHelpers.opaque(vm.borderColor) && vm.borderWidth > 0 ? vm.borderWidth / 2 : 0;

		var drawCallback = function() {
			Tooltip.prototype.drawBackground.apply(me, args);
		};

		styleHelpers.drawShadow(chart, vm.shadowOffsetX, vm.shadowOffsetY,
			vm.shadowBlur, vm.shadowColor, drawCallback);

		if (styleHelpers.opaque(vm.backgroundColor)) {
			styleHelpers.drawBackground(vm, drawCallback);
			styleHelpers.drawBevel(chart, vm.bevelWidth + bevelExtra,
				mergeOpacity(vm.bevelHighlightColor, opacity),
				mergeOpacity(vm.bevelShadowColor, opacity), drawCallback);
		}

		styleHelpers.drawInnerGlow(chart, vm.innerGlowWidth,
			mergeOpacity(vm.innerGlowColor, opacity), vm.borderWidth, drawCallback);
		styleHelpers.drawOuterGlow(chart, vm.outerGlowWidth,
			mergeOpacity(vm.outerGlowColor, opacity), vm.borderWidth, drawCallback);

		styleHelpers.drawBorder(vm, drawCallback);
	}
});

'use strict';

var helpers = Chart.helpers;

helpers.extend(Chart.prototype, {

	// Ported from Chart.js 2.7.3. Modified for style tooltip.
	initToolTip: function() {
		var me = this;
		me.tooltip = new StyleTooltip({
			_chart: me,
			_chartInstance: me, // deprecated, backward compatibility
			_data: me.data,
			_options: me.options.tooltips
		}, me);
	}
});

// For Chart.js 2.6.0 backward compatibility
helpers.valueOrDefault = helpers.valueOrDefault || helpers.getValueOrDefault;
helpers.valueAtIndexOrDefault = helpers.valueAtIndexOrDefault || helpers.getValueAtIndexOrDefault;
helpers.mergeIf = helpers.mergeIf || function(target, source) {
	return helpers.configMerge.call(this, source, target);
};
helpers.options = helpers.options || {};
helpers.options.resolve = helpers.options.resolve || function(inputs, context, index) {
	var i, ilen, value;

	for (i = 0, ilen = inputs.length; i < ilen; ++i) {
		value = inputs[i];
		if (value === undefined) {
			continue;
		}
		if (context !== undefined && typeof value === 'function') {
			value = value(context);
		}
		if (index !== undefined && helpers.isArray(value)) {
			value = value[index];
		}
		if (value !== undefined) {
			return value;
		}
	}
};

// For Chart.js 2.7.1 backward compatibility
Chart.layouts = Chart.layouts || Chart.layoutService;

'use strict';

var Arc = Chart.elements.Arc;

var StyleArc = Arc.extend({

	draw: function() {
		var me = this;
		var args = arguments;
		var chart = me._chart;
		var vm = me._view;
		var bevelExtra = styleHelpers.opaque(vm.borderColor) && vm.borderWidth > 0 ? vm.borderWidth / 2 : 0;

		var drawCallback = function() {
			Arc.prototype.draw.apply(me, args);
		};

		styleHelpers.drawShadow(chart, vm.shadowOffsetX, vm.shadowOffsetY,
			vm.shadowBlur, vm.shadowColor, drawCallback, true);

		if (styleHelpers.opaque(vm.backgroundColor)) {
			styleHelpers.drawBackground(vm, drawCallback);
			styleHelpers.drawBackgroundOverlay(chart, vm.backgroundOverlayColor,
				vm.backgroundOverlayMode, drawCallback);
			styleHelpers.drawBevel(chart, vm.bevelWidth + bevelExtra,
				vm.bevelHighlightColor, vm.bevelShadowColor, drawCallback);
		}

		styleHelpers.drawInnerGlow(chart, vm.innerGlowWidth, vm.innerGlowColor,
			vm.borderWidth, drawCallback);
		styleHelpers.drawOuterGlow(chart, vm.outerGlowWidth, vm.outerGlowColor,
			vm.borderWidth, drawCallback);

		styleHelpers.drawBorder(vm, drawCallback);
	}
});

'use strict';

var Line = Chart.elements.Line;

var StyleLine = Line.extend({

	draw: function() {
		var me = this;
		var args = arguments;
		var chart = me._chart;
		var vm = me._view;

		var drawCallback = function() {
			Line.prototype.draw.apply(me, args);
		};

		styleHelpers.drawShadow(chart, vm.shadowOffsetX, vm.shadowOffsetY,
			vm.shadowBlur, vm.shadowColor, drawCallback);

		// For outer glow
		styleHelpers.drawShadow(chart, 0, 0,
			vm.outerGlowWidth, vm.outerGlowColor, drawCallback);

		styleHelpers.drawBorder(vm, drawCallback);
	}
});

'use strict';

var Point = Chart.elements.Point;

var StylePoint = Point.extend({

	draw: function() {
		var me = this;
		var args = arguments;
		var chart = me._chart;
		var vm = me._view;
		var bevelExtra = styleHelpers.opaque(vm.borderColor) && vm.borderWidth > 0 ? vm.borderWidth / 2 : 0;

		var drawCallback = function() {
			Point.prototype.draw.apply(me, args);
		};

		styleHelpers.drawShadow(chart, vm.shadowOffsetX, vm.shadowOffsetY,
			vm.shadowBlur, vm.shadowColor, drawCallback, true);

		if (styleHelpers.opaque(vm.backgroundColor)) {
			styleHelpers.drawBackground(vm, drawCallback);
			styleHelpers.drawBackgroundOverlay(chart, vm.backgroundOverlayColor,
				vm.backgroundOverlayMode, drawCallback);
			styleHelpers.drawBevel(chart, vm.bevelWidth + bevelExtra,
				vm.bevelHighlightColor, vm.bevelShadowColor, drawCallback);
		}

		styleHelpers.drawInnerGlow(chart, vm.innerGlowWidth, vm.innerGlowColor,
			vm.borderWidth, drawCallback);
		styleHelpers.drawOuterGlow(chart, vm.outerGlowWidth, vm.outerGlowColor,
			vm.borderWidth, drawCallback);

		styleHelpers.drawBorder(vm, drawCallback);
	}
});

'use strict';

var Rectangle = Chart.elements.Rectangle;

var StyleRectangle = Rectangle.extend({

	draw: function() {
		var me = this;
		var args = arguments;
		var chart = me._chart;
		var vm = me._view;
		var bevelExtra = styleHelpers.opaque(vm.borderColor) && vm.borderWidth > 0 ? vm.borderWidth / 2 : 0;

		var drawCallback = function() {
			Rectangle.prototype.draw.apply(me, args);
		};

		styleHelpers.drawShadow(chart, vm.shadowOffsetX, vm.shadowOffsetY,
			vm.shadowBlur, vm.shadowColor, drawCallback, true);

		if (styleHelpers.opaque(vm.backgroundColor)) {
			styleHelpers.drawBackground(vm, drawCallback);
			styleHelpers.drawBackgroundOverlay(chart, vm.backgroundOverlayColor,
				vm.backgroundOverlayMode, drawCallback);
			styleHelpers.drawBevel(chart, vm.bevelWidth + bevelExtra,
				vm.bevelHighlightColor, vm.bevelShadowColor, drawCallback);
		}

		styleHelpers.drawInnerGlow(chart, vm.innerGlowWidth, vm.innerGlowColor,
			vm.borderWidth, drawCallback);
		styleHelpers.drawOuterGlow(chart, vm.outerGlowWidth, vm.outerGlowColor,
			vm.borderWidth, drawCallback);

		styleHelpers.drawBorder(vm, drawCallback);
	}
});

'use strict';

var helpers$3 = Chart.helpers;

var resolve$1 = helpers$3.options.resolve;

var BarController = Chart.controllers.bar;

var StyleBarController = BarController.extend({

	dataElementType: StyleRectangle,

	// Ported from Chart.js 2.7.3. Modified for style bar.
	updateElement: function(rectangle, index, reset) {
		var me = this;
		var chart = me.chart;
		var meta = me.getMeta();
		var dataset = me.getDataset();
		var custom = rectangle.custom || {};
		var rectangleOptions = chart.options.elements.rectangle;

		rectangle._xScale = me.getScaleForId(meta.xAxisID);
		rectangle._yScale = me.getScaleForId(meta.yAxisID);
		rectangle._datasetIndex = me.index;
		rectangle._index = index;

		rectangle._model = {
			datasetLabel: dataset.label,
			label: chart.data.labels[index],
			borderSkipped: helpers$3.valueOrDefault(custom.borderSkipped, rectangleOptions.borderSkipped),
			backgroundColor: resolve$1([custom.backgroundColor, dataset.backgroundColor, rectangleOptions.backgroundColor], undefined, index),
			borderColor: resolve$1([custom.borderColor, dataset.borderColor, rectangleOptions.borderColor], undefined, index),
			borderWidth: resolve$1([custom.borderWidth, dataset.borderWidth, rectangleOptions.borderWidth], undefined, index),
		};

		helpers$3.merge(rectangle._model, styleHelpers.resolveStyle(chart, rectangle, index, rectangleOptions));

		me.updateElementGeometry(rectangle, index, reset);

		rectangle.pivot();
	},

	setHoverStyle: function(element) {
		var me = this;
		var model = element._model;

		BarController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		helpers$3.merge(model, styleHelpers.resolveStyle(me.chart, element, element._index, model, true));
	},

	removeHoverStyle: function(element) {
		var me = this;

		if (!element.$previousStyle) {
			helpers$3.merge(element._model, styleHelpers.resolveStyle(me.chart, element, element._index, me.chart.options.elements.rectangle));
		}

		BarController.prototype.removeHoverStyle.apply(me, arguments);
	}
});

'use strict';

var helpers$4 = Chart.helpers;

var valueOrDefault = helpers$4.valueOrDefault;
var getHoverColor = styleHelpers.getHoverColor;

var BubbleController = Chart.controllers.bubble;

var StyleBubbleController = BubbleController.extend({

	dataElementType: StylePoint,

	/**
	 * Ported from Chart.js 2.7.3. Modified for style bubble.
	 * @protected
	 */
	updateElement: function(point, index, reset) {
		var me = this;
		var meta = me.getMeta();
		var custom = point.custom || {};
		var xScale = me.getScaleForId(meta.xAxisID);
		var yScale = me.getScaleForId(meta.yAxisID);
		var options = me._resolveElementOptions(point, index);
		var data = me.getDataset().data[index];
		var dsIndex = me.index;

		var x = reset ? xScale.getPixelForDecimal(0.5) : xScale.getPixelForValue(typeof data === 'object' ? data : NaN, index, dsIndex);
		var y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(data, index, dsIndex);

		point._xScale = xScale;
		point._yScale = yScale;
		point._options = options;
		point._datasetIndex = dsIndex;
		point._index = index;
		point._model = {
			backgroundColor: options.backgroundColor,
			borderColor: options.borderColor,
			borderWidth: options.borderWidth,
			hitRadius: options.hitRadius,
			pointStyle: options.pointStyle,
			rotation: options.rotation,
			radius: reset ? 0 : options.radius,
			skip: custom.skip || isNaN(x) || isNaN(y),
			x: x,
			y: y,
		};

		styleHelpers.mergeStyle(point._model, options);

		point.pivot();
	},

	/**
	 * @protected
	 */
	setHoverStyle: function(element) {
		BubbleController.prototype.setHoverStyle.apply(this, arguments);

		var model = element._model;
		var options = element._options;

		styleHelpers.saveStyle(element);

		model.shadowOffsetX = valueOrDefault(options.hoverShadowOffsetX, options.shadowOffsetX);
		model.shadowOffsetY = valueOrDefault(options.hoverShadowOffsetY, options.shadowOffsetY);
		model.shadowBlur = valueOrDefault(options.hoverShadowBlur, options.shadowBlur);
		model.shadowColor = valueOrDefault(options.hoverShadowColor, getHoverColor(options.shadowColor));
		model.bevelWidth = valueOrDefault(options.hoverBevelWidth, options.bevelWidth);
		model.bevelHighlightColor = valueOrDefault(options.hoverBevelHighlightColor, getHoverColor(options.bevelHighlightColor));
		model.bevelShadowColor = valueOrDefault(options.hoverBevelShadowColor, getHoverColor(options.bevelShadowColor));
		model.innerGlowWidth = valueOrDefault(options.hoverInnerGlowWidth, options.innerGlowWidth);
		model.innerGlowColor = valueOrDefault(options.hoverInnerGlowColor, getHoverColor(options.innerGlowColor));
		model.outerGlowWidth = valueOrDefault(options.hoverOuterGlowWidth, options.outerGlowWidth);
		model.outerGlowColor = valueOrDefault(options.hoverOuterGlowColor, getHoverColor(options.outerGlowColor));
		model.backgroundOverlayColor = valueOrDefault(options.hoverBackgroundOverlayColor, getHoverColor(options.backgroundOverlayColor));
		model.backgroundOverlayMode = valueOrDefault(options.hoverBackgroundOverlayMode, options.backgroundOverlayMode);
	},

	/**
	 * @protected
	 */
	removeHoverStyle: function(element) {
		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			styleHelpers.mergeStyle(element._model, element._options);
		}

		BubbleController.prototype.removeHoverStyle.apply(this, arguments);
	},

	/**
	 * Ported from Chart.js 2.7.3. Modified for style bubble.
	 * @private
	 */
	_resolveElementOptions: function(point, index) {
		var me = this;
		var chart = me.chart;
		var datasets = chart.data.datasets;
		var dataset = datasets[me.index];
		var custom = point.custom || {};
		var options = chart.options.elements.point;
		var resolve = helpers$4.options.resolve;
		var data = dataset.data[index];
		var values = {};
		var i, ilen, key;

		// Scriptable options
		var context = {
			chart: chart,
			dataIndex: index,
			dataset: dataset,
			datasetIndex: me.index
		};

		var keys = [
			'backgroundColor',
			'borderColor',
			'borderWidth',
			'hoverBackgroundColor',
			'hoverBorderColor',
			'hoverBorderWidth',
			'hoverRadius',
			'hitRadius',
			'pointStyle',
			'rotation',
			'shadowOffsetX',
			'shadowOffsetY',
			'shadowBlur',
			'shadowColor',
			'hoverShadowOffsetX',
			'hoverShadowOffsetY',
			'hoverShadowBlur',
			'hoverShadowColor',
			'bevelWidth',
			'bevelHighlightColor',
			'bevelShadowColor',
			'hoverBevelWidth',
			'hoverBevelHighlightColor',
			'hoverBevelShadowColor',
			'innerGlowWidth',
			'innerGlowColor',
			'outerGlowWidth',
			'outerGlowColor',
			'hoverInnerGlowWidth',
			'hoverInnerGlowColor',
			'hoverOuterGlowWidth',
			'hoverOuterGlowColor',
			'backgroundOverlayColor',
			'backgroundOverlayMode',
			'hoverBackgroundOverlayColor',
			'hoverBackgroundOverlayMode'
		];

		for (i = 0, ilen = keys.length; i < ilen; ++i) {
			key = keys[i];
			values[key] = resolve([
				custom[key],
				dataset[key],
				options[key]
			], context, index);
		}

		// Custom radius resolution
		values.radius = resolve([
			custom.radius,
			data ? data.r : undefined,
			dataset.radius,
			options.radius
		], context, index);
		return values;
	}
});

'use strict';

var defaults = Chart.defaults;
var helpers$5 = Chart.helpers;

var resolve$2 = helpers$5.options.resolve;

// Ported from Chart.js 2.7.3. Modified for style doughnut.
defaults.doughnut.legend.labels.generateLabels = defaults.pie.legend.labels.generateLabels = function(chart) {
	var data = chart.data;
	if (data.labels.length && data.datasets.length) {
		return data.labels.map(function(label, i) {
			var meta = chart.getDatasetMeta(0);
			var ds = data.datasets[0];
			var arc = meta.data[i];
			var custom = arc && arc.custom || {};
			var arcOpts = chart.options.elements.arc;
			var fill = resolve$2([custom.backgroundColor, ds.backgroundColor, arcOpts.backgroundColor], undefined, i);
			var stroke = resolve$2([custom.borderColor, ds.borderColor, arcOpts.borderColor], undefined, i);
			var bw = resolve$2([custom.borderWidth, ds.borderWidth, arcOpts.borderWidth], undefined, i);

			return helpers$5.merge({
				text: label,
				fillStyle: fill,
				strokeStyle: stroke,
				lineWidth: bw,
				hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

				// Extra data used for toggling the correct item
				index: i
			}, styleHelpers.resolveStyle(chart, arc, i, arcOpts));
		});
	}
	return [];
};

var DoughnutController = Chart.controllers.doughnut;

var StyleDoughnutController = DoughnutController.extend({

	dataElementType: StyleArc,

	// Ported from Chart.js 2.7.3. Modified for style doughnut.
	updateElement: function(arc, index, reset) {
		var me = this;
		var chart = me.chart;
		var chartArea = chart.chartArea;
		var opts = chart.options;
		var animationOpts = opts.animation;
		var centerX = (chartArea.left + chartArea.right) / 2;
		var centerY = (chartArea.top + chartArea.bottom) / 2;
		var startAngle = opts.rotation; // non reset case handled later
		var endAngle = opts.rotation; // non reset case handled later
		var dataset = me.getDataset();
		var circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : me.calculateCircumference(dataset.data[index]) * (opts.circumference / (2.0 * Math.PI));
		var innerRadius = reset && animationOpts.animateScale ? 0 : me.innerRadius;
		var outerRadius = reset && animationOpts.animateScale ? 0 : me.outerRadius;

		helpers$5.extend(arc, {
			// Utility
			_datasetIndex: me.index,
			_index: index,

			// Desired view properties
			_model: {
				x: centerX + chart.offsetX,
				y: centerY + chart.offsetY,
				startAngle: startAngle,
				endAngle: endAngle,
				circumference: circumference,
				outerRadius: outerRadius,
				innerRadius: innerRadius,
				label: helpers$5.valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
			}
		});

		var model = arc._model;

		// Resets the visual styles
		var custom = arc.custom || {};
		var elementOpts = opts.elements.arc;
		model.backgroundColor = resolve$2([custom.backgroundColor, dataset.backgroundColor, elementOpts.backgroundColor], undefined, index);
		model.borderColor = resolve$2([custom.borderColor, dataset.borderColor, elementOpts.borderColor], undefined, index);
		model.borderWidth = resolve$2([custom.borderWidth, dataset.borderWidth, elementOpts.borderWidth], undefined, index);

		helpers$5.merge(model, styleHelpers.resolveStyle(chart, arc, index, elementOpts));

		// Set correct angles if not resetting
		if (!reset || !animationOpts.animateRotate) {
			if (index === 0) {
				model.startAngle = opts.rotation;
			} else {
				model.startAngle = me.getMeta().data[index - 1]._model.endAngle;
			}

			model.endAngle = model.startAngle + model.circumference;
		}

		arc.pivot();
	},

	setHoverStyle: function(element) {
		var me = this;
		var model = element._model;

		DoughnutController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		helpers$5.merge(model, styleHelpers.resolveStyle(me.chart, element, element._index, model, true));
	},

	removeHoverStyle: function(element) {
		var me = this;

		if (!element.$previousStyle) {
			helpers$5.merge(element._model, styleHelpers.resolveStyle(me.chart, element, element._index, me.chart.options.elements.arc));
		}

		DoughnutController.prototype.removeHoverStyle.apply(me, arguments);
	}
});

'use strict';

var StyleHorizontalBarController = StyleBarController.extend({
	/**
	 * @private
	 */
	getValueScaleId: function() {
		return this.getMeta().xAxisID;
	},

	/**
	 * @private
	 */
	getIndexScaleId: function() {
		return this.getMeta().yAxisID;
	}
});

'use strict';

var helpers$6 = Chart.helpers;

var valueOrDefault$1 = helpers$6.valueOrDefault;
var resolve$3 = helpers$6.options.resolve;

var LineController = Chart.controllers.line;

// Ported from Chart.js 2.7.3.
function lineEnabled(dataset, options) {
	return valueOrDefault$1(dataset.showLine, options.showLines);
}

var StyleLineController = LineController.extend({

	datasetElementType: StyleLine,

	dataElementType: StylePoint,

	// Ported from Chart.js 2.7.3. Modified for style line.
	update: function(reset) {
		var me = this;
		var meta = me.getMeta();
		var line = meta.dataset;
		var points = meta.data || [];
		var options = me.chart.options;
		var lineElementOptions = options.elements.line;
		var scale = me.getScaleForId(meta.yAxisID);
		var i, ilen, custom;
		var dataset = me.getDataset();
		var showLine = lineEnabled(dataset, options);

		// Update Line
		if (showLine) {
			custom = line.custom || {};

			// Compatibility: If the properties are defined with only the old name, use those values
			if ((dataset.tension !== undefined) && (dataset.lineTension === undefined)) {
				dataset.lineTension = dataset.tension;
			}

			// Utility
			line._scale = scale;
			line._datasetIndex = me.index;
			// Data
			line._children = points;
			// Model
			line._model = {
				// Appearance
				// The default behavior of lines is to break at null values, according
				// to https://github.com/chartjs/Chart.js/issues/2435#issuecomment-216718158
				// This option gives lines the ability to span gaps
				spanGaps: valueOrDefault$1(dataset.spanGaps, options.spanGaps),
				tension: resolve$3([custom.tension, dataset.lineTension, lineElementOptions.tension]),
				backgroundColor: resolve$3([custom.backgroundColor, dataset.backgroundColor, lineElementOptions.backgroundColor]),
				borderWidth: resolve$3([custom.borderWidth, dataset.borderWidth, lineElementOptions.borderWidth]),
				borderColor: resolve$3([custom.borderColor, dataset.borderColor, lineElementOptions.borderColor]),
				borderCapStyle: resolve$3([custom.borderCapStyle, dataset.borderCapStyle, lineElementOptions.borderCapStyle]),
				borderDash: resolve$3([custom.borderDash, dataset.borderDash, lineElementOptions.borderDash]),
				borderDashOffset: resolve$3([custom.borderDashOffset, dataset.borderDashOffset, lineElementOptions.borderDashOffset]),
				borderJoinStyle: resolve$3([custom.borderJoinStyle, dataset.borderJoinStyle, lineElementOptions.borderJoinStyle]),
				fill: resolve$3([custom.fill, dataset.fill, lineElementOptions.fill]),
				steppedLine: resolve$3([custom.steppedLine, dataset.steppedLine, lineElementOptions.stepped]),
				cubicInterpolationMode: resolve$3([custom.cubicInterpolationMode, dataset.cubicInterpolationMode, lineElementOptions.cubicInterpolationMode]),
			};

			helpers$6.merge(line._model, styleHelpers.resolveLineStyle(custom, dataset, lineElementOptions));

			line.pivot();
		}

		// Update Points
		for (i = 0, ilen = points.length; i < ilen; ++i) {
			me.updateElement(points[i], i, reset);
		}

		if (showLine && line._model.tension !== 0) {
			me.updateBezierControlPoints();
		}

		// Now pivot the point for animation
		for (i = 0, ilen = points.length; i < ilen; ++i) {
			points[i].pivot();
		}
	},

	updateElement: function(point, index) {
		var me = this;

		LineController.prototype.updateElement.apply(me, arguments);

		helpers$6.merge(point._model, styleHelpers.resolvePointStyle(me.chart, point, index, me.chart.options.elements.point));
	},

	setHoverStyle: function(element) {
		// Point
		var me = this;
		var model = element._model;

		LineController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		helpers$6.merge(model, styleHelpers.resolvePointStyle(me.chart, element, element._index, model, true));
	},

	removeHoverStyle: function(element) {
		var me = this;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			helpers$6.merge(element._model, styleHelpers.resolvePointStyle(me.chart, element, element._index, me.chart.options.elements.point));
		}

		LineController.prototype.removeHoverStyle.apply(me, arguments);
	}
});

'use strict';

var helpers$7 = Chart.helpers;

var resolve$4 = helpers$7.options.resolve;

// Ported from Chart.js 2.7.3. Modified for style polarArea.
Chart.defaults.polarArea.legend.labels.generateLabels = function(chart) {
	var data = chart.data;
	if (data.labels.length && data.datasets.length) {
		return data.labels.map(function(label, i) {
			var meta = chart.getDatasetMeta(0);
			var ds = data.datasets[0];
			var arc = meta.data[i];
			var custom = arc.custom || {};
			var arcOpts = chart.options.elements.arc;
			var fill = resolve$4([custom.backgroundColor, ds.backgroundColor, arcOpts.backgroundColor], undefined, i);
			var stroke = resolve$4([custom.borderColor, ds.borderColor, arcOpts.borderColor], undefined, i);
			var bw = resolve$4([custom.borderWidth, ds.borderWidth, arcOpts.borderWidth], undefined, i);

			return helpers$7.merge({
				text: label,
				fillStyle: fill,
				strokeStyle: stroke,
				lineWidth: bw,
				hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

				// Extra data used for toggling the correct item
				index: i
			}, styleHelpers.resolveStyle(chart, arc, i, arcOpts));
		});
	}
	return [];
};

var PolarAreaController = Chart.controllers.polarArea;

var StylePolarAreaController = PolarAreaController.extend({

	dataElementType: StyleArc,

	// Ported from Chart.js 2.7.3. Modified for style polarArea.
	updateElement: function(arc, index, reset) {
		var me = this;
		var chart = me.chart;
		var dataset = me.getDataset();
		var opts = chart.options;
		var animationOpts = opts.animation;
		var scale = chart.scale;
		var labels = chart.data.labels;

		var centerX = scale.xCenter;
		var centerY = scale.yCenter;

		// var negHalfPI = -0.5 * Math.PI;
		var datasetStartAngle = opts.startAngle;
		var distance = arc.hidden ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);

		// For Chart.js 2.7.2 backward compatibility
		var startAngle, endAngle;
		if (me.calculateCircumference) {
			var circumference = me.calculateCircumference(dataset.data[index]);

			// If there is NaN data before us, we need to calculate the starting angle correctly.
			// We could be way more efficient here, but its unlikely that the polar area chart will have a lot of data
			var visibleCount = 0;
			var meta = me.getMeta();
			for (var i = 0; i < index; ++i) {
				if (!isNaN(dataset.data[i]) && !meta.data[i].hidden) {
					++visibleCount;
				}
			}

			startAngle = datasetStartAngle + (circumference * visibleCount);
			endAngle = startAngle + (arc.hidden ? 0 : circumference);
		} else {
			startAngle = me._starts[index];
			endAngle = startAngle + (arc.hidden ? 0 : me._angles[index]);
		}

		var resetRadius = animationOpts.animateScale ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);

		helpers$7.extend(arc, {
			// Utility
			_datasetIndex: me.index,
			_index: index,
			_scale: scale,

			// Desired view properties
			_model: {
				x: centerX,
				y: centerY,
				innerRadius: 0,
				outerRadius: reset ? resetRadius : distance,
				startAngle: reset && animationOpts.animateRotate ? datasetStartAngle : startAngle,
				endAngle: reset && animationOpts.animateRotate ? datasetStartAngle : endAngle,
				label: helpers$7.valueAtIndexOrDefault(labels, index, labels[index])
			}
		});

		// Apply border and fill style
		var elementOpts = opts.elements.arc;
		var custom = arc.custom || {};
		var model = arc._model;

		model.backgroundColor = resolve$4([custom.backgroundColor, dataset.backgroundColor, elementOpts.backgroundColor], undefined, index);
		model.borderColor = resolve$4([custom.borderColor, dataset.borderColor, elementOpts.borderColor], undefined, index);
		model.borderWidth = resolve$4([custom.borderWidth, dataset.borderWidth, elementOpts.borderWidth], undefined, index);

		helpers$7.merge(model, styleHelpers.resolveStyle(chart, arc, index, elementOpts));

		arc.pivot();
	},

	setHoverStyle: function(element) {
		var me = this;
		var model = element._model;

		PolarAreaController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		helpers$7.merge(model, styleHelpers.resolveStyle(me.chart, element, element._index, model, true));
	},

	removeHoverStyle: function(element) {
		var me = this;

		if (!element.$previousStyle) {
			helpers$7.merge(element._model, styleHelpers.resolveStyle(me.chart, element, element._index, me.chart.options.elements.arc));
		}

		PolarAreaController.prototype.removeHoverStyle.apply(me, arguments);
	}
});

'use strict';

var helpers$8 = Chart.helpers;

var resolve$5 = helpers$8.options.resolve;

var RadarController = Chart.controllers.radar;

var StyleRadarController = RadarController.extend({

	datasetElementType: StyleLine,

	dataElementType: StylePoint,

	// Ported from Chart.js 2.7.3. Modified for style radar.
	update: function(reset) {
		var me = this;
		var meta = me.getMeta();
		var line = meta.dataset;
		var points = meta.data;
		var custom = line.custom || {};
		var dataset = me.getDataset();
		var lineElementOptions = me.chart.options.elements.line;
		var scale = me.chart.scale;

		// Compatibility: If the properties are defined with only the old name, use those values
		if ((dataset.tension !== undefined) && (dataset.lineTension === undefined)) {
			dataset.lineTension = dataset.tension;
		}

		helpers$8.extend(meta.dataset, {
			// Utility
			_datasetIndex: me.index,
			_scale: scale,
			// Data
			_children: points,
			_loop: true,
			// Model
			_model: {
				// Appearance
				tension: resolve$5([custom.tension, dataset.lineTension, lineElementOptions.tension]),
				backgroundColor: resolve$5([custom.backgroundColor, dataset.backgroundColor, lineElementOptions.backgroundColor]),
				borderWidth: resolve$5([custom.borderWidth, dataset.borderWidth, lineElementOptions.borderWidth]),
				borderColor: resolve$5([custom.borderColor, dataset.borderColor, lineElementOptions.borderColor]),
				fill: resolve$5([custom.fill, dataset.fill, lineElementOptions.fill]),
				borderCapStyle: resolve$5([custom.borderCapStyle, dataset.borderCapStyle, lineElementOptions.borderCapStyle]),
				borderDash: resolve$5([custom.borderDash, dataset.borderDash, lineElementOptions.borderDash]),
				borderDashOffset: resolve$5([custom.borderDashOffset, dataset.borderDashOffset, lineElementOptions.borderDashOffset]),
				borderJoinStyle: resolve$5([custom.borderJoinStyle, dataset.borderJoinStyle, lineElementOptions.borderJoinStyle]),
			}
		});

		helpers$8.merge(meta.dataset._model, styleHelpers.resolveLineStyle(custom, dataset, lineElementOptions));

		meta.dataset.pivot();

		// Update Points
		helpers$8.each(points, function(point, index) {
			me.updateElement(point, index, reset);
		}, me);

		// Update bezier control points
		me.updateBezierControlPoints();
	},

	updateElement: function(point, index) {
		var me = this;

		RadarController.prototype.updateElement.apply(me, arguments);

		helpers$8.merge(point._model, styleHelpers.resolvePointStyle(me.chart, point, index, me.chart.options.elements.point));
	},

	setHoverStyle: function(element) {
		// Point
		var me = this;
		var model = element._model;

		RadarController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		helpers$8.merge(model, styleHelpers.resolvePointStyle(me.chart, element, element._index, model, true));
	},

	removeHoverStyle: function(element) {
		var me = this;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			helpers$8.merge(element._model, styleHelpers.resolvePointStyle(me.chart, element, element._index, me.chart.options.elements.point));
		}

		RadarController.prototype.removeHoverStyle.apply(me, arguments);
	}
});

var defaults$1 = Chart.defaults;
var helpers$9 = Chart.helpers;
var layouts = Chart.layouts;

var isArray = helpers$9.isArray;
var valueOrDefault$2 = helpers$9.valueOrDefault;
var resolve$6 = helpers$9.options.resolve;

// Ported from Chart.js 2.7.3. Modified for style legend.
// Generates labels shown in the legend
defaults$1.global.legend.labels.generateLabels = function(chart) {
	var data = chart.data;
	return isArray(data.datasets) ? data.datasets.map(function(dataset, i) {
		return {
			text: dataset.label,
			fillStyle: helpers$9.valueAtIndexOrDefault(dataset.backgroundColor, 0),
			hidden: !chart.isDatasetVisible(i),
			lineCap: dataset.borderCapStyle,
			lineDash: dataset.borderDash,
			lineDashOffset: dataset.borderDashOffset,
			lineJoin: dataset.borderJoinStyle,
			lineWidth: dataset.borderWidth,
			strokeStyle: dataset.borderColor,
			pointStyle: dataset.pointStyle,

			shadowOffsetX: resolve$6([dataset.pointShadowOffsetX, dataset.shadowOffsetX], undefined, 0),
			shadowOffsetY: resolve$6([dataset.pointShadowOffsetY, dataset.shadowOffsetY], undefined, 0),
			shadowBlur: resolve$6([dataset.pointShadowBlur, dataset.shadowBlur], undefined, 0),
			shadowColor: resolve$6([dataset.pointShadowColor, dataset.shadowColor], undefined, 0),
			bevelWidth: resolve$6([dataset.pointBevelWidth, dataset.bevelWidth], undefined, 0),
			bevelHighlightColor: resolve$6([dataset.pointBevelHighlightColor, dataset.bevelHighlightColor], undefined, 0),
			bevelShadowColor: resolve$6([dataset.pointBevelShadowColor, dataset.bevelShadowColor], undefined, 0),
			innerGlowWidth: resolve$6([dataset.pointInnerGlowWidth, dataset.innerGlowWidth], undefined, 0),
			innerGlowColor: resolve$6([dataset.pointInnerGlowColor, dataset.innerGlowColor], undefined, 0),
			outerGlowWidth: resolve$6([dataset.pointOuterGlowWidth, dataset.outerGlowWidth], undefined, 0),
			outerGlowColor: resolve$6([dataset.pointOuterGlowColor, dataset.outerGlowColor], undefined, 0),
			backgroundOverlayColor: resolve$6([dataset.pointBackgroundOverlayColor, dataset.backgroundOverlayColor], undefined, 0),
			backgroundOverlayMode: resolve$6([dataset.pointBackgroundOverlayMode, dataset.backgroundOverlayMode], undefined, 0),

			// Below is extra data used for toggling the datasets
			datasetIndex: i
		};
	}, this) : [];
};

/**
 * Ported from Chart.js 2.7.3.
 *
 * Helper function to get the box width based on the usePointStyle option
 * @param labelopts {Object} the label options on the legend
 * @param fontSize {Number} the label font size
 * @return {Number} width of the color box area
 */
function getBoxWidth(labelOpts, fontSize) {
	return labelOpts.usePointStyle ?
		fontSize * Math.SQRT2 :
		labelOpts.boxWidth;
}

var StyleLegend = Chart.Legend.extend({

	// Ported from Chart.js 2.7.3. Modified for style legend.
	// Actually draw the legend on the canvas
	draw: function() {
		var me = this;
		var opts = me.options;
		var labelOpts = opts.labels;
		var globalDefault = defaults$1.global;
		var lineDefault = globalDefault.elements.line;
		var legendWidth = me.width;
		var lineWidths = me.lineWidths;

		if (opts.display) {
			var ctx = me.ctx;
			var fontColor = valueOrDefault$2(labelOpts.fontColor, globalDefault.defaultFontColor);
			var fontSize = valueOrDefault$2(labelOpts.fontSize, globalDefault.defaultFontSize);
			var fontStyle = valueOrDefault$2(labelOpts.fontStyle, globalDefault.defaultFontStyle);
			var fontFamily = valueOrDefault$2(labelOpts.fontFamily, globalDefault.defaultFontFamily);
			var labelFont = helpers$9.fontString(fontSize, fontStyle, fontFamily);
			var cursor;

			// Canvas setup
			ctx.textAlign = 'left';
			ctx.textBaseline = 'middle';
			ctx.lineWidth = 0.5;
			ctx.strokeStyle = fontColor; // for strikethrough effect
			ctx.fillStyle = fontColor; // render in correct colour
			ctx.font = labelFont;

			var boxWidth = getBoxWidth(labelOpts, fontSize);
			var hitboxes = me.legendHitBoxes;

			// current position
			var drawLegendBox = function(x, y, legendItem) {
				var drawCallback;

				if (isNaN(boxWidth) || boxWidth <= 0) {
					return;
				}

				// Set the ctx for the box
				ctx.save();

				ctx.fillStyle = valueOrDefault$2(legendItem.fillStyle, globalDefault.defaultColor);
				ctx.lineCap = valueOrDefault$2(legendItem.lineCap, lineDefault.borderCapStyle);
				ctx.lineDashOffset = valueOrDefault$2(legendItem.lineDashOffset, lineDefault.borderDashOffset);
				ctx.lineJoin = valueOrDefault$2(legendItem.lineJoin, lineDefault.borderJoinStyle);
				ctx.lineWidth = valueOrDefault$2(legendItem.lineWidth, lineDefault.borderWidth);
				ctx.strokeStyle = valueOrDefault$2(legendItem.strokeStyle, globalDefault.defaultColor);
				var isLineWidthZero = (valueOrDefault$2(legendItem.lineWidth, lineDefault.borderWidth) === 0);

				if (ctx.setLineDash) {
					// IE 9 and 10 do not support line dash
					ctx.setLineDash(valueOrDefault$2(legendItem.lineDash, lineDefault.borderDash));
				}

				if (opts.labels && opts.labels.usePointStyle) {
					// Recalculate x and y for drawPoint() because its expecting
					// x and y to be center of figure (instead of top left)
					var radius = fontSize * Math.SQRT2 / 2;
					var offSet = radius / Math.SQRT2;
					var centerX = x + offSet;
					var centerY = y + offSet;

					drawCallback = function() {
						// Draw pointStyle as legend symbol
						helpers$9.canvas.drawPoint(ctx, legendItem.pointStyle, radius, centerX, centerY);
					};
				} else {
					drawCallback = function() {
						// Draw box as legend symbol
						ctx.beginPath();
						ctx.rect(x, y, boxWidth, fontSize);
						ctx.fill();
						if (!isLineWidthZero) {
							ctx.stroke();
						}
					};
				}

				styleHelpers.drawShadow(me.chart, legendItem.shadowOffsetX, legendItem.shadowOffsetY,
					legendItem.shadowBlur, legendItem.shadowColor, drawCallback, true);

				if (styleHelpers.opaque(ctx.fillStyle)) {
					var bevelExtra = styleHelpers.opaque(ctx.strokeStyle) && ctx.lineWidth > 0 ? ctx.lineWidth / 2 : 0;

					ctx.save();

					ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
					drawCallback();

					styleHelpers.drawBackgroundOverlay(me.chart, legendItem.backgroundOverlayColor,
						legendItem.backgroundOverlayMode, drawCallback);
					styleHelpers.drawBevel(me.chart, legendItem.bevelWidth + bevelExtra,
						legendItem.bevelHighlightColor, legendItem.bevelShadowColor, drawCallback);

					ctx.restore();
				}

				styleHelpers.drawInnerGlow(me.chart, legendItem.innerGlowWidth, legendItem.innerGlowColor,
					ctx.lineWidth, drawCallback);
				styleHelpers.drawOuterGlow(me.chart, legendItem.outerGlowWidth, legendItem.outerGlowColor,
					ctx.lineWidth, drawCallback);

				if (!isLineWidthZero) {
					ctx.fillStyle = 'rgba(0, 0, 0, 0)';
					drawCallback();
				}

				ctx.restore();
			};
			var fillText = function(x, y, legendItem, textWidth) {
				var halfFontSize = fontSize / 2;
				var xLeft = boxWidth + halfFontSize + x;
				var yMiddle = y + halfFontSize;

				ctx.fillText(legendItem.text, xLeft, yMiddle);

				if (legendItem.hidden) {
					// Strikethrough the text if hidden
					ctx.beginPath();
					ctx.lineWidth = 2;
					ctx.moveTo(xLeft, yMiddle);
					ctx.lineTo(xLeft + textWidth, yMiddle);
					ctx.stroke();
				}
			};

			// Horizontal
			var isHorizontal = me.isHorizontal();
			if (isHorizontal) {
				cursor = {
					x: me.left + ((legendWidth - lineWidths[0]) / 2),
					y: me.top + labelOpts.padding,
					line: 0
				};
			} else {
				cursor = {
					x: me.left + labelOpts.padding,
					y: me.top + labelOpts.padding,
					line: 0
				};
			}

			var itemHeight = fontSize + labelOpts.padding;
			helpers$9.each(me.legendItems, function(legendItem, i) {
				var textWidth = ctx.measureText(legendItem.text).width;
				var width = boxWidth + (fontSize / 2) + textWidth;
				var x = cursor.x;
				var y = cursor.y;

				if (isHorizontal) {
					if (x + width >= legendWidth) {
						y = cursor.y += itemHeight;
						cursor.line++;
						x = cursor.x = me.left + ((legendWidth - lineWidths[cursor.line]) / 2);
					}
				} else if (y + itemHeight > me.bottom) {
					x = cursor.x = x + me.columnWidths[cursor.line] + labelOpts.padding;
					y = cursor.y = me.top + labelOpts.padding;
					cursor.line++;
				}

				drawLegendBox(x, y, legendItem);

				hitboxes[i].left = x;
				hitboxes[i].top = y;

				// Fill the actual label
				fillText(x, y, legendItem, textWidth);

				if (isHorizontal) {
					cursor.x += width + (labelOpts.padding);
				} else {
					cursor.y += itemHeight;
				}

			});
		}
	}
});

// Ported from Chart.js 2.7.3. Modified for style legend.
function createNewLegendAndAttach(chart, legendOpts) {
	var legend = new StyleLegend({
		ctx: chart.ctx,
		options: legendOpts,
		chart: chart
	});

	layouts.configure(chart, legend, legendOpts);
	layouts.addBox(chart, legend);
	chart.legend = legend;
}

var StyleLegendPlugin = {
	id: 'legend',

	_element: StyleLegend,

	// Ported from Chart.js 2.7.3.
	beforeInit: function(chart) {
		var legendOpts = chart.options.legend;

		if (legendOpts) {
			createNewLegendAndAttach(chart, legendOpts);
		}
	},

	// Ported from Chart.js 2.7.3.
	beforeUpdate: function(chart) {
		var legendOpts = chart.options.legend;
		var legend = chart.legend;

		if (legendOpts) {
			helpers$9.mergeIf(legendOpts, defaults$1.global.legend);

			if (legend) {
				layouts.configure(chart, legend, legendOpts);
				legend.options = legendOpts;
			} else {
				createNewLegendAndAttach(chart, legendOpts);
			}
		} else if (legend) {
			layouts.removeBox(chart, legend);
			delete chart.legend;
		}
	},

	// Ported from Chart.js 2.7.3.
	afterEvent: function(chart, e) {
		var legend = chart.legend;
		if (legend) {
			legend.handleEvent(e);
		}
	}
};

'use strict';

Chart.StyleTooltip = StyleTooltip;

Chart.helpers.style = styleHelpers;

Chart.elements.StyleArc = StyleArc;
Chart.elements.StyleLine = StyleLine;
Chart.elements.StylePoint = StylePoint;
Chart.elements.StyleRectangle = StyleRectangle;

Chart.controllers.bar = StyleBarController;
Chart.controllers.bubble = StyleBubbleController;
Chart.controllers.doughnut = Chart.controllers.pie = StyleDoughnutController;
Chart.controllers.horizontalBar = StyleHorizontalBarController;
Chart.controllers.line = Chart.controllers.scatter = StyleLineController;
Chart.controllers.polarArea = StylePolarAreaController;
Chart.controllers.radar = StyleRadarController;

Chart.plugins.getAll().forEach(function(plugin) {
	if (plugin.id === 'legend') {
		Chart.plugins.unregister(plugin);
	}
});
Chart.plugins.register(StyleLegendPlugin);
Chart.Legend = StyleLegendPlugin._element;

})));
