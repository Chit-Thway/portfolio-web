import { parseByteRange } from "./http-range.js";

function assetRequestFor(request) {
  const headers = new Headers(request.headers);
  headers.delete("Range");
  headers.delete("If-Range");

  return new Request(request.url, {
    method: "GET",
    headers,
  });
}

export async function serveProjectVideo(request, assets) {
  const asset = await assets.fetch(assetRequestFor(request));
  if (!asset.ok) return asset;

  const headers = new Headers(asset.headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Type", headers.get("Content-Type") || "video/mp4");
  headers.set("X-Content-Type-Options", "nosniff");

  if (request.method === "HEAD") {
    return new Response(null, { status: 200, headers });
  }

  const rangeHeader = request.headers.get("Range");
  if (!rangeHeader) {
    return new Response(asset.body, { status: 200, headers });
  }

  const bytes = await asset.arrayBuffer();
  const range = parseByteRange(rangeHeader, bytes.byteLength);

  if (range === false) {
    headers.set("Content-Range", `bytes */${bytes.byteLength}`);
    headers.set("Content-Length", "0");
    return new Response(null, { status: 416, headers });
  }

  const end = range.offset + range.length - 1;
  const body = bytes.slice(range.offset, end + 1);
  headers.set("Content-Range", `bytes ${range.offset}-${end}/${bytes.byteLength}`);
  headers.set("Content-Length", String(range.length));

  return new Response(body, { status: 206, headers });
}
