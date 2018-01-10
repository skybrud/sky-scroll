const isServer = typeof window === 'undefined';

/**
 * Global array containing alle tracked elements
 */
const trackList = [];

const $window = isServer ? {} : window;

export {
	trackList,
	isServer,
	$window,
};
