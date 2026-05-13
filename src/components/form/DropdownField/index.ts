import { Dropdown } from "@/components/Dropdown";

import { withDropdownField } from "./withDropdownField";

const ConnectedDropdownField = withDropdownField(Dropdown);

export { ConnectedDropdownField as DropdownField };
