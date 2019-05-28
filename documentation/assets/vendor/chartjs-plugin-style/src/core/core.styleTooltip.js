'use strict';

import Chart from 'chart.js';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

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
	var color = helpers.color(colorString);
	return color.alpha(opacity * color.alpha()).rgbaString();
}

var Tooltip = Chart.Tooltip;

export default Tooltip.extend({

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
