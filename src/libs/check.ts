import type { MetaLine } from '../types'

function check(code: MetaLine[], options: [number, number][], length: number): {
  valid: boolean
  message: string
} {
  // check if fold is valid
  for (const [start, end] of options) {
    if (start > end) {
      return {
        valid: false,
        message: `Invalid input: start ${start} > end ${end}`
      }
    }
  }
  // check if fold is in the code
  for (const [start, end] of options) {
    if (start > length || end > length) {
      return {
        valid: false,
        message: `Invalid input: start ${start} or end ${end} > length ${length}`
      }
    }
  }
  return {
    valid: true,
    message: ''
  }
}

export {
  check
}