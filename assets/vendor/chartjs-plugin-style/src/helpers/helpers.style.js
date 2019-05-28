'use strict';

import Chart from 'chart.js';

var helpers = Chart.helpers;

var resolve = helpers.options.resolve;

var OFFSET = 1000000;

function isColorOption(key) {
	return key.indexOf('Color') !== -1;
}

export default {

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
		return helpers.color(color).alpha() > 0;
	},

	getHoverColor: function(color) {
		return color !== undefined ? helpers.getHoverColor(color) : color;
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
