const PASOS = [
  "Datos del cliente",
  "Datos laborales",
  "Características del préstamo",
  "Codeudor",
  "Fiador",
  "Referencias y autorización",
] as const;

export default function Solicitud() {
  return (
    <main className="mx-auto max-w-[1240px] px-6 py-16">
      <h1 className="font-display text-heading-sm uppercase tracking-tight text-ink">
        Solicitud de crédito
      </h1>
      <ol className="mt-8 flex flex-wrap gap-2">
        {PASOS.map((paso, i) => (
          <li
            key={paso}
            className="rounded-tag border border-silver bg-snow px-3 py-1 text-body-sm text-steel"
          >
            {i + 1}. {paso}
          </li>
        ))}
      </ol>
      {/* TODO: implementar cada paso como componente en src/components/solicitud/ */}
    </main>
  );
}
