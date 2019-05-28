'use strict';

import Chart from '../core/core.js';
import StyleLine from '../elements/element.styleLine';
import StylePoint from '../elements/element.stylePoint';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var valueOrDefault = helpers.valueOrDefault;
var resolve = helpers.options.resolve;

var LineController = Chart.controllers.line;

// Ported from Chart.js 2.7.3.
function lineEnabled(dataset, options) {
	return valueOrDefault(dataset.showLine, options.showLines);
}

export default LineController.extend({

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
				spanGaps: valueOrDefault(dataset.spanGaps, options.spanGaps),
				tension: resolve([custom.tension, dataset.lineTension, lineElementOptions.tension]),
				backgroundColor: resolve([custom.backgroundColor, dataset.backgroundColor, lineElementOptions.backgroundColor]),
				borderWidth: resolve([custom.borderWidth, dataset.borderWidth, lineElementOptions.borderWidth]),
				borderColor: resolve([custom.borderColor, dataset.borderColor, lineElementOptions.borderColor]),
				borderCapStyle: resolve([custom.borderCapStyle, dataset.borderCapStyle, lineElementOptions.borderCapStyle]),
				borderDash: resolve([custom.borderDash, dataset.borderDash, lineElementOptions.borderDash]),
				borderDashOffset: resolve([custom.borderDashOffset, dataset.borderDashOffset, lineElementOptions.borderDashOffset]),
				borderJoinStyle: resolve([custom.borderJoinStyle, dataset.borderJoinStyle, lineElementOptions.borderJoinStyle]),
				fill: resolve([custom.fill, dataset.fill, lineElementOptions.fill]),
				steppedLine: resolve([custom.steppedLine, dataset.steppedLine, lineElementOptions.stepped]),
				cubicInterpolationMode: resolve([custom.cubicInterpolationMode, dataset.cubicInterpolationMode, lineElementOptions.cubicInterpolationMode]),
			};

			helpers.merge(line._model, styleHelpers.resolveLineStyle(custom, dataset, lineElementOptions));

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

		helpers.merge(point._model, styleHelpers.resolvePointStyle(me.chart, point, index, me.chart.options.elements.point));
	},

	setHoverStyle: function(element) {
		// Point
		var me = this;
		var model = element._model;

		LineController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		helpers.merge(model, styleHelpers.resolvePointStyle(me.chart, element, element._index, model, true));
	},

	removeHoverStyle: function(element) {
		var me = this;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			helpers.merge(element._model, styleHelpers.resolvePointStyle(me.chart, element, element._index, me.chart.options.elements.point));
		}

		LineController.prototype.removeHoverStyle.apply(me, arguments);
	}
});
