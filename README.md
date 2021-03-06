# SkyScroll
> A Vue plugin for scroll/resize events and calculations.

## Description
This plugin exposes a handful of useful properties on all Vue instances, including scroll y and x position, window height and width as well as document height and width.

## Installation
```bash
npm install sky-scroll
```
or
```bash
yarn add sky-scroll
```

## Usage
Import and install SkyScroll:
```js
import Vue from 'vue';
import SkyScroll from 'sky-scroll';

Vue.use(SkyScroll);

```

`$SkyScroll` is available on any Vue instance and exposes a number of useful scroll-related properties.

**In a component template:**
```html
<div class="example-component">
    <span>{{$SkyScroll.scroll.y}}</span>
    <span>{{$SkyScroll.scroll.x}}</span>
    <span>{{$SkyScroll.scroll.deltaY}}</span>
    <span>{{$SkyScroll.scroll.directionY}}</span>
    <span>{{$SkyScroll.scroll.last.y}}</span>
    <span>{{$SkyScroll.window.width}}</span>
    <span>{{$SkyScroll.document.height}}</span>
</div>
```

**In the component $SkyScroll prop, a few options and scroll and resize callbacks are also available:**
```js
export default {
    name: 'ExampleComponent',
    data() {
        // ...
    },
    methods: {
        // ...
    },
    $SkyScroll: {
        // scroll [function]
        // Callback for scroll event
        scroll({ scroll, window, document }) {
            console.log('scroll y', scroll.y);
            console.log('scroll last y', scroll.last.y);
            console.log('scroll direction y', scroll.directionY);
            console.log('window width', window.width);
            console.log('document height', document.height);
        },
        // resize [function]
        // Callback for resize event
        resize({ scroll, window, document }) {
            console.log('scroll x', scroll.x);
            console.log('window width', window.width);
            console.log('document height', document.height);
        },
        // onMounted [boolean] - default: true
        // If true scroll and resize callbacks a executed on component mount
        onMounted: true.
        // dimensions [boolean] - default: false
        // Determines if SkyScroll should keep track of $el dimensions. If true
        // this.$dimensions will be added to the instance, which holds the
        // boundingClientRect of this.$el - and automatically keeps it up to
        // date on resize.
        dimensions: false,
    },
};
```

# Credits
This module is made by the Frontenders at [skybrud.dk](http://www.skybrud.dk/). Feel free to use it in any way you want. Feedback, questions and bugreports should be posted as issues. Pull-requests appreciated!
