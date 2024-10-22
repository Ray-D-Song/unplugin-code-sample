import type { MetaLine } from "../types";
import { check } from "./check";

function processFold(
  code: MetaLine[],
  options: [number, number][],
  length: number
): MetaLine[] {
  if (options.length === 0) {
    return code;
  }
  const { valid, message } = check(code, options, length);
  if (!valid) {
    throw new Error(message);
  }
  options.forEach(([start, end]) => {
    // line start end
    // insert // ...
    const startIdx = code.findIndex((item) => item.lineNum === start);
    const endIdx = code.findIndex((item) => item.lineNum === end);
    code.splice(startIdx, endIdx - startIdx + 1, {
      lineNum: start,
      content: "// ...",
    });
  });
  return code;
}

export { processFold };
