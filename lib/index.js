import { ensureDirSync, expandGlobSync } from "https://deno.land/std/fs/mod.ts";
import { paramCase } from "https://deno.land/x/case/mod.ts";
import { parse } from "https://deno.land/std/path/mod.ts";
import { Marked } from "https://deno.land/x/markdown/mod.ts";
import hljs from "https://jspm.dev/highlight.js";
import zigHighlighting from "./zig-hl.js";
import { render } from "https://deno.land/x/mustache_ts/mustache.ts";

const currentlyUnknownLanguages = ["hex", "wat", "asm"];

hljs.registerLanguage("zig", zigHighlighting);
Marked.setOptions({
  highlight: (code, language) => {
    if (!language || currentlyUnknownLanguages.includes(language)) {
      return code;
    }

    return hljs.highlight(code, { language }).value;
  },
});

export function compilePosts(options) {
  const inputFiles = expandGlobSync(`${options.sourceDir}/**/*.md`);
  let posts = [];

  for (const file of inputFiles) {
    const input = Deno.readTextFileSync(file.path);
    const markup = Marked.parse(input);

    const title = markup?.meta?.title || parse(file.name).name;
    let date = markup?.meta?.date || "1970-01-01";
    date = new Date(date);

    const url = markup?.meta?.url || paramCase(title);

    posts.push({
      title,
      date: `${
        date.toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
        })
      }, ${date.getFullYear()}`,
      content: markup.content,
      description: markup.description || `${markup.content.slice(0, 450)}...`,
      url,
    });
  }

  posts = posts.sort((p) => p.date).reverse();

  return posts;
}

export function renderPosts(posts, options) {
  for (const { title, date, content, url } of posts) {
    ensureDirSync(`${options.outputDir}/${url}`);

    const renderedContent = render(content, {
      img: () => (text) => `<image src="${options.assetHost || ""}/${text}" />`,
      literalMustache: () => (text) => `{{${text}}}`,
    });

    Deno.writeTextFileSync(
      `${options.outputDir}/${url}/index.html`,
      render(Deno.readTextFileSync(options.postTemplate), {
        content: renderedContent,
        title,
        date,
        url,
        ...options,
      }),
    );
  }
}

export function renderArchive(posts, options) {
  Deno.writeTextFileSync(
    `${options.outputDir}/index.html`,
    render(Deno.readTextFileSync(options.archiveTemplate), {
      posts,
      ...options,
    }),
  );
}

export function renderRss(posts, options) {
  Deno.writeTextFileSync(
    `${options.outputDir}/feed.xml`,
    render(Deno.readTextFileSync(options.rssTemplate), {
      items: posts.slice(0, 3),
      now: new Date(),
      ...options,
    }),
  );
}
