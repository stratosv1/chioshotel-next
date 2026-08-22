# /mixalis Phase 1 validation checklist

Before merge:

- [ ] `/mixalis/login` renders without the public site header/footer.
- [ ] `/mixalis` redirects to `/mixalis/login` when no valid session exists.
- [ ] Invalid credentials do not create a session.
- [ ] Valid credentials create the signed `HttpOnly` session cookie.
- [ ] Authenticated `/mixalis` renders the dashboard shell.
- [ ] Logout clears the session and returns to login.
- [ ] `/mixalis/chapters/new` requires authentication.
- [ ] `/mixalis/*` contains noindex metadata.
- [ ] `robots.txt` disallows `/mixalis/`.
- [ ] `/mixalis` is not added to sitemap output.
- [ ] Public site header/footer/analytics behavior is unchanged outside `/mixalis`.
- [ ] Production/preview secrets are configured outside GitHub.
- [ ] `npm.cmd run build` passes.
- [ ] Mobile and desktop visual review passes.
