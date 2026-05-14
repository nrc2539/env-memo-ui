import { useState } from "react";

import type { CardProps } from "./interface";

export default function withCard(Component: React.FC<CardProps>) {
  function WithCard() {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggleExpand = () => {
      setIsExpanded((prev) => !prev);
    };

    const handleSubmit = (data: { title: string; description: string }) => {
      console.log("Card submitted:", data);
    };

    const componentProps: CardProps = {
      title: "Sample Card",
      description: "This is a sample card description",
      isExpanded,
      onToggleExpand: handleToggleExpand,
      onSubmit: handleSubmit,
    };

    return <Component {...componentProps} />;
  }
  return WithCard;
}
