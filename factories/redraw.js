import { trackList, viewport } from './globals';

/**
 * Helper factory delivering the user scrolled distance of an element.
 *
 * @param {object} dimensions: elements dimensions
 * @param {object} view: object containing window information
 * @return {object} the distance the element has travelled because of user scroll
 */
const calculateScrolled = (dimensions, view) => {
	if (dimensions.top <= view.dimensions.height) {
		return view.scroll.y - dimensions.top - view.dimensions.height;
	}

	return view.scroll.y - dimensions.top;
};

/**
 * Helper factory determining if an element should be redrawn
 *
 * @param {object} rect: an elements boundingClientRect.
 * @param {object} view: view object containing window pageYoffset and innerheight
 * @return {boolean} deciding if an element should be redrawn.
 */
const shouldRedraw = (rect, view) => {
	const elementTopOverWindowBottom = (rect.top - view.scroll.y) < 0;
	const elementBottomOverWindowTop = (rect.bottom + view.dimensions.height - view.scroll.y) > 0;

	return elementTopOverWindowBottom && elementBottomOverWindowTop;
};

/**
 * Function initiating tracked elements callback and exposing
 * needed parameters if their condition(s) are met.
 */
export default () => {
	for (let i = trackList.length - 1; i >= 0; i--) {
		const item = trackList[i];
		let initiateCallback = false;

		if (typeof item.config.shouldRedraw !== 'undefined') {
			if (typeof item.config.shouldRedraw === 'function') {
				initiateCallback = item.config.shouldRedraw(item.dimensions, viewport);
			} else {
				initiateCallback = Boolean(item.config.shouldRedraw);
			}
		} else {
			initiateCallback = shouldRedraw(item.dimensions, viewport);
		}

		if (initiateCallback) {
			item.callback(
				calculateScrolled(item.dimensions, viewport),
				item.dimensions,
				viewport);
		}
	}
};