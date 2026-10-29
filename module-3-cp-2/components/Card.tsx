import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

const CARD_CLASS =
  "rounded-xl border border-black/10 bg-background shadow-sm transition-shadow hover:shadow-md dark:border-white/15";

export default function Card({
  children,
  className = "",
  padding = true,
}: CardProps) {
  return (
    <div
      className={[
        CARD_CLASS,
        padding ? "p-4" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}