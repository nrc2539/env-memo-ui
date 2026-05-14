import type { CreateItemFormValues, CreateItemFormProps } from "./interface";

export default function withCreateItemForm(
  Component: React.FC<CreateItemFormProps>,
) {
  function WithCreateItemForm() {
    const initialValues: CreateItemFormValues = {
      name: "",
      description: "",
    };

    function onSubmit(values: CreateItemFormValues) {
      console.log("Form submitted:", values);
    }

    const componentProps: CreateItemFormProps = {
      initialValues,
      onSubmit,
    };

    return <Component {...componentProps} />;
  }
  return WithCreateItemForm;
}
