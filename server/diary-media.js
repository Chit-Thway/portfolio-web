import { parseByteRange } from "./http-range.js";

export async function serveDiaryObject(request, bucket, key, fallbackContentType) {
  const metadata = await bucket.head(key);
  if (!metadata) return new Response("Not found", { status: 404 });

  const requestEtag = request.headers.get("If-None-Match");
  if (requestEtag && requestEtag.replaceAll('"', "") === metadata.etag) {
    return new Response(null, {
      status: 304,
      headers: { ETag: '"' + metadata.etag + '"' },
    });
  }

  const range = parseByteRange(request.headers.get("Range"), metadata.size);
  if (range === false) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": "bytes */" + metadata.size },
    });
  }

  const object = await bucket.get(key, range ? { range } : undefined);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  if (typeof object.writeHttpMetadata === "function") {
    object.writeHttpMetadata(headers);
  }

  headers.set(
    "Content-Type",
    headers.get("Content-Type") || fallbackContentType || "application/octet-stream",
  );
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("Accept-Ranges", "bytes");
  headers.set("ETag", '"' + object.etag + '"');
  headers.set("X-Content-Type-Options", "nosniff");

  if (range) {
    const end = range.offset + range.length - 1;
    headers.set(
      "Content-Range",
      "bytes " + range.offset + "-" + end + "/" + metadata.size,
    );
    headers.set("Content-Length", String(range.length));
  } else {
    headers.set("Content-Length", String(metadata.size));
  }

  return new Response(object.body, {
    status: range ? 206 : 200,
    headers,
  });
}
