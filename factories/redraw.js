import { trackList } from './globals';
import { viewport } from './viewport';

/**
 * Helper factory delivering the user scrolled distance of an element.
 *
 * @param {object} dimensions: elements dimensions
 * @param {object} view: object containing window information
 * @return {object} the distance the element has travelled because of user scroll
 */
const calculateScrolled = (dimensions, view) =>
	view.scroll.y - dimensions.top + view.dimensions.height;

/**
 * Helper factory determining if an element should be redrawn
 *
 * @param {object} rect: an elements boundingClientRect.
 * @param {object} view: view object containing window pageYoffset and innerheight
 * @return {boolean} deciding if an element should be redrawn.
 */
const shouldRedraw = (rect, view) => {
	const startPoint = rect.top - view.dimensions.height;
	const endPoint = rect.bottom;

	return view.scroll.y > startPoint && view.scroll.y < endPoint;
};

/**
 * Function initiating tracked elements callback and exposing
 * needed parameters if their condition(s) are met.
 */
export default (forceAll = false) => {
	for (let i = trackList.length - 1; i >= 0; i--) {
		const item = trackList[i];
		const scrolled = (typeof item.config.calculateScrolled === 'function')
			? item.config.calculateScrolled(item.dimensions, viewport)
			: calculateScrolled(item.dimensions, viewport);
		let initiateCallback = Boolean(forceAll);

		if (!forceAll) {
			if (typeof item.config.shouldRedraw !== 'undefined') {
				if (typeof item.config.shouldRedraw === 'function') {
					initiateCallback = item.config.shouldRedraw(item.dimensions, viewport);
				} else {
					initiateCallback = Boolean(item.config.shouldRedraw);
				}
			} else {
				initiateCallback = shouldRedraw(item.dimensions, viewport);
			}
		}

		if (initiateCallback) {
			item.callback(
				scrolled,
				item.dimensions,
				viewport);
		}
	}
};
