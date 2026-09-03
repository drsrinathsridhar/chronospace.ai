import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "@svgr/core";
import prettier from "prettier";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const sourceDir = join(rootDir, "src/icons/source");
const generatedDir = join(rootDir, "src/icons/generated");
const checkOnly = process.argv.includes("--check");

const sourceFiles = (await readdir(sourceDir))
  .filter((file) => file.endsWith(".svg"))
  .sort((a, b) => a.localeCompare(b));

if (sourceFiles.length === 0) {
  throw new Error("No SVG source files found in src/icons/source.");
}

await mkdir(generatedDir, { recursive: true });

const expectedFiles = new Map();
const exports = [];

for (const sourceFile of sourceFiles) {
  const sourcePath = join(sourceDir, sourceFile);
  const svg = await readFile(sourcePath, "utf8");
  const fileBaseName = basename(sourceFile, ".svg");
  const componentName = `${toPascalCase(fileBaseName)}Icon`;
  const targetFile = `${fileBaseName}.tsx`;

  const rawCode = await transform(
    svg,
    {
      icon: true,
      typescript: true,
      jsxRuntime: "automatic",
      exportType: "named",
      namedExport: componentName,
      plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
      svgoConfig: {
        plugins: ["preset-default", "removeDimensions"],
      },
    },
    { componentName },
  );

  const code = await prettier.format(rawCode, { parser: "typescript" });

  expectedFiles.set(targetFile, code);
  exports.push(`export { ${componentName} } from "./${fileBaseName}";`);
}

expectedFiles.set(
  "index.ts",
  await prettier.format(`${exports.join("\n")}\n`, { parser: "typescript" }),
);

if (checkOnly) {
  await checkGeneratedFiles(expectedFiles);
  console.log("Icon components are current.");
} else {
  for (const [file, content] of expectedFiles) {
    await writeFile(join(generatedDir, file), content);
  }
  console.log(`Generated ${sourceFiles.length} icon component(s).`);
}

async function checkGeneratedFiles(expectedFiles) {
  const existingFiles = new Set(
    (await readdir(generatedDir).catch(() => [])).filter((file) =>
      file.match(/\.(ts|tsx)$/),
    ),
  );
  const problems = [];

  for (const [file, expectedContent] of expectedFiles) {
    existingFiles.delete(file);

    const filePath = join(generatedDir, file);
    const actualContent = await readFile(filePath, "utf8").catch(() => null);

    if (actualContent !== expectedContent) {
      problems.push(file);
    }
  }

  for (const extraFile of existingFiles) {
    problems.push(extraFile);
  }

  if (problems.length > 0) {
    throw new Error(
      `Generated icons are stale. Run npm run icons:generate. Affected files: ${problems.join(", ")}`,
    );
  }
}

function toPascalCase(value) {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join("");
}
