# SkyScroll
> A vanilla JS library for scroll based events.

## Description
Lightweight JavaScript (es2015) library providing one single api for handling scroll events as well as tracking the positions and dimensions of multiple elements on scroll (with recalculations on resize).

## Usage
Import SkyScroll in your project. Recommed implementation (used as base for this readme) is:
```JS
import SkyScroll from 'sky-scroll';
```

SkyScroll provides 7 methods that can be used:
- [`on()`](#on)
- [`off()`](#off)
- [`track()`](#track)
- [`untrack()`](#untrack)
- [`recalculate()`](#recalculate)
- [`redraw()`](#redraw)
- [`setContainer()`](#setcontainer)

### .on()
`SkyScroll.on(callback)`

Execute a callback function on every scroll. By calling `on()` multiple times multiple callbacks can be added (executed on the same scroll event under the hood).
```JS
SkyScroll.on((scrolled, dimensions, viewport) => {
    // scrolled: distance the page has scrolled
    // dimensions: dimensions of document.body
    // viewport: window information - scroll along X or Y axis + window dimensions
});
```

### .off()
`SkyScroll.off(callback[optional])`

Remove all callbacks added by [`on()`](#on) or just a specific callback if the function is provided.
```JS
SkyScroll.off(); // removes all callbacks
SkyScroll.off(specificCallback); // removes specificCallback only
```

### .track()
`SkyScroll.track(element, callback, config[optional])`

Track a specific element. After the callback a config object can be provided with the following methods:
```JS
SkyScroll.track(
    // Element to track
    element,
    // Callback function
    (scrolled, dimensions, viewport) => {
        // scrolled: distance the element has travelled due to page scroll
        // dimensions: dimensions of the element
        // viewport: window information - scroll along X or Y axis + window dimensions
    },
    // Config
    {
        shouldRedraw: (dimensions, viewport) => {
            // Return boolean for whether or not the callback function should be executed on scroll
            // Default: "fire callback when ANY part of element is visible in the viewport"
        },
        onResize: () => {
            // Hook to add some custom cleanup before the resize recalculations are fired.
            // This could be inline styling that conflicts with the recalculations of element dimensions SkyScroll does on resize
        },
    });
```

### .untrack()
`SkyScroll.untrack(element, callback[optional])`

Counterpart to [`track()`](#track). Removes all or one callback on a specific element.
```JS
SkyScroll.untrack(element); // removes all callbacks on element
SkyScroll.untrack(element, specificCallback); // removes specificCallback only on parsed element
```

### .recalculate()
`SkyScroll.recalculate(element[optional], immediate[optional])`

Manually recalculate a specific or all elements currently hooked up to SkyScroll. This function will forcefully call `getBoundingClientRect` and recalculate the absolute position relative to the document top of all elements. This is useful in instances where you are changing the layout of the page elsewhere (accordions opening etc.) and want to recalculate all element dimensions SkyScroll is currently keeping track of.

To avoid unescessary overhead this method is throttled by requestAnimationFrame by default (so multiple recalculations aren't triggered simultaneously). If you desire to recalculate immediately and not on the next tick, this behaviour can be overwritten by parsing the `immediate` argument as `true`.

This method finishes by triggering a forced redraw on all tracked elements (the equivalent of [`redraw(true)`](#redraw)).
```JS
SkyScroll.recalculate(); // recalculates all elements - throttled by default
SkyScroll.recalculate(element); // recalculates only a specific element;
SkyScroll.recalculate(null, true); // recalculates all elements unthrottled
```

### .redraw()
`SkyScroll.redraw(forceAll[optional])`

Manually fire all callbacks bound to elements which conditions for a redraw have been met. By default this is executed on scroll and resize (through [`recalculate()`](#recalculate)), which should cover most (if not all) use cases, but if you ever need to execute all callbacks manually this method is provided.

By passing true as argument a redraw will be forced upon all elements, not just those that are in view. _Note that this type of redraw also bypasses `shouldRedraw` in configs of all tracked elements._
```JS
SkyScroll.redraw(); // redraw all elements in viewport - called on scroll by default
SkyScroll.redraw(true); // redraw all elements regardless of visibility - called with recalculate() by default
```

### .setContainer()
`SkyScroll.setContainer(element)`

In rare instances your page might not be scrolling inside `body` in the traditional sense, but rather inside a `div` with `overflow-y: scroll;` or similar. Using this method you can reassign the scroll event to a DOM element instead of `window`. For instance, this can be useful for pages using [this performant parallaxing method](https://developers.google.com/web/updates/2016/12/performant-parallaxing) using only CSS.
```JS
SkyScroll.setContainer(element);
```

# Credits
This module is made by the Frontenders at [skybrud.dk](http://www.skybrud.dk/). Feel free to use it in any way you want. Feedback, questions and bugreports should be posted as issues. Pull-requests appreciated!
