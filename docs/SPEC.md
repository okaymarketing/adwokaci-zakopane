# SPEC.md — [NAZWA PROJEKTU]

> Wypełnij ten dokument z Opus w Claude.ai podczas Warstwy 3 PAF.
> Każda sekcja odpowiada jednemu z 6 filarów PAF SPEC.
> Po wypełnieniu: Opus wstawia do `project_spec` w Supabase.

---

## 1. Commands

```bash
# Instalacja
npm install

# Development
npm run dev

# Build
npm run build

# Testy
npm test

# Lint
npm run lint

# Sprawdzenie typów
npx tsc --noEmit
```

## 2. Testing

- **Framework:** vitest
- **Lokalizacja:** `__tests__/` obok plików lub `tests/`
- **Naming:** `*.test.ts` / `*.test.tsx`
- **Mocking:** vitest built-in (`vi.mock`, `vi.fn`)
- **Pokrycie minimalne:** 80% na nowych plikach
- **Uruchamianie:** `npm test` (CI) / `npm test -- --watch` (dev)

## 3. Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx
│   ├── page.tsx
│   └── (routes)/
├── components/       # React components
│   ├── ui/           # Shadcn/ui
│   └── [feature]/    # Feature-specific
├── lib/              # Utilities, helpers, API clients
│   ├── supabase.ts   # Supabase client
│   └── utils.ts
├── types/            # TypeScript types
└── styles/           # Global styles (minimal — use Tailwind)
```

**Reguły importów:**
- `@/` = `src/`
- Komponenty importują z `@/components/`
- Lib importuje z `@/lib/`
- Brak circular imports

## 4. Code Style

**Prefer:**
- TypeScript strict mode (no `any`, no `as` without good reason)
- Server Components (default) over Client Components
- Tailwind CSS classes over custom CSS
- Shadcn/ui components over custom UI
- `const` over `let`, arrow functions
- Early returns over nested `if`

**Avoid:**
- `any` type
- `console.log` w kodzie produkcyjnym
- CSS modules, styled-components
- `useEffect` do data fetching (używaj Server Components)
- Hardcoded strings (używaj zmiennych/const)

**Naming:**
- Components: PascalCase (`ProjectHeader.tsx`)
- Utils/hooks: camelCase (`useProject.ts`, `formatDate.ts`)
- Types: PascalCase z suffix (`ProjectProps`, `UserResponse`)
- Files: kebab-case dla routes, PascalCase dla komponentów

## 5. Git Workflow

- **Branching:** `main` (production) ← `develop` (staging) ← `feature/*`, `fix/*`
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `ci:`, `build:`)
- **PR:** Opis BYŁO/MA BYĆ, linkuj do fazy PAF
- **Branch protection (main):**
  - ✅ Require status checks: `check`, `CodeQL Analysis`
  - ✅ Require branches to be up to date
- **Auto-merge:** Dependabot minor/patch PRs po zielonym CI

## 6. Boundaries

### Always (Brain/Code Agent robi automatycznie)
- Uruchom `tsc --noEmit` przed commit
- Uruchom `eslint` przed commit
- Użyj Supabase RLS na nowych tabelach
- Stwórz Server Component jeśli nie potrzeba interaktywności
- Dodaj puste stany (empty states) do komponentów UI

### Ask First (Brain pyta Grega)
- Dodanie nowej zależności npm
- Zmiana schematu bazy danych
- Deploy na produkcję
- Merge PR na main
- Zmiana public API / endpointów
- Dodanie nowego Shadcn/ui component

### Never (Brain nigdy nie robi)
- Nie usuwaj istniejących danych produkcyjnych
- Nie pushuj bezpośrednio na main (zawsze przez PR)
- Nie hardcoduj API keys, tokenów, haseł
- Nie dodawaj `any` type bez komentarza uzasadniającego
- Nie wyłączaj ESLint reguł bez komentarza
- Nie merguj bez zielonego CI + CodeQL
