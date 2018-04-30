import _throttle from 'lodash.throttle';

const SkyScrollPlugin = {
	install(Vue, options) {
		const _defaults = {
			throttle: 0,
		};
		const config = Object.assign({}, _defaults, options);

		const _vm = new Vue({
			data() {
				return {
					scroll: {
						x: 0,
						y: 0,
						deltaX: 0,
						deltaY: 0,
						directionX: 0,
						directionY: 0,
						last: {
							x: 0,
							y: 0,
							deltaX: 0,
							deltaY: 0,
							directionX: 0,
							directionY: 0,
						},
					},
					window: {
						width: 0,
						height: 0,
					},
					document: {
						width: 0,
						height: 0,
					},
				};
			},
			created() {
				this.$on('recalculate', this._recalculateHandler);
			},
			methods: {
				_scrollHandler() {
					this.$set(this.scroll, 'last', {
						x: this.scroll.x,
						y: this.scroll.y,
						deltaX: this.scroll.deltaX,
						deltaY: this.scroll.deltaY,
						directionX: this.scroll.directionX,
						directionY: this.scroll.directionY,
					});
					this.scroll.x = window.pageXOffset;
					this.scroll.y = window.pageYOffset;
					this.scroll.deltaX = this.scroll.x - this.scroll.last.x;
					this.scroll.deltaY = this.scroll.y - this.scroll.last.y;
					this.scroll.directionX = (this.scroll.deltaX < 0) ? -1 : 1;
					this.scroll.directionY = (this.scroll.deltaY < 0) ? -1 : 1;
					if (this.scroll.y + this.window.height > this.document.height) {
						this.$emit('recalculate', 'resize');
					}
					this._emitScroll();
				},
				_resizeHandler() {
					this.window.width = window.innerWidth;
					this.window.height = window.innerHeight;
					this.document.height = document.documentElement.scrollHeight;
					this.document.width = document.documentElement.scrollWidth;
					this._emitResize();
				},
				_emitScroll() {
					this.$emit('scroll', {
						scroll: this.scroll,
						window: this.window,
						document: this.document,
					});
				},
				_emitResize() {
					this.$emit('resize', {
						scroll: this.scroll,
						window: this.window,
						document: this.document,
					});
				},
				_recalculateHandler(type = '') {
					if (!type || type === 'resize') {
						this._resizeHandler.bind(this)();
					}
					if (!type || type === 'scroll') {
						this._scrollHandler.bind(this)();
					}
				},
			},
		});

		const $SkyScroll = {};

		Object.defineProperties($SkyScroll, {
			scroll: {
				enumerable: true,
				get() {
					return _vm.$data.scroll;
				},
			},
			window: {
				enumerable: true,
				get() {
					return _vm.$data.window;
				},
			},
			document: {
				enumerable: true,
				get() {
					return _vm.$data.document;
				},
			},
			on: {
				enumerable: true,
				get() {
					return _vm.$on.bind(_vm);
				},
			},
			once: {
				enumerable: true,
				get() {
					return _vm.$once.bind(_vm);
				},
			},
			off: {
				enumerable: true,
				get() {
					return _vm.$off.bind(_vm);
				},
			},
			emit: {
				enumerable: true,
				get() {
					return _vm.$emit.bind(_vm);
				},
			},
		});

		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', () => $SkyScroll.emit('recalculate', 'scroll'));
			window.addEventListener('resize', _throttle(() => $SkyScroll.emit('recalculate', 'resize'), config.throttle));
			window.addEventListener('orientationchange', () => $SkyScroll.emit('recalculate', 'resize'));
			$SkyScroll.emit('recalculate');
		}

		Vue.prototype.$SkyScroll = $SkyScroll;

		Vue.mixin({
			$SkyScroll: {},
			beforeCreate() {
				this._skyScroll = {};
				Vue.util.defineReactive(this, '$SkyScroll', $SkyScroll);
				Vue.util.defineReactive(this, '$scroll', $SkyScroll.scroll);
				Vue.util.defineReactive(this, '$window', $SkyScroll.window);
				const { dimensions } = this.$options.$SkyScroll;
				if (dimensions) {
					this.$dimensions = {
						top: 0,
						bottom: 0,
						left: 0,
						right: 0,
						width: 0,
						height: 0,
					};
					Vue.util.defineReactive(this, '$dimensions', this.$dimensions);
					this._skyScroll = {
						recalculateDimensions: () => {
							const bounds = this.$el.getBoundingClientRect();
							const dim = {
								top: bounds.top + this.$scroll.y,
								bottom: bounds.top + this.$scroll.y,
								left: bounds.left + this.$scroll.x,
								right: bounds.right + this.$scroll.x,
								width: bounds.width,
								height: bounds.height,
							};
							this.$set(this, '$dimensions', dim);
							return dim;
						},
					};
				}
			},
			mounted() {
				const {
					scroll: scrollFn,
					resize: resizeFn,
					dimensions,
				} = this.$options.$SkyScroll;

				if (dimensions) {
					this.$SkyScroll.on('resize', this._skyScroll.recalculateDimensions);
					this._skyScroll.recalculateDimensions();
				}

				if (typeof scrollFn === 'function') {
					this.$SkyScroll.on('scroll', scrollFn.bind(this));
					scrollFn.bind(this)({
						scroll: this.$SkyScroll.scroll,
						window: this.$SkyScroll.window,
						document: this.$SkyScroll.document,
					});
				}
				if (typeof resizeFn === 'function') {
					this.$SkyScroll.on('resize', resizeFn.bind(this));
					this.$options.$SkyScroll.resize.bind(this)({
						scroll: this.$SkyScroll.scroll,
						window: this.$SkyScroll.window,
						document: this.$SkyScroll.document,
					});
				}
			},
		});
	},
};

export default SkyScrollPlugin;
