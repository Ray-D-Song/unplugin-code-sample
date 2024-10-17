import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import type { Options } from './types'

const defaultInclude = [
  '**/*.vue',
  '**/*.jsx',
  '**/*.tsx',
  '**/*.astro',
  '**/*.svelte',
  '**/*.html',
]

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options = {}) => {

  return {
    name: 'vite-plugin-code-sample',
    transformInclude(id) {
      return filter(options)(id)
    },
    transform(code, id) {
      return transform(code, id, options)
    }
  }
}

export function filter(options: Options): (id: string) => boolean {
  return createFilter(
    options.include || defaultInclude,
    options.exclude
  )
}

export function transform(code: string, id: string, options?: Options): string {
  if (/<code-sample/.test(code)) {
    const removeInProd = options?.removeInProd ?? true
    if (removeInProd && process.env.NODE_ENV === 'production') {
      // remove all code-sample tags in production
      return code.replace(/<code-sample[^>]*>[\s\S]*?<\/code-sample>/g, '')
    }
    const fileContent = fs.readFileSync(id, 'utf-8')
    const base64Content = Buffer.from(fileContent).toString('base64')
    return code.replace(/<code-sample/g, `<code-sample data-sample-code="${base64Content}"`)
  }
  return code
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
