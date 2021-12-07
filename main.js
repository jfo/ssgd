import { ensureDirSync, expandGlobSync } from "https://deno.land/std/fs/mod.ts";
import { paramCase, normalCase } from "https://deno.land/x/case/mod.ts";
import { parse } from "https://deno.land/std/path/mod.ts";
import { Marked } from "https://deno.land/x/markdown/mod.ts";
import hljs from "https://dev.jspm.io/highlightjs";

const options = {
  outputDir: "build",
  sourceDir: "posts",
};

Marked.setOptions({
  highlight: (code, lang) => hljs.highlight(lang, code).value,
});

ensureDirSync(options.outputDir);

const inputFiles = expandGlobSync(`${options.sourceDir}/**/*.md`);

for (const file of inputFiles) {
  const input = Deno.readTextFileSync(file.path);
  const markup = Marked.parse(input);
  const title = markup?.meta?.title || parse(file.name).name;

  Deno.writeTextFileSync(
    `${options.outputDir}/${paramCase(title)}.html`,
    markup.content
  );
}
