import { compilePosts, renderArchive, renderPosts, renderRss } from "../lib.js";
import { ensureDirSync } from "https://deno.land/std/fs/mod.ts";
import { copySync } from "https://deno.land/std@0.145.0/fs/copy.ts";

export function build(options) {
  ensureDirSync(options.outputDir);
  const posts = compilePosts(options);
  renderPosts(posts, options);
  renderArchive(posts, options);
  renderRss(posts, options);
  copySync(options.staticDir, options.outputDir, { overwrite: true });
}
