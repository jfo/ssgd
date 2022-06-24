import { ensureDirSync, expandGlobSync } from "https://deno.land/std/fs/mod.ts";
import { paramCase, normalCase } from "https://deno.land/x/case/mod.ts";
import { parse } from "https://deno.land/std/path/mod.ts";
import { Marked } from "https://deno.land/x/markdown/mod.ts";
import hljs from "https://jspm.dev/highlight.js";
import { render } from "https://deno.land/x/mustache_ts/mustache.ts";
import { format } from "https://deno.land/std@0.91.0/datetime/mod.ts";
import { copySync } from "https://deno.land/std@0.145.0/fs/copy.ts";

const options = {
  outputDir: "build",
  sourceDir: "src",
  staticDir: "static",
  rootTemplate: "templates/root_template.html",
  archiveTemplate: "templates/archive_template.html",
  css: "style.css",
  // assetHost: "https://assets.jfo.click",
};

const currentlyUnknownLanguages = ["zig", "hex", "wat", "asm"];
Marked.setOptions({
  highlight: (code, language) => {
    if (!language || currentlyUnknownLanguages.includes(language)) {
      return code;
    }

    return hljs.highlight(code, { language }).value;
  },
});

ensureDirSync(options.outputDir);

const inputFiles = expandGlobSync(`${options.sourceDir}/**/*.md`);
const posts = [];

for (const file of inputFiles) {
  const input = Deno.readTextFileSync(file.path);
  const markup = Marked.parse(input);

  const title = markup?.meta?.title || parse(file.name).name;
  let date = markup?.meta?.date || "1970-01-01";
  date = new Date(date);

  const url = markup?.meta?.url || paramCase(title);

  posts.push({
    title,
    date: `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getDate()}, ${date.getFullYear()}`,
    content: markup.content,
    url,
  });
}

for (const { title, date, content, url } of posts
  .sort((p) => p.date)
  .reverse()) {
  ensureDirSync(`${options.outputDir}/${url}`);
  Deno.writeTextFileSync(
    `${options.outputDir}/${url}/index.html`,
    render(Deno.readTextFileSync(options.rootTemplate), {
      content: render(content, {
        img: () => (text) => `<image src="${options.assetHost || ''}/${text}" />`,
      }),
      title,
      date,
      css: options.css,
    })
  );
}

Deno.writeTextFileSync(
  `${options.outputDir}/index.html`,
  render(Deno.readTextFileSync(options.archiveTemplate), {
    written: posts,
    css: options.css,
  })
);

copySync(options.staticDir, options.outputDir, { overwrite: true });
