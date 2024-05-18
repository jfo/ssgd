import {
  compilePosts,
  renderArchive,
  renderPosts,
  renderRss,
} from "../lib/index.js";
import { copySync, ensureDirSync } from "fs-extra";

export function build(options) {
  ensureDirSync(options.outputDir);
  const posts = compilePosts(options);
  renderPosts(posts, options);
  renderArchive(posts, options);
  renderRss(posts, options);
  copySync(options.staticDir, options.outputDir, { overwrite: true });
}
