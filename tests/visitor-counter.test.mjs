import assert from "node:assert/strict";
import test from "node:test";
import {
  createVisitorCookie,
  getPerthWeekStart,
  hashVisitorIdentifier,
  readVisitorIdentifier,
  shiftDate,
} from "../server/visitor-store.js";

const secret = "test-only-secret-with-enough-entropy";

test("creates and validates a signed anonymous visitor cookie", async () => {
  const created = await createVisitorCookie(secret);
  const cookieValue = created.header.split(";", 1)[0];
  const request = new Request("https://portfolio.example", {
    headers: { Cookie: cookieValue },
  });

  assert.equal(await readVisitorIdentifier(request, secret), created.identifier);
  assert.match(created.header, /HttpOnly/);
  assert.match(created.header, /Secure/);
  assert.match(created.header, /SameSite=Lax/);
});

test("rejects a visitor cookie whose signature was changed", async () => {
  const created = await createVisitorCookie(secret);
  const cookieValue = created.header.split(";", 1)[0];
  const request = new Request("https://portfolio.example", {
    headers: { Cookie: `${cookieValue}changed` },
  });

  assert.equal(await readVisitorIdentifier(request, secret), null);
});

test("uses stable hashes without exposing the visitor identifier", async () => {
  const identifier = "c53cbff4-4593-4fe5-a4eb-fb49da4bb767";
  const first = await hashVisitorIdentifier(identifier, secret);
  const second = await hashVisitorIdentifier(identifier, secret);

  assert.equal(first, second);
  assert.doesNotMatch(first, new RegExp(identifier));
});

test("starts each Perth week on Monday", () => {
  assert.equal(getPerthWeekStart(new Date("2026-08-23T15:59:00.000Z")), "2026-08-17");
  assert.equal(getPerthWeekStart(new Date("2026-08-23T16:01:00.000Z")), "2026-08-24");
  assert.equal(shiftDate("2026-08-24", -7), "2026-08-17");
});
