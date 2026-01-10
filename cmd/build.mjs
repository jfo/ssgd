import {
  compilePosts,
  renderArchive,
  renderPosts,
  renderRss,
} from "../lib/index.mjs";

import { mkdirSync, existsSync, cpSync } from "node:fs";

export function build(options) {
  if (!existsSync(options.outputDir)) mkdirSync(options.outputDir);
  const posts = compilePosts(options);
  renderPosts(posts, options);

  renderArchive(posts, options);
  renderRss(posts, options);
  cpSync(options.staticDir, options.outputDir, {
    force: true,
    recursive: true,
  });
}
