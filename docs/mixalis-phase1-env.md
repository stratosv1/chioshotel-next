# /mixalis Phase 1 environment variables

The private Physics workspace requires these production/preview environment variables before login is enabled:

- `MIXALIS_USERNAME` — optional; defaults to `mixalis`.
- `MIXALIS_PASSWORD_HASH` — required; format: `<salt>:<scrypt-hash-hex>`.
- `MIXALIS_SESSION_SECRET` — required; random secret of at least 32 characters.

Do not commit real values to GitHub.

## Generate a password hash locally

Use Node.js built-in crypto (no extra dependency):

```bash
node -e "const c=require('node:crypto');const p=process.argv[1];const salt=c.randomBytes(16).toString('hex');const hash=c.scryptSync(p,salt,32).toString('hex');console.log(salt+':'+hash)" "YOUR_NEW_PASSWORD"
```

Copy only the generated `salt:hash` output into `MIXALIS_PASSWORD_HASH` in the deployment environment.

## Generate a session secret locally

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Store the output as `MIXALIS_SESSION_SECRET` in the deployment environment.
