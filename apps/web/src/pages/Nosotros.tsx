import { LogoBanner } from "@/components/common/LogoBanner";

export default function Nosotros() {
  const valores = ['Respeto', 'Responsabilidad', 'Equidad', 'Integridad', 'Honestidad', 'Trabajo en equipo', 'Seguridad', 'Calidad del servicio'];
  return <main className="text-left">
    <section className="relative isolate overflow-hidden bg-ink px-6 py-14 text-center text-snow md:py-20">
      <img src="/images/hero-nosotros.png" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[68%_center]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/75 to-ink/40" />
      <div className="relative mx-auto max-w-[800px]">
        <LogoBanner align="center" />
        <h1 className="mt-4 font-display text-heading font-bold tracking-tight text-teal">Nosotros</h1>
        <p className="mt-3 text-sm font-medium leading-relaxed text-silver">Siempre inspirados en tu desarrollo.</p>
      </div>
    </section>

    <section className="mx-auto max-w-[1100px] px-6 py-14 text-left md:py-20">
      <article className="rounded-card border border-silver bg-snow p-6 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-deep">Nuestra empresa</p>
        <h2 className="mt-3 font-display text-[30px] font-bold leading-tight tracking-tight text-ink md:text-[36px]">¿Quiénes somos?</h2>
        <div className="mt-6 max-w-[780px] space-y-4 text-base leading-[1.85] text-graphite">
          <p>En <strong className="font-semibold text-ink">INVERSIONES SOSA FROTMAN S.R.L.</strong>, somos una institución financiera confiable, dedicada a impulsar el desarrollo en el sector financiero de los préstamos personales, hipotecarios y financiamiento de vehículos.</p>
          <p>Contamos con un equipo de trabajo altamente calificado para ofrecer las mejores atenciones del mercado, fomentando el crecimiento crediticio de nuestros clientes.</p>
        </div>
      </article>

      <div className="mt-7 grid gap-7 md:grid-cols-2">
        <article className="rounded-card border border-silver bg-snow p-6 md:p-8">
          <div aria-hidden="true" className="mb-5 h-1 w-10 rounded-full bg-teal" />
          <h2 className="font-display text-[28px] font-bold tracking-tight text-teal-deep">Misión</h2>
          <p className="mt-4 text-base leading-[1.85] text-graphite">Brindar servicios financieros con eficiencia de alta calidad y confiabilidad, potencializando el desarrollo financiero de nuestro cliente, ofreciéndoles comodidad y seguridad en cada asistencia proporcionada.</p>
        </article>
        <article className="rounded-card border border-silver bg-snow p-6 md:p-8">
          <div aria-hidden="true" className="mb-5 h-1 w-10 rounded-full bg-teal" />
          <h2 className="font-display text-[28px] font-bold tracking-tight text-teal-deep">Visión</h2>
          <p className="mt-4 text-base leading-[1.85] text-graphite">Convertirnos en una empresa líder en el sector financiero, reconocida a nivel nacional e internacional por su compromiso con la calidad del servicio y la responsabilidad financiera de nuestro cliente en general.</p>
        </article>
      </div>

      <article className="mt-7 rounded-card bg-teal-wash p-6 md:p-10">
        <h2 className="font-display text-[28px] font-bold tracking-tight text-teal-deep">Valores</h2>
        <p className="mt-4 max-w-[700px] text-base leading-[1.85] text-graphite">Nuestra política de calidad en el servicio está fundamentada en los siguientes valores:</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">{valores.map(valor => <li key={valor} className="flex items-center gap-3 rounded-input bg-white px-4 py-4 text-sm font-semibold text-ink"><span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-deep" />{valor}</li>)}</ul>
      </article>

      <aside className="mt-10 border-t border-silver pt-6 text-left text-sm leading-relaxed text-graphite">
        <p>Calle Independencia #46 esq. Mella, Plaza Mi Pueblo, Módulo 7, Moca, R.D.</p>
        <p className="mt-2 font-medium">809-822-7913 / 829-258-3629 · @sosafrotman_inversiones</p>
      </aside>
    </section>
  </main>;
}
