<template>
  <img class="logo" alt="Coodde logo" src="./assets/coodde.png" />
  <img class="logo" alt="Vue logo" src="./assets/vue.png" />
  <HelloWorld msg="Coodde Vue 3 Tour example" />
  <Tour />
</template>

<script lang="ts" setup>
  import HelloWorld from './components/HelloWorld.vue';
  import Tour from './components/Tour.vue';
</script>
<style>
  body {
    background: #eee;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 100px;
  }
  .logo {
    height: 96px;
    margin: 0 16px;
  }
</style>
