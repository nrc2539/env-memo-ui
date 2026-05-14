---
name: create-component
description: Create React component following the project's component pattern
---

## Component Pattern

### With HOC (logic/hooks)

When component needs logic (useState, useEffect, callbacks), create:

```
[ComponentName]/
├── interface.ts       # Props and types
├── [ComponentName].tsx # Pure UI view (receives props from HOC)
├── with[ComponentName].tsx # HOC factory (business logic + UI state)
└── index.ts           # Connect HOC to view
```

Example: `example/withHOC/`

### Without HOC (simple component)

When component is purely presentational, create:

```
[ComponentName]/
├── interface.ts       # Props and types
└── index.tsx          # Component view directly
```

Example: `example/withoutHOC/`

## Usage

1. Create component folder under appropriate feature or shared location
2. Follow the pattern above based on whether component needs logic
3. Props are always defined in `interface.ts`
4. For HOC components, the HOC provides props to the view component
5. All types (view props and wrapper/HOC props) live in `interface.ts`
6. Do not re-export types from `index.ts` — import types directly from `interface.ts`

## Reference

See `example/` folder for complete template examples.