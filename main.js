import { ensureDirSync, expandGlobSync } from "https://deno.land/std/fs/mod.ts";
import { paramCase, normalCase } from "https://deno.land/x/case/mod.ts";
import { Marked } from "https://deno.land/x/markdown/mod.ts";

const options = {
  outputDir: "build",
  sourceDir: "src",
};

const outputDir = `${Deno.cwd()}/${options.outputDir}`;
const sourceDir = `${Deno.cwd()}/${options.sourceDir}`;

ensureDirSync(outputDir);

const inputFiles = expandGlobSync(`${sourceDir}/**/*.md`);

for (const file of inputFiles) {
  const input = Deno.readTextFileSync(file.path);
  const markup = Marked.parse(input);

  Deno.writeTextFileSync(
    `${outputDir}/${paramCase(markup.meta.title)}.html`,
    markup.content
  );
}
