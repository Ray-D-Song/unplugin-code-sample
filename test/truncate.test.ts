import { describe, expect, it } from 'vitest'
import { processTruncate } from '../src/libs/truncate'

describe('truncate', () => {
  it('should truncate code', () => {
    const code = 'const a = 1\nconst b = 2\nconst c = 3'
    const options: [number, number][] = [[1, 2]]
    const metaLines = code.split('\n').map((content, index) => ({
      lineNum: index + 1,
      content
    }))
    const result = processTruncate(metaLines, options, metaLines.length)
    expect(result.map(line => line.content).join('\n')).toBe('const a = 1\nconst b = 2')
  })
})
