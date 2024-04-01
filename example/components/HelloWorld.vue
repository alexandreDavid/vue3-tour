<template>
  <h1>{{ msg }}</h1>

  <p>
    <a href="https://coodde.com" target="_blank">Coodde Portal</a> |
    <a href="https://github.com/coodde" target="_blank">Coodde GitHub</a>
  </p>
  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank"
      >Vite Documentation</a
    >
    | <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a> |
    <a href="https://v3.vuejs.org/" target="_blank"
      >Coodde Vue 3 Tour Repository</a
    >
  </p>

  <button @click="$tours['myTour'].start()">Start Tour</button>
</template>

<script setup>
  import { defineProps } from 'vue';

  defineProps({
    msg: String,
  });
</script>

<style lang="scss" scoped>
  a {
    color: #0aa;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  button {
    margin: 1rem;
    padding: 1rem 2rem;
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
