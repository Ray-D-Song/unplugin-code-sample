import { promises as fs } from "node:fs";
import path from "node:path";

async function copyAndRemove() {
  const srcDir = "dist/src";
  const destDir = "dist";

  try {
    // 复制文件
    await copyFiles(srcDir, destDir);

    // 删除源目录
    await fs.rm(srcDir, { recursive: true, force: true });

    console.log("copy type success");
  } catch (error) {
    console.error("copy type error:", error);
  }
}

async function copyFiles(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyFiles(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

copyAndRemove();
