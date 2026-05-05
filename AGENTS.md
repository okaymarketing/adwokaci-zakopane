# AGENTS.md — Adwokaci Zakopane

## Dla Code Agent (CC CLI / claude-code-action)

Ten plik to instrukcja dla AI agentów pracujących nad tym projektem.

### Kontekst projektu

Strona kancelarii prawnej. Stack: statyczny HTML/CSS + CF Workers. Zero frameworków JS. Treść w `src/content/site.json`.

### Przed rozpoczęciem pracy

1. Przeczytaj CLAUDE.md — pełne zasady projektu
2. Sprawdź task_spec w fazie przypisanej do PR (sekcja BYŁO/MA BYĆ)
3. `npm install` jeśli node_modules nie istnieje
4. `npm run build` aby sprawdzić stan wyjściowy

### Workflow per faza

1. Utwórz branch: `feature/faza-N-opis`
2. Implementuj zgodnie z task_spec (BYŁO → MA BYĆ)
3. Sprawdź OGRANICZENIA z task_spec
4. Uruchom WERYFIKACJA z task_spec
5. `npm run build && npx eslint src/`
6. Commit (Conventional Commits)
7. PR z opisem BYŁO/MA BYĆ

### Krytyczne zasady

- **NIE** dodawaj React, Vue, Next.js, Tailwind — to statyczny site
- **NIE** dodawaj Supabase — treść jest w site.json
- **NIE** hardcoduj sekretów — env vars w Workers
- **TAK** semantic HTML, alt texts, ARIA
- **TAK** CSS custom properties dla theming
- **TAK** TypeScript strict w workers/

### Weryfikacja przed PR

```bash
npm run build                    # Must pass
npx eslint src/ --max-warnings 0 # Zero warnings
ls dist/index.html               # Must exist
```

### Secrets (Greg dodaje ręcznie)

- `CLOUDFLARE_API_TOKEN` — repo secret (CI deploy)
- `CLOUDFLARE_ACCOUNT_ID` — repo secret
- `RESEND_API_KEY` — Worker env (contact-form)
- `GITHUB_TOKEN` — Worker env (admin, scope: repo contents)
