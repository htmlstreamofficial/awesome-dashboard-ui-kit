'use strict';

import Chart from './core/core.js';
import StyleTooltip from './core/core.styleTooltip';

import StyleHelper from './helpers/helpers.style';

import StyleArcElement from './elements/element.styleArc';
import StyleLineElement from './elements/element.styleLine';
import StylePointElement from './elements/element.stylePoint';
import StyleRectangleElement from './elements/element.styleRectangle';

import StyleBarController from './controllers/controller.styleBar';
import StyleBubbleController from './controllers/controller.styleBubble';
import StyleDoughnutController from './controllers/controller.styleDoughnut';
import StyleHorizontalBarController from './controllers/controller.styleHorizontalBar';
import StyleLineController from './controllers/controller.styleLine';
import StylePolarAreaController from './controllers/controller.stylePolarArea';
import StyleRadarController from './controllers/controller.styleRadar';

import StyleLegendPlugin from './plugins/plugin.styleLegend';

Chart.StyleTooltip = StyleTooltip;

Chart.helpers.style = StyleHelper;

Chart.elements.StyleArc = StyleArcElement;
Chart.elements.StyleLine = StyleLineElement;
Chart.elements.StylePoint = StylePointElement;
Chart.elements.StyleRectangle = StyleRectangleElement;

Chart.controllers.bar = StyleBarController;
Chart.controllers.bubble = StyleBubbleController;
Chart.controllers.doughnut = Chart.controllers.pie = StyleDoughnutController;
Chart.controllers.horizontalBar = StyleHorizontalBarController;
Chart.controllers.line = Chart.controllers.scatter = StyleLineController;
Chart.controllers.polarArea = StylePolarAreaController;
Chart.controllers.radar = StyleRadarController;

Chart.plugins.getAll().forEach(function(plugin) {
	if (plugin.id === 'legend') {
		Chart.plugins.unregister(plugin);
	}
});
Chart.plugins.register(StyleLegendPlugin);
Chart.Legend = StyleLegendPlugin._element;
