import { forwardRef, type InputHTMLAttributes } from "react";

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput(props, ref) {
    return (
      <input
        ref={ref}
        {...props}
        className="h-12 w-full rounded-input bg-mist px-4 text-body-sm text-ink
                   placeholder:text-steel focus:outline-none focus:ring-2 focus:ring-teal"
      />
    );
  }
);
