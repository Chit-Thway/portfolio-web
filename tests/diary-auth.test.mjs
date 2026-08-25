import assert from "node:assert/strict";
import test from "node:test";

import {
  createAdminSessionCookie,
  hashLoginFingerprint,
  isSameOriginRequest,
  passwordMatches,
  readAdminSession,
} from "../server/diary-auth.js";

const secret = "local-test-session-secret-with-more-than-32-characters";
const now = new Date("2026-08-25T00:00:00.000Z");

test("creates and validates an HTTP-only local admin session", async () => {
  const request = new Request("http://127.0.0.1:8788/api/diary/login");
  const session = await createAdminSessionCookie(request, secret, now);

  assert.match(session.header, /^ct_diary_admin=/);
  assert.match(session.header, /HttpOnly/);
  assert.match(session.header, /SameSite=Strict/);
  assert.doesNotMatch(session.header, /; Secure/);

  const cookie = session.header.split(";")[0];
  const authenticated = await readAdminSession(
    new Request("http://127.0.0.1:8788/api/diary/session", {
      headers: { Cookie: cookie },
    }),
    secret,
    new Date(now.getTime() + 60_000),
  );

  assert.equal(authenticated?.expiresAt, session.expiresAt);
});

test("rejects changed and expired admin session cookies", async () => {
  const request = new Request("https://example.com/api/diary/login");
  const session = await createAdminSessionCookie(request, secret, now);
  const cookie = session.header.split(";")[0];
  const [name, value] = cookie.split("=");
  const tampered = name + "=" + value.slice(0, -1) + (value.endsWith("a") ? "b" : "a");

  assert.equal(
    await readAdminSession(
      new Request("https://example.com/api/diary/session", {
        headers: { Cookie: tampered },
      }),
      secret,
      now,
    ),
    null,
  );

  assert.equal(
    await readAdminSession(
      new Request("https://example.com/api/diary/session", {
        headers: { Cookie: cookie },
      }),
      secret,
      new Date(now.getTime() + 9 * 60 * 60 * 1000),
    ),
    null,
  );
});

test("compares passphrases without exposing the configured value", async () => {
  assert.equal(await passwordMatches("correct horse", "correct horse"), true);
  assert.equal(await passwordMatches("wrong horse", "correct horse"), false);
  assert.equal(await passwordMatches("", "correct horse"), false);
});

test("requires exact same-origin write requests", () => {
  const valid = new Request("https://example.com/api/diary/posts", {
    method: "POST",
    headers: { Origin: "https://example.com" },
  });
  const invalid = new Request("https://example.com/api/diary/posts", {
    method: "POST",
    headers: { Origin: "https://attacker.example" },
  });

  assert.equal(isSameOriginRequest(valid), true);
  assert.equal(isSameOriginRequest(invalid), false);
});

test("hashes login throttling fingerprints without retaining the address", async () => {
  const request = new Request("https://example.com/api/diary/login", {
    headers: { "CF-Connecting-IP": "203.0.113.10" },
  });
  const first = await hashLoginFingerprint(request, secret);
  const second = await hashLoginFingerprint(request, secret);

  assert.equal(first, second);
  assert.doesNotMatch(first, /203\.0\.113\.10/);
});
