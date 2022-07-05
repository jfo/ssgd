import { build } from "./cmd/build.js";
import { parse } from "https://deno.land/std/flags/mod.ts";

const defaultOptions = {
  outputDir: "build",
  sourceDir: "posts",
  staticDir: "static",
  postTemplate: "templates/post.mustache",
  archiveTemplate: "templates/archive.mustache",
  rssTemplate: "templates/rss.mustache.xml",
  css: "style.css",
  assetHost: "http://localhost",
  baseUrl: "http://localhost",
};

const USER_CONFIG_PATH = ".blog-config.json";
let userOptions = {};

try {
  userOptions = JSON.parse(Deno.readTextFileSync(USER_CONFIG_PATH));
} catch (_err) {
  // I literally don't care
}

const args = parse(Deno.args);
if (args.development || args.dev) {
  userOptions = userOptions.development;
} else if (args.production || args.prod) {
  userOptions = userOptions.development;
}

const options = {
  ...defaultOptions,
  ...userOptions,
};

build(options);
