<template>
  <h1>{{ msg }}</h1>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite Documentation</a> |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>

  <button @click="$tours['myTour'].start()">Start tour</button>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  msg: String
})
</script>

<style scoped>
a {
  color: #42b983;
}

button {
  margin-bottom: 1rem;
}
</style>