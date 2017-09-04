import 'core-js/fn/array/find-index';
import { isServer } from './factories/globals';
import Recalculate from './factories/recalculate';
import { track, untrack, on, off } from './factories/tracking';
import Redraw from './factories/redraw';

/**
 * Service providing automatic custom callbacks on elements while they are in view.
 */

//Recalc when everything is loaded and only if window exists.
if (!isServer) {
	window.onload = () => {
		Recalculate();
	};
	window.onload();
}

export default {
	on,
	off,
	track,
	untrack,
	recalculate: Recalculate,
	redraw: Redraw,
};
