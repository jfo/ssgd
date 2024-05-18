// import { ensureDirSync, expandGlobSync } from "https://deno.land/std/fs/mod.ts";
import { globSync, readFileSync } from 'node:fs';
// import { paramCase } from "https://deno.land/x/case/mod.ts";
import { marked } from "marked";
import yamlFront from "yaml-front-matter";
// import hljs from "https://jspm.dev/highlight.js";
// import zigHighlighting from "./zig-hl.js";
// import { render } from "https://deno.land/x/mustache_ts/mustache.ts";

// const currentlyUnknownLanguages = ["hex", "wat", "asm"];

// hljs.registerLanguage("zig", zigHighlighting);
// Marked.setOptions({
//   highlight: (code, language) => {
//     if (!language || currentlyUnknownLanguages.includes(language)) {
//       return code;
//     }

//     return hljs.highlight(code, { language }).value;
//   },
// });

export function compilePosts(options) {
  const inputFiles = globSync(`${options.sourceDir}/**/*.md`);
  let posts = [];

  for (const file of inputFiles) {
    const input = readFileSync(file, 'utf-8');

    const post = yamlFront.loadFront(input);
    post.__content = marked.parse(post.__content);

    const title = post.title || 'asdf';

    posts.push({
      title,
      date: new Date(post.date) || new Date("1970-01-01"),
      content: post.__content,
      description: post.description || `${post.__content.slice(0, 450)}...`,
      // url: post.url || paramCase(),
    });
  }

  posts = posts.sort((p) => p.date).reverse();

  return posts;
}

// export function renderPosts(posts, options) {
//   for (const { title, date, content, url } of posts) {
//     ensureDirSync(`${options.outputDir}/${url}`);

//     const renderedContent = render(content, {
//       img: () => (text) => `<image src="${options.assetHost || ""}/${text}" />`,
//       literalMustache: () => (text) => `{{${text}}}`,
//     });

//     Deno.writeTextFileSync(
//       `${options.outputDir}/${url}/index.html`,
//       render(Deno.readTextFileSync(options.postTemplate), {
//         content: renderedContent,
//         title,
//         date,
//         url,
//         ...options,
//       }),
//     );
//   }
// }

// export function renderArchive(posts, options) {
//   Deno.writeTextFileSync(
//     `${options.outputDir}/index.html`,
//     render(Deno.readTextFileSync(options.archiveTemplate), {
//       posts,
//       ...options,
//     }),
//   );
// }

// export function renderRss(posts, options) {
//   Deno.writeTextFileSync(
//     `${options.outputDir}/feed.xml`,
//     render(Deno.readTextFileSync(options.rssTemplate), {
//       items: posts.slice(0, 3),
//       now: new Date(),
//       ...options,
//     }),
//   );
// }
