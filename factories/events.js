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
		listeners: ['scroll'],
		target: () => container.element,
		callback: () => {
			container.calculateScroll();
			Redraw();
		},
	});

	events.push({
		listeners: ['resize', 'orientationchange'],
		target: () => window,
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

			event.listeners.forEach((listener) => {
				event.target().addEventListener(listener, event.callback);
			});
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

			event.listeners.forEach((listener) => {
				event.target().removeEventListener(listener, event.callback);
			});
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
