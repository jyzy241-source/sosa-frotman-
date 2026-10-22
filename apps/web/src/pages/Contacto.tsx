export default function Contacto() {
  return (
    <main>
      <section className="relative isolate min-h-[360px] overflow-hidden bg-ink py-16 text-center text-snow md:min-h-[460px] md:py-24">
        <img src="/images/oficina-contacto.jpeg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35 blur-sm" />
        <img src="/images/oficina-contacto.jpeg" alt="Oficina Sosa-Frotman" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_30%] opacity-90" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/45" />
        <div className="relative mx-auto max-w-[800px] translate-y-10 px-6 md:translate-y-16">
          <h1 className="mt-2 font-display text-[2.75rem] font-bold tracking-tight text-white md:text-[4rem]" style={{ WebkitTextStroke: "2px #000", textShadow: "0 2px 4px rgba(0,0,0,.65)" }}>
            Contacto
          </h1>
          <p className="mt-3 text-base text-silver md:text-xl">
            Visitanos, llamanos o escribinos, te respondemos a la brevedad.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1100px] gap-6 px-6 py-16 md:grid-cols-2 md:py-20">
        <div className="rounded-card border border-silver bg-snow p-8">
          <h2 className="font-display text-subheading font-medium tracking-tight text-ink">Ubicacion</h2>
          <p className="mt-3 text-body-sm text-graphite">Calle Independencia #46 esq. Mella,<br />Plaza Mi Pueblo, Modulo 7, Moca, R.D.</p>

          <h2 className="mt-8 font-display text-subheading font-medium tracking-tight text-ink">Horario</h2>
          <p className="mt-3 text-body-sm text-graphite">Lunes a viernes: 8:00 a.m. - 5:00 p.m.<br />Sabados: 8:00 a.m. - 1:00 p.m.</p>

          <h2 className="mt-8 font-display text-subheading font-medium tracking-tight text-ink">Contacto directo</h2>
          <div className="mt-3 flex flex-col gap-3">
            <a href="tel:8098227913" className="flex items-center gap-3 text-body-sm text-ink hover:text-teal-deep">
              <span className="flex h-9 w-9 items-center justify-center rounded-tag bg-teal-wash text-teal-deep">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </span>
              809-822-7913 / 829-258-3629
            </a>
            <a href="https://wa.me/18493528891" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-body-sm text-ink hover:text-teal-deep">
              <span className="flex h-9 w-9 items-center justify-center rounded-tag bg-teal-wash text-teal-deep">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.2c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.1 0-.3 0-.4 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c.1.1 1.6 2.4 3.9 3.4.5.2.9.4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1z" /></svg>
              </span>
              Escribinos por WhatsApp
            </a>
            <a href="https://instagram.com/sosafrotman_inversiones" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-body-sm text-ink hover:text-teal-deep">
              <span className="flex h-9 w-9 items-center justify-center rounded-tag bg-teal-wash text-teal-deep">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </span>
              @sosafrotman_inversiones
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-card border border-silver bg-snow">
          <iframe
            title="Ubicacion Sosa-Frotman Inversiones"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235.2100237169492!2d-70.52402183516251!3d19.39682906298616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1d72b71396ddb%3A0x34f3405fef1ba948!2sPlaza%20Mi%20Pueblo%2C%2056000%20Moca!5e0!3m2!1sen!2sdo!4v1790551491060!5m2!1sen!2sdo"
            className="h-[300px] w-full border-0 md:h-[360px]"
            loading="lazy"
          />
          <div className="p-8">
            <h2 className="font-display text-subheading font-medium tracking-tight text-ink">Escribinos por WhatsApp</h2>
            <p className="mt-3 text-body-sm text-graphite">La forma mas rapida de recibir atencion: contanos que servicio te interesa y un oficial te responde directamente.</p>
            <a href="https://wa.me/18493528891?text=Hola%2C%20quisiera%20informacion%20sobre%20sus%20servicios" target="_blank" rel="noreferrer" className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-btn bg-teal px-6 text-[15px] font-bold uppercase tracking-wide text-ink transition hover:bg-teal-deep hover:text-snow">
              Abrir WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
