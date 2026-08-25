import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

import * as diaryAudio from "../functions/api/diary/audio/[id].js";
import * as diaryLogin from "../functions/api/diary/login.js";
import * as diaryLogout from "../functions/api/diary/logout.js";
import * as diaryMedia from "../functions/api/diary/media/[id].js";
import * as diaryPost from "../functions/api/diary/posts/[id].js";
import * as diaryPosts from "../functions/api/diary/posts.js";
import * as diarySession from "../functions/api/diary/session.js";
import * as visit from "../functions/api/visit.js";
import * as visitorStats from "../functions/api/visitor-stats.js";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const staticRoot = resolve(projectRoot, "dist/client");
const localStateRoot = resolve(projectRoot, ".wrangler/local-diary-preview");
const mediaRoot = resolve(localStateRoot, "r2");
const databasePath = resolve(localStateRoot, "portfolio.sqlite");
const port = Number(process.env.PORT ?? 4173);

function loadDevVariables() {
  const envPath = resolve(projectRoot, ".dev.vars");
  if (!existsSync(envPath)) return;

  for (const rawLine of readFileSync(envPath, "utf8").split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator < 1) continue;

    const name = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(name in process.env)) process.env[name] = value;
  }
}

function applyMigrations(database) {
  database.exec(
    "CREATE TABLE IF NOT EXISTS d1_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, applied_at TEXT NOT NULL)",
  );

  const migrationDirectory = resolve(projectRoot, "migrations");
  const migrations = readdirSync(migrationDirectory)
    .filter((name) => /^\d+.*\.sql$/u.test(name))
    .sort();

  const hasMigration = database.prepare(
    "SELECT 1 AS applied FROM d1_migrations WHERE name = ?",
  );
  const recordMigration = database.prepare(
    "INSERT INTO d1_migrations (name, applied_at) VALUES (?, ?)",
  );

  for (const name of migrations) {
    if (hasMigration.get(name)) continue;

    const statements = readFileSync(resolve(migrationDirectory, name), "utf8")
      .split("--> statement-breakpoint")
      .map((statement) => statement.trim())
      .filter(Boolean);

    database.exec("BEGIN IMMEDIATE");
    try {
      for (const statement of statements) database.exec(statement);
      recordMigration.run(name, new Date().toISOString());
      database.exec("COMMIT");
      console.log("Applied local migration " + name);
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
  }
}

class LocalD1Statement {
  constructor(database, sql) {
    this.statement = database.prepare(sql);
    this.args = [];
  }

  bind(...args) {
    this.args = args;
    return this;
  }

  async first() {
    return this.statement.get(...this.args) ?? null;
  }

  async all() {
    return { results: this.statement.all(...this.args) };
  }

  async run() {
    const result = this.statement.run(...this.args);
    return {
      success: true,
      meta: {
        changes: Number(result.changes),
        last_row_id: Number(result.lastInsertRowid),
      },
    };
  }
}

class LocalD1 {
  constructor(database) {
    this.database = database;
  }

  prepare(sql) {
    return new LocalD1Statement(this.database, sql);
  }

  async batch(statements) {
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const results = [];
      for (const statement of statements) results.push(await statement.run());
      this.database.exec("COMMIT");
      return results;
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
  }
}

function checkedMediaPath(key) {
  const path = resolve(mediaRoot, key);
  if (path !== mediaRoot && !path.startsWith(mediaRoot + sep)) {
    throw new Error("Invalid local R2 object key.");
  }
  return path;
}

function metadataPath(path) {
  return path + ".metadata.json";
}

function objectMetadata(bytes, metadata = {}) {
  return {
    size: bytes.length,
    etag: createHash("sha256").update(bytes).digest("hex"),
    contentType: metadata.contentType ?? "application/octet-stream",
  };
}

class LocalR2 {
  async put(key, value, options = {}) {
    const path = checkedMediaPath(key);
    const bytes = Buffer.from(value);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, bytes);
    writeFileSync(
      metadataPath(path),
      JSON.stringify({
        contentType: options.httpMetadata?.contentType ?? "application/octet-stream",
      }),
      "utf8",
    );
  }

  async head(key) {
    const path = checkedMediaPath(key);
    if (!existsSync(path)) return null;

    const bytes = readFileSync(path);
    const stored = existsSync(metadataPath(path))
      ? JSON.parse(readFileSync(metadataPath(path), "utf8"))
      : {};
    return objectMetadata(bytes, stored);
  }

  async get(key, options = undefined) {
    const path = checkedMediaPath(key);
    if (!existsSync(path)) return null;

    const original = readFileSync(path);
    const stored = existsSync(metadataPath(path))
      ? JSON.parse(readFileSync(metadataPath(path), "utf8"))
      : {};
    const bytes = options?.range
      ? original.subarray(
          options.range.offset,
          options.range.offset + options.range.length,
        )
      : original;
    const metadata = objectMetadata(original, stored);

    return {
      body: bytes,
      etag: metadata.etag,
      writeHttpMetadata(headers) {
        headers.set("Content-Type", metadata.contentType);
      },
    };
  }

  async delete(key) {
    const path = checkedMediaPath(key);
    rmSync(path, { force: true });
    rmSync(metadataPath(path), { force: true });
  }
}

function contentType(path) {
  return (
    {
      ".css": "text/css; charset=utf-8",
      ".gif": "image/gif",
      ".html": "text/html; charset=utf-8",
      ".ico": "image/x-icon",
      ".jpeg": "image/jpeg",
      ".jpg": "image/jpeg",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".m4a": "audio/mp4",
      ".mp3": "audio/mpeg",
      ".mp4": "video/mp4",
      ".pdf": "application/pdf",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".vtt": "text/vtt; charset=utf-8",
      ".webm": "video/webm",
      ".webp": "image/webp",
    }[extname(path).toLowerCase()] ?? "application/octet-stream"
  );
}

function staticPath(url) {
  const decoded = decodeURIComponent(url.pathname);
  const relative = decoded.endsWith("/") ? decoded + "index.html" : decoded;
  let path = resolve(staticRoot, "." + relative);

  if (existsSync(path) && statSync(path).isDirectory()) {
    path = resolve(path, "index.html");
  }

  if (path !== staticRoot && !path.startsWith(staticRoot + sep)) return null;
  return path;
}

const routes = [
  { pattern: /^\/api\/visit\/?$/u, module: visit },
  { pattern: /^\/api\/visitor-stats\/?$/u, module: visitorStats },
  { pattern: /^\/api\/diary\/login\/?$/u, module: diaryLogin },
  { pattern: /^\/api\/diary\/logout\/?$/u, module: diaryLogout },
  { pattern: /^\/api\/diary\/session\/?$/u, module: diarySession },
  { pattern: /^\/api\/diary\/posts\/?$/u, module: diaryPosts },
  {
    pattern: /^\/api\/diary\/posts\/([^/]+)\/?$/u,
    module: diaryPost,
    parameter: "id",
  },
  {
    pattern: /^\/api\/diary\/media\/([^/]+)\/?$/u,
    module: diaryMedia,
    parameter: "id",
  },
  {
    pattern: /^\/api\/diary\/audio\/([^/]+)\/?$/u,
    module: diaryAudio,
    parameter: "id",
  },
];

async function requestBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return chunks.length > 0 ? Buffer.concat(chunks) : undefined;
}

async function runFunction(request, env) {
  const url = new URL(request.url);
  for (const route of routes) {
    const match = route.pattern.exec(url.pathname);
    if (!match) continue;

    const methodName =
      "onRequest" +
      request.method.slice(0, 1).toUpperCase() +
      request.method.slice(1).toLowerCase();
    const handler = route.module[methodName] ?? route.module.onRequest;
    if (!handler) return new Response("Method not allowed", { status: 405 });

    return handler({
      request,
      env,
      params: route.parameter ? { [route.parameter]: decodeURIComponent(match[1]) } : {},
      data: {},
      next: async () => new Response("Not found", { status: 404 }),
      waitUntil() {},
    });
  }

  return null;
}

function sendResponse(nodeResponse, response) {
  nodeResponse.statusCode = response.status;
  const setCookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [];

  response.headers.forEach((value, name) => {
    if (name.toLowerCase() !== "set-cookie") nodeResponse.setHeader(name, value);
  });
  if (setCookies.length > 0) nodeResponse.setHeader("Set-Cookie", setCookies);

  if (!response.body) {
    nodeResponse.end();
    return;
  }

  response.arrayBuffer().then(
    (body) => nodeResponse.end(Buffer.from(body)),
    () => {
      nodeResponse.statusCode = 500;
      nodeResponse.end("Local response failed.");
    },
  );
}

loadDevVariables();
mkdirSync(mediaRoot, { recursive: true });
const sqlite = new DatabaseSync(databasePath);
applyMigrations(sqlite);

const env = {
  VISITOR_DB: new LocalD1(sqlite),
  DIARY_MEDIA: new LocalR2(),
  DIARY_ADMIN_PASSWORD: process.env.DIARY_ADMIN_PASSWORD,
  DIARY_SESSION_SECRET: process.env.DIARY_SESSION_SECRET,
  VISITOR_TOKEN_SECRET: process.env.VISITOR_TOKEN_SECRET,
};

if (!env.DIARY_ADMIN_PASSWORD || !env.DIARY_SESSION_SECRET) {
  console.warn(
    "Diary administration is disabled. Copy .dev.vars.example to .dev.vars and replace its placeholders.",
  );
}

const server = createServer(async (incoming, outgoing) => {
  try {
    const url = new URL(incoming.url ?? "/", "http://127.0.0.1:" + port);
    const headers = new Headers();
    for (const [name, value] of Object.entries(incoming.headers)) {
      if (Array.isArray(value)) {
        for (const item of value) headers.append(name, item);
      } else if (value !== undefined) {
        headers.set(name, value);
      }
    }

    const body =
      incoming.method === "GET" || incoming.method === "HEAD"
        ? undefined
        : await requestBody(incoming);
    const request = new Request(url, {
      method: incoming.method,
      headers,
      body,
    });

    const functionResponse = await runFunction(request, env);
    if (functionResponse) {
      sendResponse(outgoing, functionResponse);
      return;
    }

    const path = staticPath(url);
    if (!path || !existsSync(path) || !statSync(path).isFile()) {
      outgoing.statusCode = 404;
      outgoing.end("Not found");
      return;
    }

    outgoing.statusCode = 200;
    outgoing.setHeader("Content-Type", contentType(path));
    outgoing.setHeader("X-Content-Type-Options", "nosniff");
    outgoing.end(readFileSync(path));
  } catch (error) {
    console.error(error);
    outgoing.statusCode = 500;
    outgoing.end("Local preview error.");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log("Local portfolio Pages preview: http://127.0.0.1:" + port + "/");
  console.log("Public Diary: http://127.0.0.1:" + port + "/diary/");
});

function close() {
  server.close(() => {
    sqlite.close();
    process.exit(0);
  });
}

process.on("SIGINT", close);
process.on("SIGTERM", close);
