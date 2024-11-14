import process from "node:process";
import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";
import { createFilter } from "@rollup/pluginutils";
import type { Options } from "./types";
import { rewrite, handleRemoveInProd } from "./libs/htmlrewriter";

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
    async transform(code, id) {
      return await transform(code, id, options);
    },
  };
};

export function filter(options: Options): (id: string) => boolean {
  return createFilter(options.include || defaultInclude, options.exclude);
}

export async function transform(code: string, id: string, options?: Options): Promise<string> {
  const tagNames = options?.tagName
    ? options.tagName.concat(defaultTagName)
    : defaultTagName;

  if (tagNames.length === 0) {
    return code;
  }

  let hasMatch = false;
  tagNames.forEach((tagName) => {
    if (code.includes(tagName)) {
      hasMatch = true;
    }
  });

  if (!hasMatch) {
    return code;
  }

  const removeInProd = options?.removeInProd ?? true;
  if (removeInProd && process.env.NODE_ENV === "production") {
    return await handleRemoveInProd(code, { tagNames });
  }

  return await rewrite(code, { fileContent: code, tagNames });
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
