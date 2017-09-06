import { trackList } from './globals';
import { viewport } from './viewport';
import Dimensions from './dimensions';
import Redraw from './redraw';

/**
 * Helper function to iterate all elements in parsed list and
 * recalculate those.
 *
 * @param {array} list: list of items to recalculate
 * @param {object} view: object containing window information
 */
const recalculateItems = (list, view) => {
	for (let i = list.length - 1; i >= 0; i--) {
		const item = list[i];
		item.dimensions = Dimensions(
			item.element.getBoundingClientRect(),
			view);
	}
	Redraw(true);
};

/**
 * Function to find elements to be recalculated either
 * throttled by requestAnimationFrame or unthrottled
 *
 * @param {HTMLDomElement} element: specific domElement to be recalculated
 * @param {boolean} immediate; boolean to forced unthrottled behaviour.
 */
export default (element, immediate = false) => {
	let recalculatePending = false;
	let recalculateList = [];

	for (let i = trackList.length - 1; i >= 0; i--) {
		const item = trackList[i];

		if (!element) {
			recalculateList = trackList;
			break;
		}

		if (item.element === element) {
			recalculateList.push(element);
		}
	}

	if (!recalculatePending && !immediate && !element) {
		recalculatePending = true;
		window.requestAnimationFrame(() => {
			recalculateItems(recalculateList, viewport);
			recalculatePending = false;
		});
	} else if (immediate || element) {
		recalculateItems(recalculateList, viewport);
	}
};
