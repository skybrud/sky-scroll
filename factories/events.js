import { trackList, viewport, isServer } from './globals';
import Redraw from './redraw';
import Recalculate from './recalculate';

/**
 * Array of object containing available events and their callbacks
 */
const events = [];
if (!isServer) {
	events.push({
		name: 'scroll',
		callback: () => {
			viewport.scroll.y = window.pageYOffset;
			Redraw();
		},
	});

	events.push({
		name: 'resize',
		callback: () => {
			for (let i = trackList.length - 1; i >= 0; i--) {
				const item = trackList[i];

				if (typeof item.config.onResize === 'function') {
					item.config.onResize();
				}
			}

			Recalculate();
			Redraw();
		},
	});
}
/**
 * Function to add all eventListeners
 */
const add = () => {
	if (!isServer) {
		for (let i = events.length - 1; i >= 0; i--) {
			const event = events[i];

			window.addEventListener(event.name, event.callback);
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

			window.removeEventListener(event.name, event.callback);
		}
	}
};

export default {
	add,
	remove,
};
