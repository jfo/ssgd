import * as lib from "./lib.js";

import { ensureDirSync } from "https://deno.land/std/fs/mod.ts";
import { copySync } from "https://deno.land/std@0.145.0/fs/copy.ts";

const options = {
  outputDir: "build",
  sourceDir: "src",
  staticDir: "static",
  rootTemplate: "templates/root_template.html",
  archiveTemplate: "templates/archive_template.html",
  rssTemplate: "templates/rss_template.xml",
  css: "style.css",
  includeAnalytics: true,
  // assetHost: "https://assets.jfo.click",
  // baseUrl: "https://blog.jfo.click",
  //
  assetHost: "http://dev.jfo.click:4321",
  baseUrl: "http://dev.jfo.click:4321",
};

ensureDirSync(options.outputDir);
const posts = lib.compilePosts(options);
lib.compilePosts(options);
lib.renderPosts(posts, options);
lib.renderArchive(posts, options);
lib.renderRss(posts, options);
copySync(options.staticDir, options.outputDir, { overwrite: true });
