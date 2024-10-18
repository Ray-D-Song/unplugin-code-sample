import type { MetaLine } from '../types'
import { check } from './check'

function processTruncate(code: MetaLine[], options: [number, number][], length: number): MetaLine[] {
  if (options.length === 0) {
    return code
  }
  const { valid, message } = check(code, options, length)
  if (!valid) {
    throw new Error(message)
  }

  // sort by start
  options.sort((a, b) => a[0] - b[0])

  let newCode: MetaLine[] = []
  for (const [start, end] of options) {
    newCode = newCode.concat(code.slice(start-1, end))
  }
  return newCode
}

export {
  processTruncate
}