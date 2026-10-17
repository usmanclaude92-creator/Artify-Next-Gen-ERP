# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project purpose

Artify Financial Ecosystem, short name AFE (formerly "Artify Next Gen ERP") is a front-end prototype/demo of a full enterprise ERP suite — 17 modules covering Finance, Procurement, Sales/CRM, Inventory, Manufacturing, HR, Projects, Budgeting, SCM, Assets, Quality, Construction & Contracts (FIDIC/BOQ), Business Intelligence, Administration, Banking & Treasury, System Management, and Compliance/Risk/Audit (Oman regulatory focus: VAT, COSO/SoD, 5C audit workpapers, Benford's Law fraud analytics). It was scaffolded in Google AI Studio (see `metadata.json`). All data is mocked and held in-memory — there is no backend, database, or auth; nothing persists across a page reload except theme preference.

## Commands

```bash
npm run dev      # vite dev server on port 3000
npm run build    # vite production build
npm run preview  # preview a production build
npm run lint      # tsc --noEmit (this is the only lint/typecheck step)
npm run clean     # rm -rf dist server.js
```

There is no test suite/framework configured (no test script, no test files). Treat `npm run lint` (`tsc --noEmit`) as the correctness gate for any change.

## Architecture

**Stack:** React 19 + TypeScript + Vite 6 + Tailwind CSS 4 (`@tailwindcss/vite` plugin, no `tailwind.config`). No router library — navigation is hand-rolled state. `@google/genai` is a listed dependency for planned AI features but is not currently called anywhere in `src/`; treat AI Command Center / `*AIAssistantModal` / `*AICopilotModal` components as UI shells until real Gemini calls are added.

**Entry point:** `index.html` → `src/main.tsx` → `ThemeProvider` (`src/context/ThemeContext.tsx`, class-based dark mode, persisted to `localStorage['artify_erp_theme']`) → `src/App.tsx`.

**Navigation model (4 levels):** Module → Functional Area → Process → Transaction, typed in `src/types/erp.ts` (`ERPModule` → `ERPFunctionalArea` → `ERPProcess` → `ERPTransaction`) and driven entirely by static data in `src/navigation/data/modules_01_05.ts`, `modules_06_10.ts`, `modules_11_17.ts`, aggregated by `src/navigation/erpHierarchy.ts` into `ERP_MODULES` plus a flattened `ERP_SEARCH_INDEX` (powers the Ctrl/Cmd+K global search modal). Current route is a plain `ERPRouteState` object (`{ view, moduleId?, functionalAreaId?, processId?, transactionId? }`) held in `App.tsx` state — there is no URL routing.

**`App.tsx` dispatch pattern:** for each of the four route views (`module`, `functional_area`, `process`, `transaction`), `App.tsx` branches on `activeModule.id` and renders that module's `*ModuleRunner` component, falling back to a generic `ModuleLandingView`/`FunctionalAreaView`/`ProcessView` for modules without a custom runner. This produces a long, repetitive but consistent block (~1800 lines) — when wiring in a new module runner, add a matching `else if (activeModule.id === '<id>')` branch at all four levels rather than restructuring the dispatch.

**Per-module structure** (`src/modules/<module>/`), consistent across all 17 modules:
- `<Module>ModuleRunner.tsx` — module entry point / section switcher, reads its store via the module's hook.
- `services/<module>Store.tsx` — React Context provider + `use<Module>Store()` hook holding all mock state and business logic (e.g. `FinanceProvider` / `useFinanceStore`). This is the module's only source of truth; there is no shared global store.
- `types/` (`index.ts` or `<module>Types.ts`) — module-local type definitions.
- `components/<functional-area>/<Name>View.tsx` — one view component per functional area/process.
- `data/` — seed/mock data (e.g. `mockAdministrationData.ts`, `initialData.ts`) consumed by the store on init.
- `index.tsx` (some modules only) — barrel re-export, not an alternate entry point.

New modules or features should follow this same shape rather than introducing a new state-management approach.

**Icons:** referenced by lucide-react export name as a plain string in data (`icon: 'BookOpen'`) and rendered via `IconRenderer` (`src/components/common/IconRenderer.tsx`), which looks up `Icons[name]` at runtime with a `Folder`/`FileText` fallback. When adding an `icon` field, use the exact lucide-react component name.

**Path alias:** `@/*` resolves to the repo root (configured in both `tsconfig.json` and `vite.config.ts`) — prefer it for cross-module imports.

**`vite.config.ts` HMR/watch guard:** file watching and HMR are conditionally disabled via `DISABLE_HMR` for the AI Studio agent-edit environment — do not remove this, even though it's not otherwise commented on beyond the inline note.

## Coding rules

- Match the existing per-module structure (`ModuleRunner` + `services/<module>Store.tsx` + `types/` + `components/<area>/`) — don't invent a parallel pattern for a single module.
- Keep mock data and business logic inside the module's store/`data/` files, not inside view components.
- Wire any new module that needs a custom runner into `App.tsx`'s existing per-view branch pattern (all four route levels), matching the surrounding style.
- Use the `@/` alias for root-relative imports.

## Security rules

- `.env*` is gitignored except `.env.example` — never commit real values for `GEMINI_API_KEY` or `APP_URL`.
- `GEMINI_API_KEY` is meant to be injected by the AI Studio runtime from secrets; if you wire up real Gemini calls, never hardcode the key or place it in client-bundled code — route calls through a server context if one is added.
- All financial/HR/customer data currently in the codebase is fictional seed data for the demo. Don't add real customer, employee, or financial data to mock/data files.

## Token-saving rules

- `src/App.tsx` (~1800 lines) and the three `src/navigation/data/modules_*.ts` files (~1000+ lines each) are long and highly repetitive. Don't read them in full — use `Grep` for the specific module id/branch you need, or read a small representative slice, then generalize the pattern.
- Module store files (e.g. `financeStore.tsx`, ~1000 lines) are mostly large mock-data literals (chart of accounts, etc.) followed by a small amount of actual logic near the bottom — grep for the function/hook you need rather than reading the whole file.
- Don't re-read a file immediately after editing it to "confirm" the change.

## Scope discipline

Modify only the files needed for the current task. Do not refactor unrelated modules, reformat untouched files, or "fix" the repetitive `App.tsx` dispatch pattern as a side effect of an unrelated change.
