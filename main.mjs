import { build } from "./cmd/build.mjs";
// import { parse } from "https://deno.land/std/flags/mod.ts";

const defaultOptions = {
  outputDir: "build",
  sourceDir: "posts",
  staticDir: "static",
  postTemplate: "templates/post.mustache",
  archiveTemplate: "templates/archive.mustache",
  rssTemplate: "templates/rss.mustache.xml",
  css: "style.css",
  assetHost: "http://localhost:1234",
  baseUrl: "http://localhost:1234",
};

const USER_CONFIG_PATH = ".blog-config.json";
let userOptions = {};

try {
  // userOptions = JSON.parse(Deno.readTextFileSync(USER_CONFIG_PATH));
} catch (_err) {
  // I literally don't care
}

const options = {
  ...defaultOptions,
  ...userOptions,
};

build(options);
