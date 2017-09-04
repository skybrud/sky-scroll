const isServer = typeof window === 'undefined';

/**
 * Global array containing alle tracked elements
 */
const trackList = [];

/**
 * Global object containing all relevant window information
 */
const viewport = {
	scroll: null,
	dimensions: null,
};

if (!isServer) {
	viewport.scroll = {
		y: window.pageYOffset,
	};

	viewport.dimensions = {
		height: window.innerHeight,
	};
}

export {
	trackList,
	viewport,
	isServer,
};
