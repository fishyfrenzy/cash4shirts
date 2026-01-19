import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-md p-6 border border-gray-100
        ${hover ? "transition-all duration-200 hover:shadow-lg hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
