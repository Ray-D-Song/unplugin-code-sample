import fs from "node:fs";
import { Buffer } from "node:buffer";
import process from "node:process";
import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";
import { createFilter } from "@rollup/pluginutils";
import type { Options } from "./types";
import { processFold } from "./libs/fold";
import { processTruncate } from "./libs/truncate";

const defaultInclude = [
  "**/*.vue",
  "**/*.jsx",
  "**/*.tsx",
  "**/*.astro",
  "**/*.svelte",
  "**/*.html",
];

const defaultTagName = ["code-sample", "CodeSample", "codeSample"];

export const unpluginFactory: UnpluginFactory<Options | undefined> = (
  options = {}
) => {
  return {
    name: "vite-plugin-code-sample",
    transformInclude(id) {
      return filter(options)(id);
    },
    transform(code, id) {
      return transform(code, id, options);
    },
  };
};

export function filter(options: Options): (id: string) => boolean {
  return createFilter(options.include || defaultInclude, options.exclude);
}

export function transform(code: string, id: string, options?: Options): string {
  const tagName = options?.tagName
    ? options.tagName.concat(defaultTagName)
    : defaultTagName;
  const tagRegex = new RegExp(
    `<(${tagName.join("|")})([^>]*)>([\\s\\S]*?)<\\/\\1>`,
    "g"
  );

  if (tagRegex.test(code)) {
    const removeInProd = options?.removeInProd ?? true;
    if (removeInProd && process.env.NODE_ENV === "production") {
      // remove all code-sample tags in production
      return code.replace(tagRegex, "");
    }

    return code.replace(tagRegex, (match, tag, attributes, content) => {
      const fileSrcMatch = attributes.match(/source="([^"]+)"/);
      const fileContent = fileSrcMatch
        ? fs.readFileSync(fileSrcMatch[1], "utf-8")
        : fs.readFileSync(id, "utf-8");

      // 处理 fold 和 truncate 选项
      const foldOptRaw = attributes.match(/fold="([^"]+)"/);
      const truncateOptRaw = attributes.match(/truncate="([^"]+)"/);

      const foldOptions = foldOptRaw ? JSON.parse(foldOptRaw[1]) : [];
      const truncateOptions = truncateOptRaw
        ? JSON.parse(truncateOptRaw[1])
        : [];

      let metaLines = fileContent.split("\n").map((content, index) => ({
        lineNum: index + 1,
        content,
      }));
      const length = metaLines.length;

      // 处理 fold 和 truncate
      metaLines = processFold(metaLines, foldOptions, length);
      metaLines = processTruncate(metaLines, truncateOptions, length);

      const processedCode = metaLines.map((line) => line.content).join("\n");
      const base64Content = Buffer.from(processedCode).toString("base64");

      return `<${tag}${attributes} data-sample-code="${base64Content}">${content}</${tag}>`;
    });
  }
  return code;
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
