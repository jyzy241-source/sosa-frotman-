export function LogoBanner({ align = "left", large = false }: { align?: "left" | "center"; large?: boolean }) {
  return <img
    src="/logo-sosa.png"
    alt="Sosa-Frotman Inversiones"
    className={`mb-6 block h-auto w-full rounded-lg object-contain drop-shadow-[0_0_12px_rgba(255,255,255,1)] ${align === "center" ? "mx-auto" : ""} ${large ? "max-w-[420px]" : "max-w-[320px]"}`}
  />;
}
