import { globSync, readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { marked } from "marked";
import { kebabCase } from "change-case";
import yamlFront from "yaml-front-matter";
import hljs from 'highlight.js';
import zigHighlighting from "./zig-hl.mjs";
import Mustache from "mustache";

const currentlyUnknownLanguages = ["hex", "wat", "asm"];

hljs.registerLanguage("zig", zigHighlighting);
marked.setOptions({
  highlight: (code, language) => {
    if (!language || currentlyUnknownLanguages.includes(language)) {
      return code;
    }

    return hljs.highlight(code, { language }).value;
  },
});

export function compilePosts(options) {
  const inputFiles = globSync(`${options.sourceDir}/**/*.md`);
  let posts = [];

  for (const file of inputFiles) {
    const input = readFileSync(file, "utf-8");

    const post = yamlFront.loadFront(input);
    post.__content = marked.parse(post.__content);

    const title = post.title || basename(file, ".md");

    posts.push({
      title,
      date: new Date(post.date),
      content: post.__content,
      description: post.description || `${post.__content.slice(0, 450)}...`,
      url: post.url || kebabCase(title),
    });
  }

  posts = posts.sort((a, b) => a.date - b.date);
  return posts;
}

export function renderPosts(posts, options) {
  for (const { title, date, content, url } of posts) {
    const path = `${options.outputDir}/${url}`;

    if (!existsSync(path)) mkdirSync(path);

    const renderedContent = Mustache.render(content, {
      img: () => (text) => `<image src="${options.assetHost || ""}/${text}" />`,
      literalMustache: () => (text) => `{{${text}}}`,
    });

    writeFileSync(
      `${options.outputDir}/${url}/index.html`,
      Mustache.render(readFileSync(options.postTemplate, 'utf-8'), {
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
  writeFileSync(
    `${options.outputDir}/index.html`,
    Mustache.render(readFileSync(options.archiveTemplate, 'utf-8'), {
      posts,
      ...options,
    }),
  );
}

export function renderRss(posts, options) {
  writeFileSync(
    `${options.outputDir}/feed.xml`,
    Mustache.render(readFileSync(options.rssTemplate, 'utf-8'), {
      items: posts.slice(0, 3),
      now: new Date(),
      ...options,
    }),
  );
}
