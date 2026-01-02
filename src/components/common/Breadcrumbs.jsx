import { Link } from "react-router-dom";

export default function Breadcrumbs({ items }) {
  return (
    <nav className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="hover:underline text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}

              {!isLast && <span>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
