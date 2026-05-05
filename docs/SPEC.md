# SPEC.md — Adwokaci Zakopane

> Pełna specyfikacja w Supabase `project_spec` (project_id: bbeca292-cbea-4a8f-aba9-deedf51cf0b6)

## 1. Commands

```bash
npm install
npm run build          # node src/build.js → dist/
npx serve dist/ -p 3000
npx eslint src/
npx tsc --noEmit

# Workers
cd workers/contact-form && npx wrangler dev
cd workers/admin && npx wrangler dev
cd workers/{name} && npx wrangler deploy
```

## 2. Testing

- **Framework:** brak (statyczny site)
- **Strategy:** Manual verification per faza
- **Lighthouse thresholds:** Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 95
- **mail-tester.com:** ≥ 8/10

## 3. Project Structure

```
src/
├── content/site.json      # Treść strony — single source of truth
├── templates/             # Szablony HTML (index, polityka, nota)
├── styles/main.css        # CSS: custom properties, responsive, animations
├── scripts/main.js        # Vanilla JS: scroll animations, form handler
└── build.js               # Generator: site.json → dist/

workers/
├── contact-form/          # CF Worker: POST /api/contact → Resend
│   ├── src/index.ts
│   └── wrangler.toml
└── admin/                 # CF Worker: /admin panel + GitHub API
    ├── src/index.ts
    ├── src/panel.html
    └── wrangler.toml

dist/                      # Build output (gitignored)
docs/                      # Dokumentacja
```

## 4. Code Style

**Prefer:** Vanilla JS, CSS custom properties, semantic HTML5, const > let, early returns, template literals, TypeScript strict w workers

**Avoid:** Frameworki JS (React/Vue), CSS-in-JS/Tailwind, jQuery, `any` type, console.log, inline styles

**Naming:** pliki kebab-case, CSS BEM-lite, Workers PascalCase exports, site.json snake_case keys

## 5. Git Workflow

- **Branching:** main ← feature/*, fix/*
- **Commits:** Conventional Commits (feat:, fix:, docs:, ci:)
- **PR:** BYŁO/MA BYĆ + link do fazy
- **Protection:** status checks + up-to-date
- **Deploy:** push main → CF Pages auto-deploy

## 6. Boundaries

### Always
- npm run build przed commit
- eslint zero warnings
- Semantic HTML, alt text, ARIA labels
- CSP headers, MIME whitelist, font fallbacks

### Ask First
- Nowa zależność npm
- Zmiana schematu site.json
- Deploy Worker produkcja
- DNS zmiany
- Merge PR, nowy endpoint

### Never
- Push na main bezpośrednio
- Hardcoded secrets
- Frameworki JS, Supabase
- SVG upload, Google Analytics
- Usuwanie danych produkcyjnych
