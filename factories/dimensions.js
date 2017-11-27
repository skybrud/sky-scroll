/**
 * Factory returning a object containing width & height + absoulte top and bottom
 *
 * @param {object} rect: an elements boundingClientRect.
 * @param {object} view: view object containing window pageYoffset and innerheight
 * @return {object} elements width, height and absolute top and bottom position from document top
 */

export default (rect, view) => ({
	top: rect.top + view.scroll.y,
	bottom: rect.top + rect.height + view.scroll.y,
	height: rect.height,
	width: rect.width,
});
