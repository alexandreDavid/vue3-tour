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
      because it`s ID is 'v-step-0'.
    </div>
    <div class="v-step-1">
      A DOM element on your page. The second step will pop on this element
      because it`s class is 'v-step-1'.
    </div>
    <div data-v-step="2">
      A DOM element on your page. The third step will pop on this
      element because it has property 'data-v-step' with value="2".
    </div>
    <div ref="forthStep">
      A DOM element on your page. The forth step will pop on this
      element because it is selected by ref 'forthStep'. Click on button to go to next step.
      <br/><br/>
      <button type="button" @click.prevent="loadAjaxData" class="button">
        Load data to continue tour
      </button>
    </div>
    <div ref="fifthStep">
      A DOM element on your page. The firth and final step will pop on this
      element because it is selected by ref 'fifthStep'. Loaded content:
      <br/><br/>
      <strong>
        {{fifthStepLoadedByFourthStep || 'Content not loaded'}}
      </strong>
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
  .button {
    margin: 0rem;
    padding: 0.5rem 1rem;
    border: 0;
    background: #0aa;
    font-weight: bold;
    color: #fff;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background: #0bb;
    }
  }
</style>
<script lang="ts">
  import { ref } from 'vue'

  export default {
    name: 'my-tour',
    setup() {
      const forthStep = ref(null)
      const fifthStep = ref(null)
      const fifthStepLoadedByFourthStep = ref(null)

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
          target: forthStep, // ref to DOM element
          content:
            'And also you can integrate plugin into your Vue app more smoothly by using refs.',
          params: {
            placement: 'bottom',
          },
        },
        {
          target: fifthStep,
          content:
            'Here content is loaded by AJAX request and is visible only after needed event.',
          before: type => new Promise(function (resolve, reject) {
            if (type != 'next' || fifthStepLoadedByFourthStep.value) {
              resolve(true)
            } else {
              alert('At first load content for next step by clicking on button above')
              reject(false)
            }
          }.bind(this))
        },
      ]

      const options = ref({
        highlight: false,
        backdrop: true,
        useKeyboardNavigation: true,
        debug: true,
        startTimeout: 0,
      })

      return { steps, options, forthStep, fifthStep, fifthStepLoadedByFourthStep }
    },
    methods: {
      async loadAjaxData() {
        const response = await window.fetch('https://v2.jokeapi.dev/joke/Programming?type=single', {
          method: 'GET',
          headers: {
            'content-type': 'application/json;charset=UTF-8',
          },
        })

        const data = await response.json()
        if (response.ok) {
          this.fifthStepLoadedByFourthStep = data?.joke || 'Did not find joke'
        } else {
          this.fifthStepLoadedByFourthStep = 'Error of joke loading'
        }
      }
    },
    mounted: function () {
      //this.$tours['myTour'].start()
    },
  };
</script>
