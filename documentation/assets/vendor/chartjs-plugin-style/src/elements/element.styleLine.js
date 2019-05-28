'use strict';

import Chart from 'chart.js';
import styleHelpers from '../helpers/helpers.style';

var Line = Chart.elements.Line;

export default Line.extend({

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
