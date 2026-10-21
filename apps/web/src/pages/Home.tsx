import { LogoBanner } from "@/components/common/LogoBanner";
import { useState } from "react";
import { Link } from "react-router-dom";
import { buttonStyles } from "@ui";
import { SERVICIOS } from "@/lib/servicios";
import { MotionCard } from "@/components/common/MotionCard";

export default function Home() {
  const [busqueda, setBusqueda] = useState("");
  const busquedaNormalizada = busqueda
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es");
  const serviciosVisibles = SERVICIOS.filter((servicio) =>
    `${servicio.titulo} ${servicio.descripcion} ${servicio.etiqueta}`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es")
      .includes(busquedaNormalizada),
  );

  return (
    <main>
      <section aria-label="Sosa-Frotman Inversiones" className="relative isolate overflow-hidden bg-ink text-snow">
        <img src="/images/hero-home.png" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_center] md:object-center" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/55" />
        <div className="relative mx-auto grid min-h-[480px] max-w-[1200px] items-center gap-10 px-6 py-14 md:grid-cols-[minmax(0,1fr)_400px] md:gap-12 md:py-20">
          <div className="max-w-[620px] text-left">
            <h1 className="sr-only">Sosa-Frotman Inversiones</h1>
            <LogoBanner large />
            <p className="max-w-[520px] text-left text-base font-bold leading-relaxed text-teal [text-wrap:balance] md:text-lg">Siempre inspirados en tu desarrollo</p>
            <p className="mt-4 max-w-[520px] text-left text-base font-normal leading-[1.8] text-white/80 [text-wrap:pretty] md:mt-5">
              Te acompañamos en cada paso con soluciones financieras a tu medida:
              préstamos, seguros vehiculares, traspasos y rastreo GPS.
            </p>
            <div className="mt-6 md:mt-8">
              <Link to="/solicitud" className={buttonStyles("primary") + " h-11 gap-2 px-6 text-sm md:h-12 md:px-7 md:text-base"}>
                Solicitar préstamo <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="w-full rounded-card border border-white/10 bg-snow p-5 text-ink md:p-8">
            <h2 className="font-display text-xl font-medium tracking-tight md:text-subheading">
              ¿Qué servicio buscas?
            </h2>
            <p className="mt-2 text-sm font-normal leading-relaxed text-graphite md:mt-3 md:text-body-sm">
              Busca entre nuestros servicios y encuentra la opción adecuada para ti.
            </p>
            <label htmlFor="buscar-servicio" className="sr-only">
              Buscar servicio
            </label>
            <input
              id="buscar-servicio"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              aria-controls="resultados-busqueda-servicios"
              aria-expanded={Boolean(busqueda.trim())}
              autoComplete="off"
              placeholder="Ej. préstamo, seguro, GPS"
              className="mt-4 h-11 w-full rounded-input bg-mist px-4 text-sm text-ink placeholder:text-steel focus:outline-none focus:ring-2 focus:ring-teal md:mt-6 md:h-12 md:px-5 md:text-body-sm"
            />
            {busqueda.trim() && (
              <div
                id="resultados-busqueda-servicios"
                className="mt-3 max-h-56 overflow-y-auto rounded-card border border-silver bg-snow p-2"
                aria-label="Servicios encontrados"
                role="region"
                aria-live="polite"
              >
                {serviciosVisibles.length > 0 ? (
                  serviciosVisibles.slice(0, 5).map((servicio) => (
                    <Link
                      key={servicio.titulo}
                      to={servicio.link}
                      className="flex items-center justify-between gap-3 rounded-tag px-3 py-2.5 text-sm text-ink transition-colors hover:bg-mist focus:bg-mist focus:outline-none"
                    >
                      <span>{servicio.titulo}</span>
                      <span aria-hidden="true" className="shrink-0 text-teal-deep">→</span>
                    </Link>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-graphite" role="status">
                    No encontramos servicios para “{busqueda}”.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-silver bg-snow px-6 py-14 md:py-20">
        <div className="mx-auto max-w-[1000px] text-center">
          <h2 className="font-display text-heading-sm font-medium tracking-tight text-ink">Nosotros</h2>
          <div className="mx-auto mt-4 h-1 w-16 bg-teal" />
          <p className="mx-auto mt-6 max-w-[820px] text-body-sm leading-relaxed text-graphite">
            En Inversiones Sosa Frotman S.R.L. somos una institución financiera confiable, dedicada a impulsar el desarrollo en el sector financiero mediante préstamos personales, hipotecarios y financiamiento de vehículos.
          </p>
          <Link to="/nosotros" className="mt-6 inline-flex items-center gap-2 text-base font-medium text-teal-deep hover:text-ink">
            Conoce más sobre nosotros <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <div className="mb-12 text-center">
          <h2 className="font-display text-heading-sm font-medium tracking-tight text-ink">
            Nuestros Servicios
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 bg-teal" />
          <p className="mt-3 text-body-sm text-steel">
            Elegí el servicio que querés solicitar o cotizar en línea.
          </p>
        </div>

        {serviciosVisibles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serviciosVisibles.map((item, index) => (
              <MotionCard
                key={item.titulo}
                index={index}
                className="group flex flex-col justify-between rounded-card border border-silver bg-snow p-8 transition-colors hover:border-teal"
              >
                <div>
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-card bg-teal-wash transition-transform group-hover:scale-110">
                    <div className="h-4 w-4 rotate-45 border-2 border-teal-deep" />
                  </div>
                  <h3 className="font-display text-subheading font-medium tracking-tight text-ink">
                    {item.titulo}
                  </h3>
                  <p className="mt-3 text-body-sm text-graphite">{item.descripcion}</p>
                </div>

                <div className="mt-8 border-t border-silver pt-4">
                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-2 text-base font-medium tracking-tight text-ink group-hover:text-teal-deep"
                  >
                    {item.etiqueta} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </MotionCard>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-body-sm text-graphite" role="status">
            No encontramos servicios que coincidan con "{busqueda}".
          </p>
        )}
      </section>

      <section className="border-t border-silver bg-mist py-14">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-8 px-6 md:flex-row">
          <div>
            <h2 className="font-display text-subheading font-medium tracking-tight text-ink">
              Visítanos o contáctanos
            </h2>
            <p className="mt-2 text-body-sm text-graphite">
              Calle Independencia #46 esq. Mella, Plaza Mi Pueblo, Módulo 7, Moca, R.D.
            </p>
            <p className="mt-2 text-body-sm font-medium text-ink">
              Tel. 809-822-7913 / 829-258-3629 · Instagram @sosafrotman_inversiones
            </p>
          </div>

          <a href="tel:8098227913" className={buttonStyles("primary")}>
            Llamar ahora
          </a>
        </div>
      </section>
    </main>
  );
}
