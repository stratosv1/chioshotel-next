# /mixalis Phase 1 security notes

- Authentication fails closed when required environment secrets are missing.
- Password verification uses Node.js `scrypt` and timing-safe comparison.
- Session token is signed with HMAC-SHA256 and has an expiration.
- Session cookie is `HttpOnly`, `SameSite=Lax`, secure in production, and scoped to `/mixalis`.
- No production password or secret is committed to source control.
- Private routes are protected server-side by the `/mixalis/(private)` layout.
- Phase 1 does not yet expose private data APIs.
- Login rate limiting should be added before production exposure if the route is made internet-accessible with real credentials.
