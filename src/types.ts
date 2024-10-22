export interface Options {
  include?: string | string[];
  exclude?: string | string[];
  removeInProd?: boolean;
  tagName?: string[];
}

export interface MetaLine {
  lineNum: number;
  content: string;
}
