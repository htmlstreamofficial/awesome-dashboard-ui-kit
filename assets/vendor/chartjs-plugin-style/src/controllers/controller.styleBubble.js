'use strict';

import Chart from '../core/core.js';
import StylePoint from '../elements/element.stylePoint';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var valueOrDefault = helpers.valueOrDefault;
var getHoverColor = styleHelpers.getHoverColor;

var BubbleController = Chart.controllers.bubble;

export default BubbleController.extend({

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
		var resolve = helpers.options.resolve;
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
