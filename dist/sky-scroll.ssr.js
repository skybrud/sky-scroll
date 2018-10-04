'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _throttle = _interopDefault(require('lodash.throttle'));

var SkyScrollPlugin = {
	install: function install(Vue, options) {
		var _defaults = {
			throttle: 0,
		};
		var config = Object.assign({}, _defaults, options);

		var _vm = new Vue({
			data: function data() {
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
			created: function created() {
				this.$on('recalculate', this._recalculateHandler);
			},
			methods: {
				_scrollHandler: function _scrollHandler() {
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
				_resizeHandler: function _resizeHandler() {
					this.window.width = window.innerWidth;
					this.window.height = window.innerHeight;
					this.document.height = document.documentElement.scrollHeight;
					this.document.width = document.documentElement.scrollWidth;
					this._emitResize();
				},
				_emitScroll: function _emitScroll() {
					this.$emit('scroll', {
						scroll: this.scroll,
						window: this.window,
						document: this.document,
					});
				},
				_emitResize: function _emitResize() {
					this.$emit('resize', {
						scroll: this.scroll,
						window: this.window,
						document: this.document,
					});
				},
				_recalculateHandler: function _recalculateHandler(type) {
					if ( type === void 0 ) type = '';

					if (!type || type === 'resize') {
						this._resizeHandler.bind(this)();
					}
					if (!type || type === 'scroll') {
						this._scrollHandler.bind(this)();
					}
				},
			},
		});

		var $SkyScroll = {};

		Object.defineProperties($SkyScroll, {
			scroll: {
				enumerable: true,
				get: function get() {
					return _vm.$data.scroll;
				},
			},
			window: {
				enumerable: true,
				get: function get() {
					return _vm.$data.window;
				},
			},
			document: {
				enumerable: true,
				get: function get() {
					return _vm.$data.document;
				},
			},
			on: {
				enumerable: true,
				get: function get() {
					return _vm.$on.bind(_vm);
				},
			},
			once: {
				enumerable: true,
				get: function get() {
					return _vm.$once.bind(_vm);
				},
			},
			off: {
				enumerable: true,
				get: function get() {
					return _vm.$off.bind(_vm);
				},
			},
			emit: {
				enumerable: true,
				get: function get() {
					return _vm.$emit.bind(_vm);
				},
			},
		});

		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', function () { return $SkyScroll.emit('recalculate', 'scroll'); });
			window.addEventListener('resize', _throttle(function () { return $SkyScroll.emit('recalculate', 'resize'); }, config.throttle));
			window.addEventListener('orientationchange', function () { return $SkyScroll.emit('recalculate', 'resize'); });
			$SkyScroll.emit('recalculate');
		}


		// We implement a global mixin, that enables easy $SkyScroll config on any component
		Vue.mixin({
			$SkyScroll: {
				onMounted: true, // Run scroll and resize functions on mounted by default
			},
			beforeCreate: function beforeCreate() {
				var this$1 = this;

				// Setup reactive $SkyScroll, $scroll and $window variables on instance
				Vue.util.defineReactive(this, '$SkyScroll', $SkyScroll);
				Vue.util.defineReactive(this, '$scroll', $SkyScroll.scroll);
				Vue.util.defineReactive(this, '$window', $SkyScroll.window);

				// Prepare _skyScroll - it will be used as a container object for various
				// under the hood stuff
				this._skyScroll = {};

				// Get any options from custom $SkyScroll prop on instance
				var ref = this.$options.$SkyScroll;
				var scrollFn = ref.scroll;
				var resizeFn = ref.resize;
				var dimensions = ref.dimensions;

				// If $SkyScroll.dimensions boolean is true:
				// Keep track of root element dimensions on this.$dimensions
				if (dimensions) {
					// Setup $dimensions object on instance + make reactive
					this.$dimensions = {
						top: 0,
						bottom: 0,
						left: 0,
						right: 0,
						width: 0,
						height: 0,
					};
					Vue.util.defineReactive(this, '$dimensions', this.$dimensions);

					// Setup recalculate method on resize
					this._skyScroll.recalculateDimensions = function () {
						var bounds = this$1.$el.getBoundingClientRect();
						var dim = {
							top: bounds.top + this$1.$scroll.y,
							bottom: bounds.top + this$1.$scroll.y,
							left: bounds.left + this$1.$scroll.x,
							right: bounds.right + this$1.$scroll.x,
							width: bounds.width,
							height: bounds.height,
						};
						this$1.$set(this$1, '$dimensions', dim);
						return dim;
					};
					this.$SkyScroll.on('resize', this._skyScroll.recalculateDimensions);
				}

				// If $SkyScroll.scroll function on instance:
				if (typeof scrollFn === 'function') {
					// 1) Assign to _skyScroll so we keep track of it.
					// 2) Make sure to bind(this) so this.whatever still works inside
					this._skyScroll.scrollFn = scrollFn.bind(this);
					this.$SkyScroll.on('scroll', this._skyScroll.scrollFn);
				}

				// If $SkyScroll.resize function on instance:
				if (typeof resizeFn === 'function') {
					// 1) Assign to _skyScroll so we keep track of it.
					// 2) Make sure to bind(this) so this.whatever still works inside
					this._skyScroll.resizeFn = resizeFn.bind(this);
					this.$SkyScroll.on('resize', this._skyScroll.resizeFn);
				}
			},
			mounted: function mounted() {
				// Always calc dimensions when component is mounted
				if (this.$dimensions) {
					this._skyScroll.recalculateDimensions();
				}

				// Trigger scroll and resize on mounted if the onMounted option is true
				// (it is by default)
				if (this.$options.$SkyScroll.onMounted !== false) {
					// $SkyScroll is a global instance by design - so it cannot trigger
					// scroll or resize events whenever a component mounts - so we need
					// to do it on each component manually (with the right arguments)
					if (typeof this._skyScroll.scrollFn === 'function') {
						this._skyScroll.scrollFn({
							scroll: this.$SkyScroll.scroll,
							window: this.$SkyScroll.window,
							document: this.$SkyScroll.document,
						});
					}
					if (typeof this._skyScroll.resizeFn === 'function') {
						this.$SkyScroll.on('resize', this._skyScroll.resizeFn);
						this._skyScroll.resizeFn({
							scroll: this.$SkyScroll.scroll,
							window: this.$SkyScroll.window,
							document: this.$SkyScroll.document,
						});
					}
				}
			},
			beforeDestroy: function beforeDestroy() {
				// Clean up all $SkyScroll listeners that has been set on component destroy
				if (this.$dimensions) {
					this.$SkyScroll.off('resize', this._skyScroll.recalculateDimensions);
				}

				if (typeof this._skyScroll.scrollFn === 'function') {
					this.$SkyScroll.off('scroll', this._skyScroll.scrollFn);
				}
				if (typeof this._skyScroll.resizeFn === 'function') {
					this.$SkyScroll.off('resize', this._skyScroll.resizeFn);
				}
			},
		});
	},
};

exports.default = SkyScrollPlugin;
