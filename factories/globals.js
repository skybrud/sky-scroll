const isServer = typeof window === 'undefined';

/**
 * Global array containing alle tracked elements
 */
const trackList = [];

export {
	trackList,
	isServer,
};
