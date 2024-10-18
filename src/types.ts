export interface Options {
  include?: string | string[]
  exclude?: string | string[]
  removeInProd?: boolean
}

export interface MetaLine {
  lineNum: number
  content: string
}
