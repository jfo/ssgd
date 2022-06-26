import { compilePosts, renderArchive, renderPosts, renderRss } from "./lib.js";
import { ensureDirSync } from "https://deno.land/std/fs/mod.ts";
import { copySync } from "https://deno.land/std@0.145.0/fs/copy.ts";

const options = {
  outputDir: "build",
  sourceDir: "posts",
  staticDir: "static",
  rootTemplate: "templates/root_template.html",
  archiveTemplate: "templates/archive_template.html",
  rssTemplate: "templates/rss_template.xml",
  css: "style.css",
  includeAnalytics: true,
  assetHost: "https://blog.jfo.click",
  baseUrl: "https://blog.jfo.click",
  // includeAnalytics: false,
  // assetHost: "http://dev.jfo.click:4321",
  // baseUrl: "http://dev.jfo.click:4321",
};

ensureDirSync(options.outputDir);
const posts = compilePosts(options);
compilePosts(options);
renderPosts(posts, options);
renderArchive(posts, options);
renderRss(posts, options);
copySync(options.staticDir, options.outputDir, { overwrite: true });
