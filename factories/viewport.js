import { $window } from './globals';
import Events from './events';

/**
 * Global objects containing relevant viewport information
 */
const viewport = {
	scroll: {
		y: null,
		x: null,
		lastY: null,
		lastX: null,
	},
	dimensions: {
		width: null,
		height: null,
	},
};

const container = {
	element: $window,
	set(newContainer) {
		const eventsActive = Events.active();
		if (eventsActive) {
			Events.remove();
		}
		container.element = newContainer;
		if (eventsActive) {
			Events.add();
		}
	},
	calculateScroll() {
		viewport.scroll.lastX = viewport.scroll.x;
		viewport.scroll.lastY = viewport.scroll.y;
		if (container.element === $window) {
			viewport.scroll.x = container.element.pageXOffset;
			viewport.scroll.y = container.element.pageYOffset;
		} else {
			viewport.scroll.x = container.element.scrollLeft;
			viewport.scroll.y = container.element.scrollTop;
		}
	},
	calculateDimensions() {
		if (container.element === $window) {
			viewport.dimensions.width = container.element.innerWidth;
			viewport.dimensions.height = container.element.innerHeight;
		} else {
			viewport.dimensions.width = container.element.clientWidth;
			viewport.dimensions.height = container.element.clientHeight;
		}
	},
};

export {
	viewport,
	container,
};
