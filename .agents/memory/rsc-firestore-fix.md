---
name: RSC Firestore serialization fix
description: How to prevent Firestore Admin SDK objects from leaking into the RSC payload and causing SyntaxError in the browser.
---

## The problem
When a Next.js RSC (server component) does `{ id: doc.id, ...doc.data() }` and passes the result as props to a client component, the Firestore Admin SDK serializes the **entire SDK class tree** (DocumentReference, Timestamp, QuerySnapshot, Serializer, FieldPath, Query, …) into the RSC payload as `$E(class Foo {...})` eval entries. The browser fails to eval these private-field class definitions → `SyntaxError: Invalid or unexpected token`.

This also happens transitively: if a data field is a Firestore `Timestamp`, its prototype chain is serialized even if the data looks like a plain object.

## The fix
Add a recursive `toPlain` helper and apply it at the Firestore boundary:

```typescript
function toPlain(value: unknown): unknown {
  if (value === null || value === undefined) return value
  // Firestore Timestamp has a toDate() method
  if (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).toDate === 'function'
  ) {
    return ((value as Record<string, unknown>).toDate as () => Date)().toISOString()
  }
  if (Array.isArray(value)) return value.map(toPlain)
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(value as object)) {
      out[key] = toPlain((value as Record<string, unknown>)[key])
    }
    return out
  }
  return value
}

// Usage:
const items = snapshot.docs.map(doc => toPlain({ id: doc.id, ...doc.data() }) as MyType)
```

Alternatively, use an explicit field-pick object so no unknown fields can sneak through.

## Files already fixed
- `src/lib/data/pageSettings.ts` — explicit pick()
- `src/lib/data/blogs.ts` — toPlain() recursive helper (runtime export removed)
- `src/components/RetreatHero.tsx` — toPlainViaJSON() helper

**Why:** `doc.data()` returns Firestore SDK objects (Timestamp, DocumentReference) for date/reference fields; spreading them makes RSC serialize the entire SDK class tree.

**How to apply:** Any `async function` in a server component that reads from adminDB must apply `toPlain()` (or an explicit field pick) before returning data that will be passed to client components.

## Critical: `runtime` and `revalidate` must only be in page/layout/route files
`export const runtime = 'nodejs'` and `export const revalidate = N` are only valid in **page-level files** (`page.tsx`, `layout.tsx`, `route.ts`). Putting them in a lib or component file causes Next.js to import the module outside the React rendering tree → Fast Refresh SyntaxError loop + potential 500 errors.

## Root layout must declare `runtime = 'nodejs'`
`src/app/layout.tsx` calls `getPageSettings()` (firebase-admin). The root layout MUST have `export const runtime = 'nodejs'` or every page fails with a 500 because firebase-admin cannot run in the Edge runtime. This declaration propagates to all child pages automatically.

## Pages that also need `runtime = 'nodejs'` (belt-and-suspenders)
Any page that imports from a lib that uses firebase-admin directly should also declare `runtime = 'nodejs'`:
- `src/app/blogs/[slug]/page.tsx` (uses getBlogs)
- `src/app/events/[slug]/page.tsx` (uses FooterWithBlogs → getBlogs)
- `src/app/retreats/past/[slug]/page.tsx`
- `src/app/about/page.tsx`
- `src/app/products/[slug]/page.tsx`
