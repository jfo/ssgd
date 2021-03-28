import { ensureDirSync } from "https://deno.land/std@0.91.0/fs/mod.ts";
import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";
import { parse } from "https://deno.land/std@0.91.0/encoding/yaml.ts";
import { assert } from "https://deno.land/std@0.91.0/testing/asserts.ts";

// We create the output directory:
ensureDirSync("./build");

// Everything is syncronous, we read in the file:
const input = Deno.readTextFileSync("./posts/1.md");

const re = /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/
const results = re.exec(input)
const x = results[2]

console.log(parse(x))

// We write the file processed through markdown:
const markup = Marked.parse(input);
Deno.writeTextFileSync("./build/1.html", markup.content);
