# Fix: Migracja formularza kontaktowego na CF Pages Functions

**Branch:** `fix/pages-functions-contact`
**Data:** 2026-05-05

## Problem

Worker route `adwokaci.zakopane.pl/api/contact` wymaga DNS zone `zakopane.pl`
w koncie Cloudflare. Greg nie ma tej strefy — dodanie cudzej domeny apex
nie jest możliwe. Standalone Worker więc nie może obsłużyć ścieżki na tej domenie.

## Rozwiązanie

Migracja logiki z `workers/contact-form/src/index.ts` do
`functions/api/contact.ts` (CF Pages Functions). Pages Function jest
deployowana razem ze statyczną stroną i automatycznie mapuje
`functions/api/contact.ts → /api/contact` w obrębie domeny Pages.
Zero potrzeby DNS zone.

## BYŁO / MA BYĆ

### BYŁO
- `workers/contact-form/src/index.ts` — standalone Worker (`fetch` handler)
- Sekret: `wrangler secret put RESEND_API_KEY`
- Wymaga route na zone `zakopane.pl` (niemożliwe)
- Endpoint: `https://adwokaci.zakopane.pl/api/contact` (nie działa bez route)

### MA BYĆ
- `functions/api/contact.ts` — CF Pages Function:
  - `export const onRequestPost: PagesFunction<Env>` — handler POST
  - `export const onRequestOptions: PagesFunction<Env>` — CORS preflight
- Sekret: CF Pages → Settings → Environment variables → Production: `RESEND_API_KEY`
- Endpoint: `/api/contact` (auto-mapping na domenie Pages)
- `functions/tsconfig.json` — strict TS, types z `@cloudflare/workers-types`
  (path do `workers/contact-form/node_modules`, brak nowych devDeps)
- `workers/contact-form/` — zostaje jako **archiwum** (nie deployowane)

## Zachowana logika

Pełna parytetowo skopiowana z Workera:
- Walidacja (name 2-100, email regex+254, subject whitelist, message 10-5000, consent=true)
- Honeypot (`website`) → 200 OK bez wysyłki
- Rate limit per-IP (5 req / 60 s, in-memory Map)
- CORS allowlist (`https://adwokaci.zakopane.pl`, `http://localhost:3000`)
- Resend API call z `escapeHtml` w renderowanym mailu
- 403 dla nieznanego Origin
- 429 / 400 / 502 / 200 — identyczne kody błędów

## Drobne różnice (ze względu na model PagesFunction)

- Routing per-method: `onRequestPost` / `onRequestOptions` zastępują
  ręczny dispatch `request.method` i `url.pathname` z Workera.
- `404 Not found` i `405 Method not allowed` są obsługiwane natywnie
  przez router Pages — dlatego znikły z kodu (były dead code w kontekście
  jednego pliku per ścieżka i metoda).
- Brak `default export { fetch }` — Pages Functions używa nazwanych eksportów.

## Endpoint w site.json

Bez zmian: `src/content/site.json` linia 177 → `"endpoint": "/api/contact"`.
Pages Function automatycznie obsługuje tę ścieżkę.

## Weryfikacja

```bash
./workers/contact-form/node_modules/.bin/tsc --noEmit -p functions/tsconfig.json
# (no output, exit 0) — Functions TS OK

npm run build
# Build OK → dist/
```

## Pliki

- `functions/api/contact.ts` (NEW) — Pages Function
- `functions/tsconfig.json` (NEW) — strict TS dla functions/
- `README.md` — sekcja "Deploy — secrets" + uwaga o archiwum workers/
- `workers/contact-form/` — bez zmian, pozostaje jako archiwum

## Faza

Korekta Fazy 3 (Formularz kontaktowy) — przepięcie z Worker na Pages Function
ze względu na brak DNS zone.
