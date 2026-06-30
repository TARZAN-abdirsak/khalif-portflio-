# Khalif Rooble — Portfolio

Single-page portfolio for Khalif Rooble, independent consultant in financial
management, project management, ERP consultancy, and business development.

Built with **React 18**, **TypeScript**, and **Vite**.

## Stack

- React 18 + TypeScript (strict)
- Vite 5 (dev server + bundler)
- Plain CSS with CSS variables — no UI framework
- Google Fonts: Instrument Serif, Geist, Geist Mono

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

## Scripts

| Script             | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `npm run dev`      | Vite dev server with HMR                    |
| `npm run build`    | Type-check then build to `dist/`            |
| `npm run preview`  | Serve the production build locally          |
| `npm run typecheck`| Type-check only (no emit)                   |

## Project layout

```
src/
├── App.tsx                # Page composition
├── main.tsx               # React entry
├── index.css              # Global styles + design tokens
├── types.ts               # Shared TypeScript types
├── data/                  # Static content (skills, engagements, etc.)
│   ├── about.ts
│   ├── approach.ts
│   ├── engagements.ts
│   └── skills.tsx
├── hooks/
│   ├── useCursor.ts       # Custom cursor follow + hover scale
│   └── useReveal.ts       # IntersectionObserver scroll reveals
└── components/
    ├── About.tsx
    ├── Approach.tsx
    ├── Contact.tsx
    ├── Cursor.tsx
    ├── Engagements.tsx
    ├── Expertise.tsx
    ├── Footer.tsx
    ├── Hero.tsx
    ├── Marquee.tsx
    ├── SectionHead.tsx
    ├── SkillCard.tsx
    └── TopBar.tsx
```

## Customizing content

Edit the data files in [src/data/](src/data) — copy, stats, engagements, and
skill capabilities all live there. The contact email is in
[src/components/Contact.tsx](src/components/Contact.tsx).
