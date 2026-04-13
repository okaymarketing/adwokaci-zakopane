# okay.marketing — Project Template

Template repozytorium dla projektów klientów okay.marketing.

## Co zawiera

- `.github/workflows/codeql.yml` — CodeQL security scan (SAST)
- `.github/workflows/check.yml` — CI: tsc + eslint + build
- `.github/dependabot.yml` — automatyczne update'y zależności
- `docs/SPEC.md` — szablon PAF SPEC.md (6 filarów)
- `docs/SETUP.md` — instrukcja konfiguracji GitHub Settings
- `.eslintrc.json` — ESLint config
- `tsconfig.json` — TypeScript strict
- `.gitignore` — Next.js standard

## Użycie

1. GitHub → New repository → Template: `okaymarketing/project-template`
2. Postępuj wg `docs/SETUP.md` (branch protection, Dependabot alerts)
3. Wypełnij `docs/SPEC.md` z Opus w Claude.ai (Warstwa 3 PAF)
4. Brain + Code Agent przejmują realizację faz

## Stack

- Next.js 16 + React 19
- Tailwind CSS 4
- TypeScript 5 (strict)
- Supabase (jeśli wymaga backendu)
- Vercel / Netlify (hosting)
