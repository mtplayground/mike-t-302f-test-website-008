import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";

const distDir = resolve("dist");
const host = "0.0.0.0";
const port = 8080;
const localOrigin = `http://127.0.0.1:${port}`;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp"
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function getMimeType(filePath) {
  return mimeTypes[extname(filePath)] || "application/octet-stream";
}

function getSafeFilePath(requestPath) {
  const decodedPath = decodeURIComponent(requestPath.split("?")[0]);
  const normalizedPath = normalize(decodedPath === "/" ? "/index.html" : decodedPath);
  const filePath = join(distDir, normalizedPath);
  const relativePath = filePath.slice(distDir.length);

  if (!relativePath.startsWith(sep) || relativePath.includes(`..${sep}`)) {
    return null;
  }

  return filePath;
}

async function createStaticServer() {
  await stat(join(distDir, "index.html"));

  const server = createServer(async (request, response) => {
    try {
      const filePath = getSafeFilePath(request.url || "/");

      if (!filePath) {
        response.writeHead(400);
        response.end("Bad request");
        return;
      }

      const body = await readFile(filePath);
      response.writeHead(200, {
        "content-type": getMimeType(filePath),
        "cache-control": "no-store"
      });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });

  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(port, host, () => {
      server.off("error", rejectListen);
      resolveListen();
    });
  });

  return server;
}

async function fetchOk(path) {
  const response = await fetch(new URL(path, localOrigin));
  assert(response.ok, `${path} returned ${response.status}`);
  return response;
}

function getAttributes(html, attributeName) {
  const expression = new RegExp(`${attributeName}="([^"]+)"`, "g");
  return [...html.matchAll(expression)].map((match) => match[1]);
}

function getIds(html) {
  return new Set(getAttributes(html, "id"));
}

async function verify() {
  const server = await createStaticServer();

  try {
    const pageResponse = await fetchOk("/");
    const html = await pageResponse.text();
    const ids = getIds(html);

    assert(html.includes("Agent Team for Founders"), "headline is missing from rendered HTML");
    assert(html.includes("You just talk, we handle the rest"), "tagline is missing from rendered HTML");
    assert(ids.has("main-content"), "main-content target is missing");

    const hrefs = getAttributes(html, "href");
    const srcs = getAttributes(html, "src");
    const mailtoLinks = hrefs.filter((href) => href.startsWith("mailto:"));
    const localPaths = new Set();

    assert(mailtoLinks.length > 0, "no mailto links found");
    for (const mailtoLink of mailtoLinks) {
      const email = mailtoLink.replace(/^mailto:/, "").trim();
      assert(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email), `invalid mailto link: ${mailtoLink}`);
    }

    for (const href of hrefs) {
      if (href.startsWith("#")) {
        assert(ids.has(href.slice(1)), `missing hash target: ${href}`);
      } else if (href.startsWith("/")) {
        localPaths.add(href);
      }
    }

    for (const src of srcs) {
      if (src.startsWith("/")) {
        localPaths.add(src);
      }
    }

    for (const path of localPaths) {
      await fetchOk(path);
    }

    console.log(`Static verification passed: ${localPaths.size} local paths and ${mailtoLinks.length} mailto links checked.`);
  } finally {
    await new Promise((resolveClose, rejectClose) => {
      server.close((error) => (error ? rejectClose(error) : resolveClose()));
    });
  }
}

verify().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
