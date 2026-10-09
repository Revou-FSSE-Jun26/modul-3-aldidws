import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-black/10 bg-background p-4 shadow-sm transition-shadow hover:shadow-md dark:border-white/15 ${className}`}
    >
      {children}
    </div>
  );
}
