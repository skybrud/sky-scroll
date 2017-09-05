# sky-scroll
> An vanilla JS engine for scroll based events.

## Description
Lightweight library providing one single api for handling scroll events as well as tracking the positions and dimensions of multiple elements on scroll (with recalculations on resize).

## Usage
Import sky-scroll in your project. Recommed implementation (used as base for this readme) is:
`import SkyScroll from 'sky-scroll';`

sky-scroll provides 7 methods that can be used:
- [on](#on)
- [off](#off)
- [track](#track)
- [untrack](#untrack)
- [recalculate](#recalculate)
- [redraw](#redraw)
- [setContainer](#setContainer)

The following paragraphs will take you through the diffenrent ways to use sky-scroll.

### .on()
`SkyScroll.on(callback, config[optional])`
Execute a callback function on every scroll. By calling `SkyScroll.on(...)` multiple times more callbacks can be added (executed on the same scroll event under the hood).
```JS
SkyScroll.on((scrolled, dimensions, viewport) => {
    // scrolled: distance the page has scrolled
    // dimensions: dimensions of document.body
    // viewport: window information - scroll along X or Y axis + window dimensions
}, configObject);
```
_Note: This method uses `track(document.body)` behind the scenes, so it shares the same api. Refer to `track()` for documentation on config object._

### .off()
`SkyScroll.off(callback[optional])`
Remove all callbacks added by `on()` or just a specific callback if the function is provided.
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
Counterpart to `SkyScroll.track`. Removes all or one callback on a specific element.
```JS
SkyScroll.untrack(element); // removes all callbacks on element
SkyScroll.untrack(element, specificCallback); // removes specificCallback only on parsed element
```

### .recalculate()
Manually recalculate all elements currently hooked up to SkyScroll. This function will forcefully call `getBoundingClientRect` and recalculate the absolute position relative to the document top of all elements. Useful for instances where you are changing the layout of the page elsewhere and want to recalculate everything (accordions opening etc.).
```JS
SkyScroll.recalculate(); // recalculates every element throttled by requestAnimationFrame
SkyScroll.recalculate(null, true); // recalculates every element unthrottled
SkyScroll.recalculate(element); // recalculates only the specified element;
```

### .redraw()
Manually fire all callbacks bound to elements which conditions for a redraw have been met. By default this is executed on scroll and resize by default, which should cover most (if not all) use cases, but if you ever need to execute all callbacks manually this method is provided.
```JS
SkyScroll.redraw();
```

### .setContainer()
`SkyScroll.setContainer(element)`
In rare instances your page might not be scrolling inside `body` in the traditional sense, but rather inside a `div` with `overflow-y: scroll;` or similar. Using this method you can reassign the scroll event to a DOM element instead of `window`. For instance, this can be useful for pages using [this performant parallaxing method](https://developers.google.com/web/updates/2016/12/performant-parallaxing) using only CSS.
```JS
SkyScroll.setContainer(element);
```

# Credits
This module is made by the Frontenders at [skybrud.dk](http://www.skybrud.dk/). Feel free to use it in any way you want. Feedback, questions and bugreports should be posted as issues. Pull-requests appreciated!
