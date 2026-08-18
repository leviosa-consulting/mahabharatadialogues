---
name: Firebase private key normalization
description: How FIREBASE_PRIVATE_KEY must be handled in firebaseAdmin.ts — users often paste raw base64 without PEM headers.
---

# Firebase private key normalization

## The rule
`FIREBASE_PRIVATE_KEY` from Replit secrets frequently arrives in a broken format. Always normalize it before passing to `admin.credential.cert()`.

**Why:** Users paste the key in various ways — raw base64 body only (no `-----BEGIN PRIVATE KEY-----` header), with surrounding JSON quotes, or with literal `\n` instead of real newlines. Firebase Admin's parser throws `error:1E08010C:DECODER routines::unsupported` for any of these.

## How to apply
The normalization is already in `src/firebase/firebaseAdmin.ts`:
1. Strip surrounding double-quotes
2. Replace literal `\n` with real newlines
3. If no `-----BEGIN` header is found, reconstruct proper PEM format with 64-char line wrapping

## Diagnostic pattern
If the error recurs, temporarily log:
- `privateKey.slice(0, 30)` — should start with `-----BEGIN PRIVATE KEY-----`
- `privateKey.includes("\\n")` / `privateKey.includes("\n")` — reveals newline format
- `privateKey.length` — a valid 2048-bit RSA key is ~1700 chars in PEM form
