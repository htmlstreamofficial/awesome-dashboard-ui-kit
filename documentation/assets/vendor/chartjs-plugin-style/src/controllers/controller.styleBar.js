'use strict';

import Chart from '../core/core.js';
import StyleRectangle from '../elements/element.styleRectangle';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var resolve = helpers.options.resolve;

var BarController = Chart.controllers.bar;

export default BarController.extend({

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
			borderSkipped: helpers.valueOrDefault(custom.borderSkipped, rectangleOptions.borderSkipped),
			backgroundColor: resolve([custom.backgroundColor, dataset.backgroundColor, rectangleOptions.backgroundColor], undefined, index),
			borderColor: resolve([custom.borderColor, dataset.borderColor, rectangleOptions.borderColor], undefined, index),
			borderWidth: resolve([custom.borderWidth, dataset.borderWidth, rectangleOptions.borderWidth], undefined, index),
		};

		helpers.merge(rectangle._model, styleHelpers.resolveStyle(chart, rectangle, index, rectangleOptions));

		me.updateElementGeometry(rectangle, index, reset);

		rectangle.pivot();
	},

	setHoverStyle: function(element) {
		var me = this;
		var model = element._model;

		BarController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		helpers.merge(model, styleHelpers.resolveStyle(me.chart, element, element._index, model, true));
	},

	removeHoverStyle: function(element) {
		var me = this;

		if (!element.$previousStyle) {
			helpers.merge(element._model, styleHelpers.resolveStyle(me.chart, element, element._index, me.chart.options.elements.rectangle));
		}

		BarController.prototype.removeHoverStyle.apply(me, arguments);
	}
});
