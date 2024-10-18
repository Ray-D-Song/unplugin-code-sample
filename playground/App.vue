<script setup lang="ts">
import { ref } from 'vue'
import CodeSample from './components/CodeSample.vue'

const count = ref(0)
</script>

<template>
  <main class="container">
    <div class="content">
      <h1 class="title">Hello World</h1>
      <p class="count">Count: {{ count }}</p>
      <button @click="count++" class="btn">Increment</button>
    </div>
    <div class="code-sample">
      <code-sample fold="[[21, 65]]" truncate="[[8, 65]]"></code-sample>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.content {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.count {
  font-size: 1.2rem;
  color: #34495e;
}

.btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #3aa876;
}

.code-sample {
  background-color: #f8f8f8;
  padding: 1rem;
  border-radius: 4px;
}
</style>
