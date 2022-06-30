import { compilePosts, renderArchive, renderPosts, renderRss } from "./lib.js";
import { ensureDirSync } from "https://deno.land/std/fs/mod.ts";
import { copySync } from "https://deno.land/std@0.145.0/fs/copy.ts";

const defaultOptions = {
  outputDir: "build",
  sourceDir: "posts",
  staticDir: "static",
  rootTemplate: "templates/post.mustache",
  archiveTemplate: "templates/archive.mustache",
  rssTemplate: "templates/rss.mustache",
  css: "style.css",
  assetHost: "http://localhost",
  baseUrl: "http://localhost",
};

let userOptions = {};
try {
  userOptions = JSON.parse(Deno.readTextFileSync(".blog-config.json"));
} catch {}

const options = {
  ...defaultOptions,
  ...userOptions,
};

ensureDirSync(options.outputDir);
const posts = compilePosts(options);
renderPosts(posts, options);
renderArchive(posts, options);
renderRss(posts, options);
copySync(options.staticDir, options.outputDir, { overwrite: true });
