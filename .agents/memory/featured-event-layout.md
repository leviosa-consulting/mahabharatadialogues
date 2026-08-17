---
name: Featured event layout
description: How the homepage featured event card is structured after the Task #1 refactor.
---

# Featured event layout

## Rule
The featured "COMING UP NEXT" card lives in a dedicated `<section>` in normal document flow, placed after the grey CTA strip (`bg-white/70`) inside `UpcomingEventsClient`. It is NOT absolutely positioned and does NOT overlap the hero.

## Why
The old pattern used `position: absolute; top: 0; -mt-[20%]` on the card plus a JS-measured dynamic spacer div to push the section height to match the card. This made the CTA strip position unpredictable (it appeared far below the fold when a featured event existed).

## How to apply
- Hero height: `h-[78vh] sm:h-[82vh]` in `src/components/Hero.tsx`
- CTA strip padding: `py-8 sm:py-12 xl:py-20` — do NOT restore `py-24` on mobile
- Featured card section: a `<section>` with the same blue textured background, `flex justify-center`, card inside `max-w-[520px] w-[calc(100%-2rem)] bg-[#1D5C75CC] my-10`
- `featuredCardHeight` state, `featuredCardRef` ref, and the resize useEffect are all removed — do not re-add them
- `useRouter`, `useRef`, `useEffect`, `TestimonialsCarousel`, `MobileNavbarScroll`, `TestimonialsSection` imports are removed from UpcomingEventsClient — they were unused
