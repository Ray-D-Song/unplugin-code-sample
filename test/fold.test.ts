import { describe, expect, it } from "vitest";
import { processFold } from "../src/libs/fold";

describe("processFold", () => {
  it("should fold code", () => {
    const code = "const a = 1\nconst b = 2\nconst c = 3";
    const fold: [number, number][] = [[1, 2]];
    const metaLines = code.split("\n").map((content, index) => ({
      lineNum: index + 1,
      content,
    }));
    const result = processFold(metaLines, fold, metaLines.length);
    expect(result.map((line) => line.content).join("\n")).toBe(
      "// ...\nconst c = 3"
    );
  });

  it("should throw error if fold is invalid", () => {
    const code = "const a = 1\nconst b = 2\nconst c = 3";
    const fold: [number, number][] = [[2, 1]];
    const metaLines = code.split("\n").map((content, index) => ({
      lineNum: index + 1,
      content,
    }));
    expect(() => processFold(metaLines, fold, metaLines.length)).toThrow(
      "Invalid input: start 2 > end 1"
    );
  });

  it("should throw error if fold is out of range", () => {
    const code = "const a = 1\nconst b = 2\nconst c = 3";
    const fold: [number, number][] = [[2, 10]];
    const metaLines = code.split("\n").map((content, index) => ({
      lineNum: index + 1,
      content,
    }));
    expect(() => processFold(metaLines, fold, metaLines.length)).toThrow(
      "Invalid input: start 2 or end 10 > length 3"
    );
  });
});
