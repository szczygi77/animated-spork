# VIGIL 3.0 — web (Cyber-Pro dashboard)

React + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui + Framer Motion + Lucide.

## Uruchomienie

**Z folderu `vigil-web` (zalecane):**

```bash
cd vigil-web
npm install
npm run dev
```

**Z głównego folderu repozytorium `vigil/` (bez `cd`):**

```bash
npm run install:web
npm run dev
```

Otwórz w przeglądarce adres z terminala (domyślnie **http://localhost:5173** lub **http://127.0.0.1:5173**).

### Gdy „nic nie działa”

1. **Musisz być w `vigil-web` albo użyć skryptów z głównego `package.json`** — sam plik HTML (`vigil_3_mockup_v2.html`) to nie jest ta aplikacja React.
2. **Najpierw `npm install`** w `vigil-web` (albo `npm run install:web` z katalogu `vigil/`).
3. **Node.js** — Vite 8 wymaga nowszego Node (np. **20+**). Sprawdź: `node -v`.
4. **Port zajęty** — jeśli 5173 jest zajęty, uruchom: `cd vigil-web && npx vite --port 5174`.
5. **Biała strona** — otwórz narzędzia deweloperskie (F12) → zakładka **Console** i zobacz, czy jest błąd czerwony; wtedy skopiuj komunikat.

## Build produkcyjny

```bash
npm run build
npm run preview
```

## Struktura

- `src/components/dashboard/Dashboard.tsx` — główny widok rodzica (Bento, gauge, ochrona, feed zagrożeń, Zero Cloud, Evidence Vault)
- `src/components/ui/*` — komponenty shadcn

Motyw: klasa `dark` na `<html>` (paleta obsidian + Guardian Blue w `src/index.css`).
