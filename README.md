# Adwokaci Zakopane

Strona kancelarii prawnej [adwokaci.zakopane.pl](https://adwokaci.zakopane.pl)

## Stack

- Statyczny HTML/CSS + vanilla JS (zero frameworków)
- Treść: `src/content/site.json`
- Generator: `src/build.js` (Node)
- Hosting: Cloudflare Pages
- Formularz kontaktowy: CF Worker + Resend
- Admin CMS: CF Worker + GitHub API
- Obrazy: Cloudflare R2
- Auth: CF Access

## Development

```bash
npm install
npm run build        # Generuje dist/
npx serve dist/      # Preview http://localhost:3000
```

## Deploy — secrets

Formularz kontaktowy działa jako **Cloudflare Pages Function** (`functions/api/contact.ts`),
nie jako standalone Worker. Z tego powodu sekrety konfigurujemy w UI CF Pages,
a nie przez `wrangler secret put`.

**CF Pages → Settings → Environment variables → Production:**

| Nazwa            | Typ        | Wartość                       |
|------------------|-----------|-------------------------------|
| `RESEND_API_KEY` | Encrypted | `re_…` (klucz Resend)         |

Po zmianie zmiennych wykonaj redeploy (Pages buduje przy każdym pushu, ale env-y wymagają
nowego deploya, by trafić do runtime'u).

> Katalog `workers/contact-form/` zostaje jako archiwum — nie jest deployowany.

## Dokumentacja

- [CLAUDE.md](./CLAUDE.md) — zasady projektu dla AI agentów
- [AGENTS.md](./AGENTS.md) — instrukcja dla Code Agent
- [docs/SPEC.md](./docs/SPEC.md) — specyfikacja techniczna (6 filarów PAF)
- [docs/SETUP.md](./docs/SETUP.md) — konfiguracja repo

## Fazy projektu

| # | Faza | Model | Status |
|---|------|-------|--------|
| 1 | Schema site.json + HTML/CSS | Flash | pending |
| 2 | CF Pages deploy + domain | Flash | pending |
| 3 | Formularz kontaktowy (Resend) | Flash | pending |
| 4 | Admin panel /admin | Sonnet | pending |
| 5 | R2 image storage | Flash | pending |
| 6 | SEO/GEO + PAF L1 | Flash | pending |
| 7 | QA + launch | Flash | pending |

## TC Integration

Projekt zarządzany przez [TailorCode](https://github.com/okaymarketing/tailor-code). PRD, fazy i SPEC w Supabase.
