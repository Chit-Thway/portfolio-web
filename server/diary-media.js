function parseRange(rangeHeader, size) {
  if (!rangeHeader) return null;

  const match = /^bytes=(\d*)-(\d*)$/u.exec(rangeHeader.trim());
  if (!match || (!match[1] && !match[2])) return false;

  let start;
  let end;

  if (!match[1]) {
    const suffixLength = Number(match[2]);
    if (!Number.isInteger(suffixLength) || suffixLength <= 0) return false;
    start = Math.max(0, size - suffixLength);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Number(match[2]) : size - 1;
  }

  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    end < start ||
    start >= size
  ) {
    return false;
  }

  return {
    offset: start,
    length: Math.min(end, size - 1) - start + 1,
  };
}

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

  const range = parseRange(request.headers.get("Range"), metadata.size);
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
