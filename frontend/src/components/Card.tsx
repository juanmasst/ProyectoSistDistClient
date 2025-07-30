import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}
    >
      {children}
    </div>
  );
}
