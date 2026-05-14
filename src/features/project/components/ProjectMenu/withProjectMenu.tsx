import { useState } from "react";

import type { ProjectMenuViewProps, WithProjectMenuProps } from "./interface";

export default function withProjectMenu(Component: React.FC<ProjectMenuViewProps>) {
  function WithProjectMenu({ project, onEdit, onDelete }: WithProjectMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen((v) => !v);
    const handleEdit = () => {
      onEdit(project);
      setIsOpen(false);
    };
    const handleDelete = () => {
      onDelete(project);
      setIsOpen(false);
    };

    const componentProps: ProjectMenuViewProps = {
      isOpen,
      onToggle: handleToggle,
      onEdit: handleEdit,
      onDelete: handleDelete,
    };

    return <Component {...componentProps} />;
  }

  return WithProjectMenu;
}