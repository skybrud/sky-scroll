import { trackList, isServer } from './globals';
import Redraw from './redraw';
import Recalculate from './recalculate';
import { container } from './viewport';

/**
 * Array of object containing available events and their callbacks
 */
const events = [];
if (!isServer) {
	events.push({
		target: () => container.element,
		name: 'scroll',
		callback: () => {
			container.calculateScroll();
			Redraw();
		},
	});

	events.push({
		target: () => window,
		name: 'resize',
		callback: () => {
			container.calculateDimensions();

			for (let i = trackList.length - 1; i >= 0; i--) {
				const item = trackList[i];

				if (typeof item.config.onResize === 'function') {
					item.config.onResize();
				}
			}

			Recalculate();
		},
	});
}
/**
 * Function to add all eventListeners
 */
const add = () => {
	if (!isServer) {
		container.calculateDimensions();
		container.calculateScroll();

		for (let i = events.length - 1; i >= 0; i--) {
			const event = events[i];

			event.target().addEventListener(event.name, event.callback);
		}
	}
};

/**
 * Function to remove all eventListeners
 */
const remove = () => {
	if (!isServer) {
		for (let i = events.length - 1; i >= 0; i--) {
			const event = events[i];

			event.target().removeEventListener(event.name, event.callback);
		}
	}
};

/**
 * Function to check if eventListeners are active
 */
const active = () => events.length !== -1;

export default {
	add,
	remove,
	active,
};
