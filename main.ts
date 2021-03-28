import { ensureDirSync } from "https://deno.land/std@0.91.0/fs/mod.ts";
import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";
import { assert } from "https://deno.land/std@0.91.0/testing/asserts.ts";

// Everything is syncronous, we read in the file:
const input = Deno.readTextFileSync("./posts/1.md");
// We create the output directory:
ensureDirSync("./build");

// We write the file processed through markdown:
const markup = Marked.parse(input);
Deno.writeTextFileSync("./build/1.html", markup.content);
