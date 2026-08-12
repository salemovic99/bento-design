# Entrecôte Café de Paris — single-page site

A bilingual (EN / AR), single-page, bento-composed site for Entrecôte Café de
Paris — Chez Boubier 1930.

```
header → hero → story → bento signature dishes → bento branches
       → reservation → footer
```

Each boundary is a scroll-linked bridge rather than a hard cut, so the page
reads as one continuous take. The tonal arc runs dark → dark → dark → cream →
dark → dark; the light branches section is a deliberate breath in the middle.

## Requirements

**Node.js ≥ 20.9** — Next.js 16 refuses to run on anything older. The site was
authored on a Node 18 machine, so `next dev`, `next build` and the shadcn CLI
were never executed here; `tsc --noEmit` and `eslint` were, and both pass.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
npx tsc --noEmit
```

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) · React 19 |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Components | shadcn/ui on Radix (`components/ui/`) |
| Motion | Framer Motion 13 |
| Icons | lucide-react 1.x |
| Dates | react-day-picker 9 |

## Layout

```
app/
  layout.tsx          fonts, metadata, <LanguageProvider>
  page.tsx            section order and the bridges between them
  globals.css         brand tokens + semantic type classes
components/
  site/               every section and its parts
  ui/                 shadcn primitives, themed to the brand
content/
  story.ts            the four heritage beats on the timeline
  dishes.ts           bento tiles, incl. their grid spans
  branches.ts         locations, incl. their map pin positions
  site.ts             phone, socials, service hours, legal links
lib/
  i18n/               dictionary, provider, plural rules
  motion.ts           the shared motion vocabulary
  utils.ts            cn()
```

Content is fully separated from presentation. Every localized field is
`{ en, ar }`, and the bento asymmetry lives in the data as Tailwind span
strings — adding, resizing or reordering a tile is a data edit, not a JSX one.

## Design system

`../colors_and_type.css` (Brand Guideline Vol.04) is the read-only source of
truth. `app/globals.css` is its Tailwind v4 port: the green and gold scales,
cream, the restrained radii, the `--ease` / `--dur` motion pair, and the
`.e-display` / `.e-h1…h4` / `.e-body` semantic type classes — with the
guideline's fixed desktop px expressed as `clamp()` so the editorial scale
holds from 375 px to 1920 px.

Two deliberate deviations, both for legibility:

- **Satin gold on cream.** `#bb9d5a` reads at 7.2:1 on the deep green ground
  but only 2.2:1 on cream. Light sections use `.e-eyebrow-ink`
  (`--color-gold-800`, 6.7:1). Same hue family, legible on both grounds.
- **Arabic-Indic vs Latin digits.** Editorial copy keeps Arabic-Indic
  (`منذ ١٩٣٠`); functional data — times, prices, phone numbers, dates — uses
  Latin digits, which is the Saudi UI convention and keeps `tel:` links and
  opening hours scannable. Dates use `ar-SA-u-ca-gregory-nu-latn`, since plain
  `ar-SA` resolves to the Umm al-Qura calendar.

### Typefaces

Gotham is the brand's licensed Latin face and is not freely embeddable, so
**Montserrat** stands in, per the guideline's own substitution note. Swap
`app/layout.tsx` and `--font-sans` for licensed Gotham webfonts in production.
Arabic has no Gotham equivalent; **IBM Plex Sans Arabic** carries the RTL side.

## Bilingual behaviour

`lib/i18n/language-provider.tsx` holds the choice in `localStorage`, read
through `useSyncExternalStore` so hydration stays clean. Switching updates
`<html lang>` and `<html dir>`, replays the section reveals, and re-renders
every string from `lib/i18n/dictionary.ts`. Radix reads direction from the
`Direction.Provider` in the same file.

Layout flips via CSS logical properties (`ps-*`, `me-*`, `start-*`, `text-start`)
rather than mirrored transforms, so the RTL composition is real rather than
accidental. Guest counts resolve through `Intl.PluralRules`, giving Arabic its
dual (`ضيفان`) and its 11–99 form (`ضيفًا`).

## Motion

All choreography comes from `lib/motion.ts`. Only `transform`, `opacity` and
`clip-path` are animated — never `width`, `height`, `top` or `left`. The header
condenses entirely through `scale`, `opacity` and `backdrop-filter`, so its box
height never changes and no scroll frame costs a layout pass.
`prefers-reduced-motion` collapses every variant to a plain fade, and the
scroll-linked parallax renders as still images.

## Before launch

- [ ] **Replace the placeholder photography.** `public/dishes/` holds three
      Unsplash stand-ins — see `public/dishes/CREDITS.md`, then delete it.
      Everything in `public/brand/` and `public/branches/` is real brand assets.
- [ ] **Replace the placeholder details.** Every file under `content/` carries a
      `PLACEHOLDER DATA` header noting exactly what is invented: prices, phone
      numbers, street addresses, opening hours, social handles, map coordinates.
- [ ] **Have the house verify the story copy.** `content/story.ts` treats only
      "1930" and "Geneva" as fact and names no dates or people beyond them; the
      rest is written to the spirit of the formula and needs confirming.
- [ ] **Wire the reservation form.** It validates and confirms client-side only;
      see the `TODO` in `components/site/reservation-form.tsx`.
- [ ] **Add the legal pages.** `/privacy` and `/terms` are linked but do not exist.
- [ ] Consider licensing Gotham and swapping out Montserrat.

## Notes

`lucide-react` v1 removed its brand glyphs, so the four social marks are drawn
in `components/site/brand-icons.tsx` on Lucide's own 24 px grid at matching
stroke weight. Everything else uses Lucide directly.

The map tile is a drawn SVG, not an embed — there is no Maps API key in this
project, and a Google iframe would pull a third-party script and a grey basemap
into the middle of the composition. Each branch still links out to Google Maps
by coordinate.
