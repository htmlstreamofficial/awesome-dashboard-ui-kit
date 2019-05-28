'use strict';

import Chart from '../core/core.js';
import StyleArc from '../elements/element.styleArc';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var resolve = helpers.options.resolve;

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
			var fill = resolve([custom.backgroundColor, ds.backgroundColor, arcOpts.backgroundColor], undefined, i);
			var stroke = resolve([custom.borderColor, ds.borderColor, arcOpts.borderColor], undefined, i);
			var bw = resolve([custom.borderWidth, ds.borderWidth, arcOpts.borderWidth], undefined, i);

			return helpers.merge({
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

export default PolarAreaController.extend({

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

		helpers.extend(arc, {
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
				label: helpers.valueAtIndexOrDefault(labels, index, labels[index])
			}
		});

		// Apply border and fill style
		var elementOpts = opts.elements.arc;
		var custom = arc.custom || {};
		var model = arc._model;

		model.backgroundColor = resolve([custom.backgroundColor, dataset.backgroundColor, elementOpts.backgroundColor], undefined, index);
		model.borderColor = resolve([custom.borderColor, dataset.borderColor, elementOpts.borderColor], undefined, index);
		model.borderWidth = resolve([custom.borderWidth, dataset.borderWidth, elementOpts.borderWidth], undefined, index);

		helpers.merge(model, styleHelpers.resolveStyle(chart, arc, index, elementOpts));

		arc.pivot();
	},

	setHoverStyle: function(element) {
		var me = this;
		var model = element._model;

		PolarAreaController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		helpers.merge(model, styleHelpers.resolveStyle(me.chart, element, element._index, model, true));
	},

	removeHoverStyle: function(element) {
		var me = this;

		if (!element.$previousStyle) {
			helpers.merge(element._model, styleHelpers.resolveStyle(me.chart, element, element._index, me.chart.options.elements.arc));
		}

		PolarAreaController.prototype.removeHoverStyle.apply(me, arguments);
	}
});
