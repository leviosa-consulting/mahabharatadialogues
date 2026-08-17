---
name: RSC Firestore leak fix
description: How Firestore Admin SDK objects leak into RSC payloads and how to prevent it.
---

# RSC Firestore serialization

## Rule
Never pass Firestore Admin SDK objects (Query, QuerySnapshot, DocumentSnapshot, DocumentReference, Timestamp, etc.) as props to client components. They serialize to `$E` eval entries in the RSC payload, which cause `SyntaxError: Invalid or unexpected token` in the browser.

## Why
Next.js 15 RSC serializer uses `$E` (eval) for non-plain values. Firestore Admin SDK class instances contain complex nested objects and function properties that produce malformed JS when eval'd.

## How to apply
- In server data functions, always map Firestore results to plain objects before returning
- Use explicit field picks: `{ id: doc.id, title: String(raw.title ?? '') }`
- For Timestamps: call `.toDate().toISOString()`
- For DocumentReferences: drop them (return `null`)
- Use a `toPlain(value)` recursive helper for nested unknown data (see `src/lib/data/blogs.ts`)
- `getPageSettings` uses `pick()` helper — returns `{ title: String(...), subtitle: String(...) }`
- `getBlogs` uses explicit field mapping with `toPlain()` for Timestamps

## Files fixed
- `src/lib/data/pageSettings.ts`
- `src/lib/data/blogs.ts`
