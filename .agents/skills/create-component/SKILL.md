---
name: create-component
description: Create component in react
---

## What I do

- Create `interface.ts` for:
  - `[Name]FormValues` — form field types when using Formik
  - `[Name]Props` — component props (e.g. `initialValues` + `onSubmit`)
- Create `[Component].tsx` as the main component file:
  - Contains validation schema (Yup) if it's a Formik form
  - Render props come from `[Name]Props` interface, provided by HOC
  - If using Formik, wrap form fields inside `<Formik>` and use an internal child component to call `useFormikContext` (never call `useFormikContext` at the top level of the component that renders `<Formik>`)
- If component needs logic/hooks (useState, Formik, side effects), create `with[Component].tsx`:
  - HOC factory pattern: `export default function with[Component](Component: React.FC<Props>)`
  - Provides the props the component expects (e.g. `initialValues`, `onSubmit`)
  - Returns the wrapped component
- Create `index.ts` to connect HOC and view:
  ```tsx
  import Page from "./[Component]";
  import withPage from "./with[Component]";
  const Connected = withPage(Page);
  export { Connected as [Component] };
  ```
- If component has no hooks/logic, skip HOC and set `[Component].tsx` as `index.tsx` (props defined in `interface.ts`)

## Examples in codebase

- `src/features/auth/pages/LoginPage/` — Formik form with HOC factory
- `src/components/Modal/` — Component without HOC factory

## When to use me

Use this when you are preparing and creating react component.
Ask clarifying questions if command is unclear.
