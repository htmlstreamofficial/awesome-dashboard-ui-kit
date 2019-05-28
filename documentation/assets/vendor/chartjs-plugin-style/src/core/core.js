'use strict';

import Chart from 'chart.js';
import StyleTooltip from './core.styleTooltip';

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

export default Chart;
