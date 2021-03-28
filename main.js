import {
  ensureDirSync,
  expandGlobSync,
} from "https://deno.land/std@0.91.0/fs/mod.ts";
import { paramCase } from "https://deno.land/x/case/mod.ts";
import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";

const YAML_FRONTMATTER_REGEX =
  /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/;

// We create the output directory:
ensureDirSync("./build");

const inputFiles = expandGlobSync("**/*.md");
for (const file of inputFiles) {
  // Everything is synchronous, we read in the file:
  const input = Deno.readTextFileSync(file.path);

  // We write the file processed through markdown:
  const markup = Marked.parse(input);
  Deno.writeTextFileSync(
    `./build/${paramCase(markup.meta.title)}.html`,
    markup.content,
  );
}
