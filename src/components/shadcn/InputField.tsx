import React from "react";
import { Input } from "./input"; // ajuste o caminho conforme seu projeto

interface InputFieldProps extends React.ComponentProps<typeof Input> {
  label: string;
  error?: string;
}

export function InputField({ label, error, id, ...props }: InputFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <Input id={id} {...props} className={error ? "border-red-500" : ""} />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
