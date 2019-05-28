'use strict';

import StyleBarController from './controller.styleBar';

export default StyleBarController.extend({
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
