import { LogoBanner } from "@/components/common/LogoBanner";
import { Link } from "react-router-dom";
import { SERVICIOS } from "@/lib/servicios";
import { MotionCard } from "@/components/common/MotionCard";
import { buttonStyles } from "@ui";

export default function Servicios() {
  return (
    <main>
      <section className="relative overflow-hidden bg-ink py-16 text-center text-snow md:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(47,196,160,0.16),transparent_55%)]" />
        <div className="relative mx-auto max-w-[800px] px-6">
          <LogoBanner align="center" />
          <h1 className="mt-4 font-display text-heading font-bold tracking-tight text-teal">
            Nuestros Servicios
          </h1>
          <p className="mt-4 text-body-lg text-silver">
            Soluciones financieras y de protección vehicular pensadas para
            acompañarte en cada paso.
          </p>
          <Link to="/solicitud" className={`${buttonStyles("primary")} mt-7 h-12 px-7 text-base`}>
            Solicitar préstamo <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICIOS.map((item, index) => (
            <MotionCard
              key={item.titulo}
              index={index}
              className="group flex flex-col justify-between rounded-card border border-silver bg-snow p-8 transition-colors hover:border-teal"
            >
              <div>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-card bg-teal-wash transition-transform group-hover:scale-110">
                  <div className="h-4 w-4 rotate-45 border-2 border-teal-deep" />
                </div>
                <h2 className="font-display text-subheading font-medium tracking-tight text-ink">
                  {item.titulo}
                </h2>
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
      </section>
    </main>
  );
}
