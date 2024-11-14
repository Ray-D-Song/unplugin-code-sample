import { HTMLRewriter } from 'html-rewriter-wasm'
import { processFold } from './fold';
import { processTruncate } from './truncate';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function rewrite(html: string, opt: {
  fileContent: string,
  tagNames: string[]
}) {
  let output = "";
  const rewriter = new HTMLRewriter((outputChunk) => {
    output += decoder.decode(outputChunk);
  });
  const { fileContent, tagNames } = opt;

  try {
    for (const tagName of tagNames) {
      rewriter.on(tagName, {
        element(element) {
          const foldOptRaw = element.getAttribute("fold");
          const foldOptions = foldOptRaw ? JSON.parse(foldOptRaw) : [];
          const truncateOptRaw = element.getAttribute("truncate");
          const truncateOptions = truncateOptRaw ? JSON.parse(truncateOptRaw) : [];

          let metaLines = fileContent.split("\n").map((content, index) => ({
            lineNum: index + 1,
            content,
          }));
          const length = metaLines.length;
    
          metaLines = processFold(metaLines, foldOptions, length);
          metaLines = processTruncate(metaLines, truncateOptions, length);

          const processedCode = metaLines.map((line) => line.content).join("\n");
          const base64Content = Buffer.from(processedCode).toString("base64");

          element.setAttribute("data-sample-code", base64Content);
        },
      });

    }

    await rewriter.write(encoder.encode(html));
    await rewriter.end();

    return output;
  } catch (e) {
    console.error(e);
    return html;
  } finally {
    rewriter.free();
  }
}

async function handleRemoveInProd(html: string, opt: {
  tagNames: string[]
}) {
  let output = "";
  const rewriter = new HTMLRewriter((outputChunk) => {
    output += decoder.decode(outputChunk);
  });
  try {

    for (const tagName of opt.tagNames) {
      rewriter.on(tagName, {
        element(element) {
          element.remove();
        },
      });
    }

    await rewriter.write(encoder.encode(html));
    await rewriter.end();
    return output;
  } catch (e) {
    console.error(e);
    return html;
  } finally {
    rewriter.free();
  }
}

export {
  rewrite,
  handleRemoveInProd,
};
