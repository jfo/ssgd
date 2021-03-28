import { ensureDirSync } from "https://deno.land/std@0.91.0/fs/mod.ts"
import { assert } from "https://deno.land/std@0.91.0/testing/asserts.ts";

// Everything is syncronous, we read in the file:
const input = Deno.readTextFileSync('./posts/1.html')

// We create the output directory:
ensureDirSync('./build')

// We write the file unchanged:
Deno.writeTextFileSync('./build/1.html', input)

// We read in the output and assert it matches the input:
const output = Deno.readTextFileSync('./build/1.html')
assert(output === input)
