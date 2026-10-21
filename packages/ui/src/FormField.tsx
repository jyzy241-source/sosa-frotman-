import type { ReactNode } from "react";

type Props = {
  label: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, error, children }: Props) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-caption font-medium tracking-tight text-graphite">
        {label}
      </span>
      {children}
      {error && <span className="text-[13px] text-alert">{error}</span>}
    </label>
  );
}
