<template>
  <div class="options">
    <h4>Options</h4>
    <p>
      <label for="option-highlight">
        <input
          type="checkbox"
          v-model="options.highlight"
          id="option-highlight"
        />
        Highlight
      </label>
    </p>
    <p>
      <label for="option-backdrop">
        <input
          type="checkbox"
          v-model="options.backdrop"
          id="option-backdrop"
        />
        Backdrop
      </label>
    </p>
    <p>
      <label for="option-useKeyboardNavigation">
        <input
          type="checkbox"
          v-model="options.useKeyboardNavigation"
          id="option-useKeyboardNavigation"
        />
        Use Keyboard Navigation
      </label>
    </p>
    <p>
      <label for="option-debug">
        <input type="checkbox" v-model="options.debug" id="option-debug" />
        Debug
      </label>
    </p>
    <p>
      <label for="option-startTimeout">
        Start Timeout (ms) &nbsp;&nbsp;&nbsp;
        <input
          type="number"
          v-model="options.startTimeout"
          id="option-startTimeout"
        />
      </label>
    </p>
  </div>
  <div class="v-steps">
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
    <div ref="lastStep">
      A DOM element on your page. The third and final step will pop on this
      element because its ID is 'v-step-2'.
    </div>

    <v-tour name="myTour" :steps="steps" :options="options"></v-tour>
  </div>
</template>
<style lang="scss">
  .v-steps {
    > div {
      margin: 330px auto;
      padding: 10px;
      width: 50%;
    }
  }
  .options {
    text-align: left;
    width: 400px;
    margin-left: auto;
    margin-right: auto;

    input {
      padding: 4px;
    }
  }
</style>
<script>
  import { ref } from 'vue';

  export default {
    name: 'my-tour',
    setup() {
      const lastStep = ref(null);

      const steps = [
        {
          target: '#v-step-0', // We're using document.querySelector() under the hood
          header: {
            title: 'Get Started',
          },
          content: `Discover <strong>Vue Tour</strong>!`,
        },
        {
          target: '.v-step-1',
          content: 'An awesome plugin made with Vue.js!',
        },
        {
          target: '[data-v-step="2"]',
          content:
            "Try it, you'll love it!<br>You can put HTML in the steps and completely customize the DOM to suit your needs.",
          params: {
            placement: 'top', // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
          },
        },
        {
          target: lastStep, // ref to DOM element
          content:
            'And also you can integrate plugin into your Vue app more smoothly by using refs.',
        },
      ];

      const options = ref({
        highlight: false,
        backdrop: true,
        useKeyboardNavigation: true,
        debug: true,
        startTimeout: 0,
      });

      return { steps, options, lastStep };
    },
    mounted: function () {
      //this.$tours['myTour'].start()
    },
  };
</script>
