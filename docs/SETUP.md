# SETUP.md — Konfiguracja nowego projektu

Po stworzeniu repo z template, wykonaj te kroki:

## 1. GitHub Settings (2 min)

### Settings → Code security and analysis
- ✅ Dependency graph → Enable
- ✅ Dependabot alerts → Enable
- ✅ Dependabot security updates → Enable
- ✅ Dependabot malware alerts → Enable

### Settings → Branches → Add rule (main)
- Branch name pattern: `main`
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - Required checks: `check`, `CodeQL Analysis (javascript-typescript)`
- ✅ Require branches to be up to date before merging

## 2. Vercel / Netlify (3 min)

- Import repo do Vercel lub Netlify
- Framework: Next.js
- Ustaw env variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, etc.)
- Automatyczne preview deploys na PR

## 3. Supabase (jeśli potrzebny)

- Stwórz nowy projekt lub użyj istniejącego
- Włącz RLS na wszystkich tabelach
- Dodaj SUPABASE_URL i klucze do env

## 4. PAF SPEC

- Wypełnij `docs/SPEC.md` z Opus w Claude.ai
- Opus wstawia dane do `project_spec` w Supabase TC
- Brain od teraz zna reguły projektu

## 5. Rejestracja w TailorCode

Brain musi wiedzieć o nowym projekcie:
```sql
UPDATE projects SET 
  repo_url = 'https://github.com/okaymarketing/[REPO_NAME]',
  production_url = 'https://[DOMAIN]'
WHERE id = '[PROJECT_ID]';
```

Po tym Brain automatycznie:
- Łączy CI events z projektem
- Monitoruje production_url (infra_checks)
- Linkuje emaile od klienta
- Trackuje koszty tokenów per projekt
