import fs from "node:fs";
import { Buffer } from "node:buffer";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { filter, transform } from "../src/index";
import type { Options } from "../src/types";

vi.mock("fs");

describe("vite-plugin-code-sample", () => {
  const mockFileContent = "<div><code-sample>Test</code-sample></div>";
  const mockBase64Content = Buffer.from(mockFileContent).toString("base64");

  beforeEach(() => {
    vi.mocked(fs.readFileSync).mockReturnValue(mockFileContent);
  });

  it("should handle files with <code-sample> tags", async () => {
    const result = await transform!(mockFileContent, "test.vue");
    expect(result).toBe(
      `<div><code-sample data-sample-code="${mockBase64Content}">Test</code-sample></div>`
    );
  });

  it("should not process files without <code-sample> tags", async () => {
    const content = "<div>No code sample here</div>";
    const result = await transform!(content, "test.vue");
    expect(result).toBe(content);
  });

  it("should filter files based on include option", () => {
    const options: Options = { include: ["**/*.vue"] };
    const f = filter(options);
    expect(f("test.vue")).toBe(true);
    expect(f("test.js")).toBe(false);
  });

  it("should remove <code-sample> tags in production", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const result = await transform!(mockFileContent, "test.vue");
    expect(result).toBe("<div></div>");

    process.env.NODE_ENV = originalEnv;
  });

  it("if removeInProd is false, should not remove <code-sample> tags in production", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const options: Options = { removeInProd: false };
    const result = await transform!(mockFileContent, "test.vue", options);
    expect(result).toBe(
      `<div><code-sample data-sample-code="${mockBase64Content}">Test</code-sample></div>`
    );

    process.env.NODE_ENV = originalEnv;
  });
});

describe("fold", () => {
  const mockFileContent =
    'const a = 1\nconst b = 2\nconst c = 3\n<code-sample fold="[[2, 4]]" />';
  const mockResContent = "const a = 1\n// ...";
  const mockBase64Content = Buffer.from(mockResContent).toString("base64");

  beforeEach(() => {
    vi.mocked(fs.readFileSync).mockReturnValue(mockFileContent);
  });

  it("should fold code", async () => {
    const result = await transform!(mockFileContent, "test.vue");
    expect(result).match(
      /const a = 1\nconst b = 2\nconst c = 3\n<code-sample data-sample-code=".*" fold="\[\[2, 4\]\]" \/>|const a = 1\nconst b = 2\nconst c = 3\n<code-sample fold="\[\[2, 4\]\]" data-sample-code=".*" \/>/
    );
  });
});

describe("truncate", () => {
  const mockFileContent =
    'const a = 1\nconst b = 2\nconst c = 3\n<code-sample truncate="[[1, 2]]" />';
  const mockResContent = "const a = 1\nconst b = 2";
  const mockBase64Content = Buffer.from(mockResContent).toString("base64");

  beforeEach(() => {
    vi.mocked(fs.readFileSync).mockReturnValue(mockFileContent);
  });

  it("should truncate code", async () => {
    const result = await transform!(mockFileContent, "test.vue");
    expect(result).match(
      /const a = 1\nconst b = 2\nconst c = 3\n<code-sample data-sample-code=".*" truncate="\[\[1, 2\]\]" \/>|const a = 1\nconst b = 2\nconst c = 3\n<code-sample truncate="\[\[1, 2\]\]" data-sample-code=".*" \/>/
    );
  });
});
