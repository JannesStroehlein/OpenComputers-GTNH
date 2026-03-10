import * as fs from "node:fs/promises";
import * as path from "node:path";

const sourceRoot = path.resolve(process.argv[2] ?? "src");
const outputRoot = path.resolve(process.argv[3] ?? "dist");

async function copyLuaFiles(sourceDir: string): Promise<number> {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  let copied = 0;

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);

    if (entry.isDirectory()) {
      copied += await copyLuaFiles(sourcePath);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".lua")) {
      continue;
    }

    const relativePath = path.relative(sourceRoot, sourcePath);
    const outputPath = path.join(outputRoot, relativePath);

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.copyFile(sourcePath, outputPath);
    copied += 1;
  }

  return copied;
}

async function main(): Promise<void> {
  try {
    await fs.access(sourceRoot);
  } catch {
    console.error(`Source directory does not exist: ${sourceRoot}`);
    process.exit(1);
  }

  await fs.mkdir(outputRoot, { recursive: true });
  const copiedCount = await copyLuaFiles(sourceRoot);
  console.log(
    `Copied ${copiedCount} Lua file(s) from ${sourceRoot} to ${outputRoot}`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
