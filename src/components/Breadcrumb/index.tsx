import { Link } from "react-router";

import type { BreadcrumbProps } from "./interface";

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-1 text-sm text-gray-500">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-2">/</span>}
          {item.href ? (
            <Link to={item.href} className="hover:text-teal-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}