import assert from "node:assert/strict";
import test from "node:test";

import { serveProjectVideo } from "../server/project-video.js";

const videoBytes = new TextEncoder().encode("0123456789");

function createAssets() {
  return {
    async fetch(request) {
      assert.equal(request.headers.has("Range"), false);
      return new Response(videoBytes, {
        headers: {
          "Content-Length": String(videoBytes.byteLength),
          "Content-Type": "video/mp4",
          ETag: '"video-test"',
        },
      });
    },
  };
}

test("project videos advertise byte-range support", async () => {
  const response = await serveProjectVideo(
    new Request("https://portfolio.test/projects/example/demonstration.mp4"),
    createAssets(),
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Accept-Ranges"), "bytes");
  assert.equal(await response.text(), "0123456789");
});

test("project videos return the requested byte range", async () => {
  const response = await serveProjectVideo(
    new Request("https://portfolio.test/projects/example/demonstration.mp4", {
      headers: { Range: "bytes=2-5" },
    }),
    createAssets(),
  );

  assert.equal(response.status, 206);
  assert.equal(response.headers.get("Content-Range"), "bytes 2-5/10");
  assert.equal(response.headers.get("Content-Length"), "4");
  assert.equal(await response.text(), "2345");
});

test("project videos reject unsatisfiable ranges", async () => {
  const response = await serveProjectVideo(
    new Request("https://portfolio.test/projects/example/demonstration.mp4", {
      headers: { Range: "bytes=20-30" },
    }),
    createAssets(),
  );

  assert.equal(response.status, 416);
  assert.equal(response.headers.get("Content-Range"), "bytes */10");
});
