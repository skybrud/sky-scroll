# sky-scroll
> JS service providing the engine for scroll based events

## Usage
Import sky-scroll in your project and all the hooks are available immediately. You have 6 hooks that can be used: _track, untrack, on, off, redraw, recalculate_.
Recommed implementation (used as base for this readme) is:
`import SkyScroll from 'sky-scroll';`

the following will take you through the diffenrent ways to use sky-scroll adding one piece of information after the other.

### SkyScroll.on();
Simple hook that binds a callback function to `document.body` which will fire on every scroll. Callbacks can be stacked, by calling `SkyScroll.on(...)` multiple times. (`SkyScroll.on` is derived from `SkyScroll.track`)
```JS
SkyScroll.on(callback(scrolled, dimensions, viewport) {
    // Your desired action on scroll
    // scrolled: distance the element has travelled because of user scroll
    // dimensions: Elements width and height + elements absolute top and bottom distance from document top.
    // viewport: Window information (pageYOffset, innerheight)
});
```

### SkyScroll.off();
Hook to remove either only one callback or all callbacks on `document.body`. (`SkyScroll.off` is derived from `SkyScroll.untrack`)
```JS
SkyScroll.off(); // removes all callbacks
SkyScroll.off(specificCallback); // removes specificCallback only
```

### SkyScroll.track();
Hook to track a specific element, which provides the most costomisable behaviour.
```JS
SkyScroll.track(
    callback(scrolled, dimensions, viewport) {},
    {
        shouldRedraw: () => {
            // Your desired custom rules for when the elements should have it's callback fired
            // Default is: "fire callback when ANY part of element is in the viewport"
        },
        onResize: () => {
            // Hook to add some custom cleanup before the resize recalculations are fired.
        },
    });
```

### SkyScroll.untrack();
Counterpart to `SkyScroll.track`. This hook is for removing all or one callback on a specific element.
```JS
SkyScroll.untrack(element); // removes all callbacks on element
SkyScroll.untrack(element, specificCallback); // removes specificCallback only on parsed element
```

### SkyScroll.redraw();
Hook for manually fire all callbacks bound to elements which conditions for a redraw have been met.
```JS
SkyScroll.redraw();
```

### SkyScroll.recalculate();
Hook for manually recalculate all elements currently hooked up to SkyScroll. This function will forcefully call `getBoundingClientRect`, recalc the elements absolute position relative to the document top.
```JS
SkyScroll.recalculate(); // recalculates every element throttled by requestAnimationFrame
SkyScroll.recalculate(null, true); // recalculates every element unthrottled
SkyScroll.recalculate(element); // recalculates only the specified element;
```

# Credits
This module is made by the Frontenders at [skybrud.dk](http://www.skybrud.dk/). Feel free to use it in any way you want. Feedback, questions and bugreports should be posted as issues. Pull-requests appreciated!
