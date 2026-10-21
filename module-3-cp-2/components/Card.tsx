import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const CARD_CLASS =
  "rounded-xl border border-black/10 bg-background p-4 shadow-sm transition-shadow hover:shadow-md dark:border-white/15";

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={className ? `${CARD_CLASS} ${className}` : CARD_CLASS}>
      {children}
    </div>
  );
}
