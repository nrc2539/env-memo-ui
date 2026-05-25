# env-memo-ui

## Commands

```sh
npm run dev      # vite dev server on port 3000
npm run build    # tsc -b && vite build (runs typecheck before build)
npm run lint     # eslint .
```

## Tech stack

- React 19, TypeScript 6, Vite 8, Tailwind CSS 4, React Router 7
- TanStack Query 5, Formik 2 + Yup 1, @tabler/icons-react
- Tailwind v4 — uses `@import "tailwindcss"` not `@tailwind` directives

## TypeScript quirks

- `verbatimModuleSyntax: true` — use `import type` for type-only imports
- `erasableSyntaxOnly: true` — no enums or namespaces
- `noUnusedLocals` / `noUnusedParameters` both on

## Architecture

- Feature-based layout under `src/features/` (auth, dashboard)
- Component pattern (see `.agents/skills/create-component/SKILL.md`):
  `interface.ts` → `[Component].tsx` (pure view, JSX only)
  `with[Component].tsx` (HOC with hooks/logic) → `index.ts` (re-exports HOC)
  Skip HOC if component has no hooks — then `[Component].tsx` becomes `index.tsx`
- Shared components live in `src/components/`, not in features
- Entry: `src/main.tsx` → `Root.tsx` (QueryClientProvider) → `App.tsx` (RouterProvider)

## Skills

- `create-component` — create React components (with or without HOC)
- `create-formik-form` — create form components using Formik + Yup validation

See `.agents/skills/<skill>/SKILL.md` for detailed usage.

## API

- Base URL: `VITE_API_URL` from `.env` (default `http://localhost:8080/api`)
- Accessed via `import.meta.env.VITE_API_URL` in `src/libs/constant.ts`

## Testing

```sh
npm test              # vitest (watch mode)
npm run test:run      # vitest (one-shot)
npm run test:coverage # vitest with coverage
npm run test:e2e      # playwright
```

- **Unit / Integration:** Vitest + Testing Library + MSW (network-level mocking)
- **E2E:** Playwright
- **Infra:** `src/test/setup.ts` — jest-dom matchers + MSW server lifecycle
- **Custom render:** `src/test/test-utils.tsx` — wraps components with `QueryClientProvider` + `MemoryRouter` + `AuthContext`
- **MSW handlers:** `src/test/mocks/handlers.ts` — covers all API endpoints
- Test files colocate with source: `src/**/*.{test,spec}.{ts,tsx}`
- Build verification: `npm run build` (tsc -b && vite build)
