'use strict';

import Chart from '../core/core.js';
import StyleLine from '../elements/element.styleLine';
import StylePoint from '../elements/element.stylePoint';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var resolve = helpers.options.resolve;

var RadarController = Chart.controllers.radar;

export default RadarController.extend({

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

		helpers.extend(meta.dataset, {
			// Utility
			_datasetIndex: me.index,
			_scale: scale,
			// Data
			_children: points,
			_loop: true,
			// Model
			_model: {
				// Appearance
				tension: resolve([custom.tension, dataset.lineTension, lineElementOptions.tension]),
				backgroundColor: resolve([custom.backgroundColor, dataset.backgroundColor, lineElementOptions.backgroundColor]),
				borderWidth: resolve([custom.borderWidth, dataset.borderWidth, lineElementOptions.borderWidth]),
				borderColor: resolve([custom.borderColor, dataset.borderColor, lineElementOptions.borderColor]),
				fill: resolve([custom.fill, dataset.fill, lineElementOptions.fill]),
				borderCapStyle: resolve([custom.borderCapStyle, dataset.borderCapStyle, lineElementOptions.borderCapStyle]),
				borderDash: resolve([custom.borderDash, dataset.borderDash, lineElementOptions.borderDash]),
				borderDashOffset: resolve([custom.borderDashOffset, dataset.borderDashOffset, lineElementOptions.borderDashOffset]),
				borderJoinStyle: resolve([custom.borderJoinStyle, dataset.borderJoinStyle, lineElementOptions.borderJoinStyle]),
			}
		});

		helpers.merge(meta.dataset._model, styleHelpers.resolveLineStyle(custom, dataset, lineElementOptions));

		meta.dataset.pivot();

		// Update Points
		helpers.each(points, function(point, index) {
			me.updateElement(point, index, reset);
		}, me);

		// Update bezier control points
		me.updateBezierControlPoints();
	},

	updateElement: function(point, index) {
		var me = this;

		RadarController.prototype.updateElement.apply(me, arguments);

		helpers.merge(point._model, styleHelpers.resolvePointStyle(me.chart, point, index, me.chart.options.elements.point));
	},

	setHoverStyle: function(element) {
		// Point
		var me = this;
		var model = element._model;

		RadarController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		helpers.merge(model, styleHelpers.resolvePointStyle(me.chart, element, element._index, model, true));
	},

	removeHoverStyle: function(element) {
		var me = this;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			helpers.merge(element._model, styleHelpers.resolvePointStyle(me.chart, element, element._index, me.chart.options.elements.point));
		}

		RadarController.prototype.removeHoverStyle.apply(me, arguments);
	}
});
