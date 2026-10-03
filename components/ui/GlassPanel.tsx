import type { HTMLAttributes, ReactNode } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export default function GlassPanel({
  children,
  className = "",
  interactive = false,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={[
        "glass-panel",
        interactive ? "glass-panel-interactive" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
