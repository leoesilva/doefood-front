import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";  // Adicionei as opções de "variant"
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, variant = "primary" }) => {
  // Lógica para aplicar a classe baseada no variant
  const variantClass = variant === "primary" ? "bg-primary" : "bg-secondary";

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded text-white font-poppins ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
