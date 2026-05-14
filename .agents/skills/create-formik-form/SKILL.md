---
name: create-formik-form
description: Create React form component using Formik and Yup validation
---

## When to use

Use this when user wants to create:
- Any form component ("create login form", "create user form", "create item form", etc.)
- A component that contains a form inside

## Pattern

### Component Structure

```
[ComponentName]/
├── interface.ts           # FormValues + Props types
├── [ComponentName].tsx    # Formik + Yup + Form
├── with[ComponentName].tsx # HOC factory (initialValues + onSubmit)
└── index.ts               # Connect HOC to view
```

### interface.ts

```ts
export interface [Name]FormValues {
  // form field types
  field1: string;
  field2: string;
}

export interface [Name]Props {
  initialValues: [Name]FormValues;
  onSubmit: (values: [Name]FormValues) => void;
}
```

### [ComponentName].tsx

- Use **Yup** for validation schema
- Use **`<Formik>`** with render props child
- Use **`<Form>`** inside Formik
- Use form field components from `@/components/form/` (e.g., `InputField`)

```tsx
const validationSchema = Yup.object({
  field1: Yup.string().required("Required"),
  field2: Yup.number().required("Required"),
});

export default function [Name]({ initialValues, onSubmit }: [Name]Props) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputField name="field1" label="Field 1" />
          <InputField name="field2" label="Field 2" />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
```

### with[ComponentName].tsx

```tsx
export default function with[Name](Component: React.FC<[Name]Props>) {
  function With[Name]() {
    const initialValues: [Name]FormValues = {
      field1: "",
      field2: "",
    };

    function onSubmit(values: [Name]FormValues) {
      console.log(values);
    }

    return <Component initialValues={initialValues} onSubmit={onSubmit} />;
  }
  return With[Name];
}
```

### index.ts

```tsx
import [Name] from "./[Name]";
import with[Name] from "./with[Name]";

const Connected[Name] = with[Name]([Name]);

export { Connected[Name] as [Name] };
```

## Key Rules

- **Never use `useFormikContext` hook** — use render props pattern instead
- **Always use `<Form>`** inside `<Formik>` (not raw HTML form)
- **Use form field components** from `@/components/form/` (e.g., `InputField`, `SelectField`)
- **Validation via Yup** — define schema in component file

## Reference

See `example/CreateItemForm/` for complete template.