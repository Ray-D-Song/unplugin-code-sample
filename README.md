## unplugin-code-sample

This is a unplugin for displaying code samples of the current page, support multiple packers.  

## Features

- Support multiple packers: Vite, Webpack, Rollup, esbuild, etc.
- Automatically extract code from current page
- Optionally remove code samples in production environment
- Support custom include/exclude files

## Install

```bash
pnpm i unplugin-code-sample
```

## Usage

```js
// vite.config.js
import codeSample from 'unplugin-code-sample/vite'

export default defineConfig({
  plugins: [codeSample()],
})
```

> You should put `unplugin-code-sample` plugin before other plugins that process the code. 

```html
<!-- Place the tag in the file where you want to display the source code -->
<code-sample />
```

The plugin will encode the content of the file where the tag is located in base64, and then pass it as the `data-sample-code` attribute of the tag.

You can write a Vue component like this to use data:

```vue
<script setup lang="ts">
const props = defineProps<{
  dataSampleCode?: string
}>()

const code = atob(props.dataSampleCode ?? '')
</script>

<template>
  <pre><code>{{ code }}</code></pre>
</template>
```

React:  

```tsx
import React from 'react'

interface CodeSampleProps {
  dataSampleCode?: string
}

export default function CodeSample({ dataSampleCode }: CodeSampleProps) {
  const code = atob(dataSampleCode ?? '')
  return <pre><code>{code}</code></pre>
}
```

## Fold and Truncate

You can use `fold` and `truncate` to control the code sample.

```html
<!-- fold the code between line 1 and 2, and line 5 and 7 -->
<!-- truncate the code between line 3 and 4, and line 6 and 8 -->
<code-sample fold="[[1, 2], [5, 7]]" truncate="[[3, 4], [6, 8]]" />
```

## Options

```ts
export interface Options {
  /**
   * File path, support glob pattern
   *
   * @default ['**/*.vue', '**/*.jsx', '**/*.tsx', '**/*.astro', '**/*.svelte', '**/*.html']
   */
  include?: string | string[]

  exclude?: string | string[]

  /** 
   * Remove the code sample in production environment
   *
   * @default false
   */
  removeInProd?: boolean
}
```

## License

MIT
