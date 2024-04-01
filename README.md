# Coodde :: Vue3 Tour

Forked from [vue-tour](https://github.com/pulsardev/vue-tour) / [vue3-tour](https://github.com/alexandreDavid/vue3-tour)

> Coodde Vue Tour is a lightweight, simple and customizable tour plugin for use with Vue 3.
> It provides a quick and easy way to guide your users through your application.

[![Vue Tour](./screenshot.gif 'Vue Tour')](https://coodde.github.io/vue3-tour/)

## Table of Contents

- [Fork changes](#fork-changes)
- [Browsers support](#browsers-support)
- [Getting Started](#getting-started)
- [Something Missing?](#something-missing)

## Fork Changes

This fork have several changes to main package and its adaptation for Vue3:

- Migrated to TypeScript
- Fixed bugs
- Added strict types
- Added ESLint + Prettier
- Extended example page (with options)
- Added following functionality
  - added `backdrop` property - background for better highlighting of active element
  - step's `target` property now could be also ref (not only css selector)

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| determining | determining | determining | determining | determining |

## Getting Started

You can install `coodde-vue3-tour` using npm or by downloading the minified build on GitHub.

```
npm install coodde-vue3-tour
```

Then import the plugin in your application entry point (typically main.ts if you used vue-cli to scaffold your project) and tell Vue to use it.
Also don't forget to include the styles. You can add the styles provided by default or customize them to your own liking.

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import Vue3Tour from 'vue3-tour';

import 'vue3-tour/dist/vue3-tour.css';

const app = createApp(App);

app.use(Vue3Tour);

app.mount('#app');
```

Finally put a `v-tour` component in your template anywhere in your app (usually in App.vue) and pass it an array of steps.
The `target` property of each step can target a DOM element in any component of your app (as long as it exists in the DOM when the concerned step pops up).

```html
<template>
  <div>
    <div id="v-step-0">
      A DOM element on your page. The first step will pop on this element
      because its ID is 'v-step-0'.
    </div>
    <div class="v-step-1">
      A DOM element on your page. The second step will pop on this element
      because its ID is 'v-step-1'.
    </div>
    <div data-v-step="2">
      A DOM element on your page. The third and final step will pop on this
      element because its ID is 'v-step-2'.
    </div>

    <v-tour name="myTour" :steps="steps"></v-tour>
  </div>
</template>

<script>
  export default {
    name: 'my-tour',
    data() {
      return {
        steps: [
          {
            target: '#v-step-0', // We're using document.querySelector() under the hood
            header: {
              title: 'Get Started',
            },
            content: `Discover <strong>Vue Tour</strong>!`,
          },
          {
            target: '.v-step-1',
            content: 'An awesome plugin made with Vue!',
          },
          {
            target: '[data-v-step="2"]',
            content:
              "Try it, you'll love it!<br>You can put HTML in the steps and completely customize the DOM to suit your needs.",
            params: {
              placement: 'top', // Any valid Popper placement. See https://popper.js.org/popper-documentation.html#Popper.placements
            },
          },
        ],
      };
    },
    mounted: function () {
      this.$tours['myTour'].start();
    },
  };
</script>
```

For all individual elements you want to add a step on, make sure it can be retrieved with `document.querySelector()`. You can use any selector, an ID, a CSS class, data attributes, etc. Also you can use reference on element (check example for more details).
Once this is done and your steps correctly target some DOM elements of your application, you can start the tour by calling the following method.

```javascript
this.$tours['myTour'].start();
```

For a more detailed documentation, checkout the [docs for vue-tour](https://github.com/pulsardev/vue-tour/wiki).

## `before()` UI step functions

If you need to do UI setup work before a step, there's a `before` function you may include in any/each of
your steps. This function will get invoked before the start/next/previous step is rendered. The function must return a promise. The function is invoked when `start`, `nextStep`, and `previousStep` are triggered. When the promise is rejected, it will not move to the next or previous step. If the promise is resolved then it will move in the direction specified.

It's used when you need to change what's shown on the screen between steps. For example, you may want to hide
one set of menus and open a screen or you want to perform an async operation. This is especially useful in single-page applications.

```javascript
steps: [
  {
    target: '#v-step-0', // We're using document.querySelector() under the hood
    content: `Discover <strong>Vue Tour</strong>!`,
    before: (type) =>
      new Promise((resolve, reject) => {
        // Time-consuming UI/async operation here
        resolve('foo');
      }),
  },
];
```

## Something Missing?

If you have a feature request or found a bug, [let us know](https://github.com/coodde/vue3-tour/issues) by submitting an issue.
