<script setup lang="ts">
const props = defineProps<{
  dataSampleCode?: string
  fold?: string
  truncate?: string
}>()

const code = atob(props.dataSampleCode ?? '')
</script>

<template>
  <div class="code-sample">
    <h3 class="code-sample-title">Code Sample</h3>
    <pre><code>{{ code }}</code></pre>
  </div>
</template>
