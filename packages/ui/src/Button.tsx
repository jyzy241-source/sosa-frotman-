import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost";

const base = "inline-flex h-12 items-center justify-center rounded-btn px-6 text-base font-medium tracking-tight transition-colors";
const variants: Record<Variant, string> = {
  primary: "bg-teal text-snow hover:bg-teal-deep",
  outline: "border border-ink text-ink hover:bg-ink hover:text-snow",
  ghost: "text-graphite hover:underline",
};

/** Clases del sistema de botones, para aplicar a <Link>/<a> además de <button>. */
export function buttonStyles(variant: Variant = "primary", className = ""): string {
  return `${base} ${variants[variant]} ${className}`;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button {...props} className={buttonStyles(variant, className)} />;
}
