# Diary operations

Milestone 7 adds a public Diary and an unlisted publishing workspace.

## Architecture

- D1 stores post metadata and opaque login-throttle records.
- R2 stores photo, video and optional audio bytes.
- The public feed reads only published records.
- Publishing and deletion require a signed, HTTP-only admin session.
- The login route is intentionally absent from navigation, but the URL is not treated as a security control.
- Same-origin checks and SameSite cookies protect state-changing requests.
- Raw IP addresses, passwords and session tokens are never written to D1.
- Audio uploads require an explicit ownership or publishing-permission confirmation.

The existing `VISITOR_DB` binding is reused so the live visitor counter is not disrupted. Its name is historical; it now contains both visitor and Diary tables.

## Local setup

1. Copy `.dev.vars.example` to `.dev.vars`.
2. Replace every placeholder. Use a unique admin passphrase and a random session secret of at least 32 characters.
3. Build and start the local Pages-compatible preview:

```powershell
npm run dev:pages
```

4. Open `/diary/` for the public feed. Type `/login/` manually for the private entrance.

The preview applies checked-in migrations automatically and runs the real Pages Function modules with a local SQLite database and filesystem-backed R2 adapter. Local data is kept under the ignored `.wrangler/local-diary-preview/` directory. The standard Vinext preview renders the pages but does not run those APIs.

## Hosted setup

Do not merge or deploy this milestone until the following resources and secrets exist:

- R2 bucket: `chitthway-portfolio-diary`
- R2 binding: `DIARY_MEDIA`
- Existing D1 binding: `VISITOR_DB`
- Secret: `DIARY_ADMIN_PASSWORD`
- Secret: `DIARY_SESSION_SECRET`
- Existing secret: `VISITOR_TOKEN_SECRET`

Apply the checked-in migrations to the remote database before enabling publishing:

```powershell
npx wrangler d1 migrations apply chitthway-portfolio-visitors --remote
```

Keep the R2 bucket private; media is delivered only through the portfolio's checked API routes.

## Publishing limits

- Photo/video: JPEG, PNG, WebP, GIF, MP4 or WebM; maximum 25 MB.
- Optional audio: MP3, M4A, WAV, OGG or WebM; maximum 12 MB.
- Every media item requires a written description.
- Captions for video or audio should include important spoken content; timed VTT track uploads are not part of this milestone.
- Audio requires a title or credit and confirmation of publishing rights.
- Posts are public immediately after a successful upload and D1 insert.
