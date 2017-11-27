import Events from './events';
import { isServer } from './globals';

/**
 * Global objects containing relevant viewport information
 */
const viewport = {
	scroll: {
		y: null,
		x: null,
	},
	dimensions: {
		width: null,
		height: null,
	},
};

const containerElement = !isServer ? window : {};

const container = {
	element: containerElement,
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
		if (container.element === window) {
			viewport.scroll.x = container.element.pageXOffset;
			viewport.scroll.y = container.element.pageYOffset;
		} else {
			viewport.scroll.x = container.element.scrollLeft;
			viewport.scroll.y = container.element.scrollTop;
		}
	},
	calculateDimensions() {
		if (container.element === window) {
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
