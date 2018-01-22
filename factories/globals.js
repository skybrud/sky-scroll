/**
 * Global array containing alle tracked elements
 */
const trackList = [];

const isServer = typeof window === 'undefined';

const $window = isServer ? {} : window;

export {
	trackList,
	isServer,
	$window,
};
