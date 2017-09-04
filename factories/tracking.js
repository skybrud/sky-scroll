import { trackList, viewport } from './globals';
import Dimensions from './dimensions';
import Events from './events';

/**
 * Function for setting up tracking of and element, with its callback, and
 * if needed, custom behivours.
 *
 * @param {HTMLDomElement} element: domElement to be tracked
 * @param {function} callback: the function to be called when conditions are met
 * @param {object} config: object where custom conditions and behaviour can be inserted.
 */
const track = (element, callback, config = {}) => {
	if (trackList.length === 0) {
		Events.add();
	}

	const rect = element.getBoundingClientRect();

	trackList.push({
		element,
		dimensions: Object.assign({}, Dimensions(rect, viewport)),
		callback,
		config,
	});
};

/**
 * Function to untrack all methods or one a domElement
 *
 * @param {HTMLDomElement} element: domElement to be untracked
 * @param {function} callback: the function to be removed
 */
const untrack = (element, callback) => {
	const callbackNotAFunction = typeof callback !== 'function';

	for (let i = trackList.length - 1; i >= 0; i--) {
		const item = trackList[i];

		if (item.element === element) {
			if (callbackNotAFunction) {
				trackList.splice(i, 1);
			} else if (item.callback === callback) {
				trackList.splice(i, 1);
				break;
			}
		}
	}

	if (trackList.length === 0) {
		Events.remove();
	}
};

/**
 * Function to add scrollListener on document.body with a callback
 *
 * @param {function} callback: the function to be called when conditions are met
 */
const on = (callback) => {
	track(document.body, callback, {
		shouldRedraw: () => true,
	});
};

/**
 * Function to remove one or all callbacks on document.body
 *
 * @param {function} callback: the function to be removed
 */
const off = (callback) => {
	untrack(document.body, callback);
};

export {
	track,
	untrack,
	on,
	off,
};
