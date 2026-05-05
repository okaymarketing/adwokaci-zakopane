# CLAUDE.md — Adwokaci Zakopane

## Projekt

Strona kancelarii prawnej adwokaci.zakopane.pl. Migracja z CMSfly na Cloudflare Pages + Workers.

## Stack

- **Frontend:** Statyczny HTML/CSS + vanilla JS (zero frameworków)
- **Content:** `src/content/site.json` — single source of truth
- **Generator:** `src/build.js` (Node) — site.json → dist/
- **Hosting:** Cloudflare Pages (dist/)
- **Formularz:** CF Worker + Resend (workers/contact-form/)
- **Admin CMS:** CF Worker + GitHub API (workers/admin/)
- **Obrazy:** Cloudflare R2 (bucket: adwokaci-assets)
- **Auth:** CF Access na /admin
- **DNS:** Cloudflare (adwokaci.zakopane.pl)

## Komendy

```bash
npm install
npm run build          # node src/build.js → dist/
npx serve dist/ -p 3000  # local preview
npx eslint src/
npx tsc --noEmit

# Workers
cd workers/contact-form && npx wrangler dev
cd workers/admin && npx wrangler dev
```

## Struktura

```
src/
├── content/site.json      # Treść strony
├── templates/             # Szablony HTML
├── styles/main.css        # CSS custom properties, responsive
├── scripts/main.js        # Vanilla JS: scroll, form
└── build.js               # Generator
workers/
├── contact-form/          # POST /api/contact → Resend
└── admin/                 # /admin panel + GitHub API
dist/                      # Build output (gitignored)
docs/                      # Dokumentacja projektu
```

## Zasady kodu

### Preferuj
- Vanilla JS — zero frameworków
- CSS custom properties
- Semantic HTML5 (header, nav, main, section, footer)
- const > let, arrow functions, early returns
- Template literals w build.js
- TypeScript strict w workers/

### Unikaj
- React, Vue, Svelte — nie potrzebne
- CSS-in-JS, Tailwind — czysty CSS
- jQuery, lodash — vanilla only
- `any` type w Workers
- console.log w produkcji
- Inline styles w HTML

### Naming
- Pliki: kebab-case (main.css, build.js)
- CSS classes: BEM-lite (section__title, hero--dark)
- Workers: PascalCase exports, camelCase functions
- JSON keys: snake_case w site.json

## Boundaries

### Always
- `npm run build` musi przejść przed commit
- eslint bez warnings
- Semantic HTML, alt text na img, ARIA labels
- CSP headers w _headers
- MIME whitelist na upload
- font-family z generic-family fallback

### Ask First
- Nowa zależność npm
- Zmiana schematu site.json
- Deploy Worker produkcja
- Zmiana DNS
- Merge PR na main
- Nowy endpoint API

### Never
- Push na main bezpośrednio
- Hardcoded API keys/tokeny
- Frameworki JS (React, Vue)
- Supabase w tym projekcie
- Usuwanie danych site.json
- SVG upload (XSS risk)
- Google Analytics
- Wyłączanie CSP headers

## Git workflow

- Branching: main ← feature/*, fix/*
- Commits: Conventional Commits (feat:, fix:, docs:, ci:)
- PR: format BYŁO/MA BYĆ + link do fazy
- Branch protection: status checks + up-to-date

## TC Integration

- **Supabase project:** srbuwyptdemfnktbviwd
- **Project ID:** bbeca292-cbea-4a8f-aba9-deedf51cf0b6
- **Slug:** adwokaci-zakopane
- **PRD:** w project_prd
- **7 faz:** w project_phases (F1-F7)
- **SPEC:** w project_spec
- **Brain routing:** model_required per faza
