import CreateItemForm from "./CreateItemForm";
import withCreateItemForm from "./withCreateItemForm";

const ConnectedCreateItemForm = withCreateItemForm(CreateItemForm);

export { ConnectedCreateItemForm as CreateItemForm };