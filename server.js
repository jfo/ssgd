import { serve } from "https://deno.land/std@0.145.0/http/server.ts";

function handler(req, meta) {
  const host = req.headers.get("host");

  const re = new RegExp(`${host}(.*)`);
  const [_, path] = req.url.match(re);

  console.log(path);
  console.log(`build/${path}/index.html`);

  const response = Deno.readTextFileSync(`build/${path}/index.html`);
  return response;
}

serve(handler); // x file watching

// const watcher = Deno.watchFs("posts");
// for await (const event of watcher) {
//   console.log(">>>> event", event);
//   // Example event: { kind: "create", paths: [ "/home/alice/deno/foo.txt" ] }
// }

// a simple way to serve a directory from within deno (statically served)
//

// to be able to invoke the generator
