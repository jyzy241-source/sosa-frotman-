import { Link } from "react-router-dom";
import { buttonStyles } from "@ui";
import { HeaderSosa } from "@/components/common/HeaderSosa";

const SERVICIOS = [
  {
    titulo: "Préstamos Personales",
    descripcion: "Financiamiento rápido y flexible adaptado a tus necesidades personales.",
    link: "/solicitud",
    etiqueta: "Solicitar ahora",
    icono: "💵",
  },
  {
    titulo: "Préstamos Hipotecarios",
    descripcion: "Líneas de crédito con garantía inmobiliaria y facilidades de pago ajustables.",
    link: "/solicitud",
    etiqueta: "Solicitar crédito",
    icono: "🏠",
  },
  {
    titulo: "Financiamiento de Vehículos",
    descripcion: "Adquiere tu vehículo personal o comercial con planes de cuotas competitivos.",
    link: "/solicitud",
    etiqueta: "Financiar vehículo",
    icono: "🚗",
  },
  {
    titulo: "Seguro para tu Vehículo",
    descripcion: "Emisión de pólizas y coberturas completas para la protección de tu vehículo.",
    link: "/servicios/seguro-vehicular",
    etiqueta: "Emitir seguro",
    icono: "🛡️",
  },
  {
    titulo: "Traspaso Vehicular",
    descripcion: "Gestión ágil y legal de traspasos de matrícula y propiedad de vehículos.",
    link: "/servicios/traspaso-vehicular",
    etiqueta: "Ver requisitos",
    icono: "📄",
  },
  {
    titulo: "Venta e Instalación de GPS",
    descripcion: "Sistemas de rastreo satelital y monitoreo en tiempo real para tu vehículo.",
    link: "/servicios/gps",
    etiqueta: "Solicitar GPS",
    icono: "📍",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-mist text-ink">
      {/* Navigation Bar — fondo Snow, sin sombras (DESIGN.md) */}
      <header className="border-b border-silver bg-snow">
        <div className="mx-auto max-w-[1240px] px-6 py-5">
          <HeaderSosa />
        </div>
      </header>

      <main>
        {/* Diagonal Hero — bloque Ink full-bleed con corte diagonal (DESIGN.md) */}
        <section
          className="relative overflow-hidden bg-ink py-20 md:py-28"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 56px), 0 100%)",
          }}
        >
          <div className="relative z-10 mx-auto max-w-[1240px] px-6 text-center">
            <span className="inline-block rounded-tag border border-teal/40 bg-teal/15 px-5 py-1.5 text-[13px] font-semibold uppercase tracking-wide text-teal">
              Sosa-Frotman Inversiones
            </span>
            <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-snow md:text-display">
              ¡Siempre inspirados en tu desarrollo!
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-body-lg text-silver">
              Te acompañamos en cada paso con soluciones financieras a tu medida:
              préstamos, seguros vehiculares, traspasos y rastreo GPS.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/solicitud" className={buttonStyles("primary")}>
                Solicitud de Crédito
              </Link>
              <Link
                to="/servicios/seguro-vehicular"
                className={buttonStyles("outline", "border-snow text-snow hover:bg-snow hover:text-ink")}
              >
                Seguro Vehicular
              </Link>
            </div>
          </div>
        </section>

        {/* Service Card grid — sin sombras, borde Silver, radio 16px (DESIGN.md) */}
        <section className="mx-auto max-w-[1240px] px-6 py-20">
          <div className="mb-14 text-center">
            <h2 className="font-display text-heading-sm uppercase tracking-tight text-ink">
              Nuestros Servicios
            </h2>
            <div className="mx-auto mt-3 h-1 w-16 bg-teal" />
            <p className="mt-3 text-body-sm text-steel">
              Elegí el servicio que querés solicitar o cotizar en línea.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS.map((item) => (
              <div
                key={item.titulo}
                className="group flex flex-col justify-between rounded-card border border-silver
                           bg-snow p-8 transition-colors hover:border-teal"
              >
                <div>
                  <div className="mb-4 text-4xl">{item.icono}</div>
                  <h3 className="font-display text-subheading text-ink">{item.titulo}</h3>
                  <p className="mt-3 text-body-sm text-steel">{item.descripcion}</p>
                </div>

                <div className="mt-8 border-t border-silver pt-4">
                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-2 text-[15px] font-semibold text-ink
                               group-hover:text-teal-deep"
                  >
                    {item.etiqueta} <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contacto — banda Mist, sin sombras */}
        <section className="border-t border-silver bg-mist py-14">
          <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-8 px-6 md:flex-row">
            <div>
              <h3 className="font-display text-subheading uppercase text-ink">
                Visítanos o contáctanos
              </h3>
              <p className="mt-2 text-body-sm text-graphite">
                Calle Independencia #46 esq. Mella, Plaza Mi Pueblo, Módulo 7, Moca, R.D.
              </p>
              <p className="mt-2 text-body-sm font-semibold text-ink">
                📞 809-822-7913 / 829-258-3629 &nbsp;|&nbsp; 📸 @sosafrotman_inversiones
              </p>
            </div>

            <a href="tel:8098227913" className={buttonStyles("primary")}>
              Llamar ahora
            </a>
          </div>
        </section>
      </main>

      {/* Ink Footer (DESIGN.md) */}
      <footer className="bg-ink py-10 text-center text-[13px]">
        <p className="font-medium text-silver">
          © {new Date().getFullYear()} Sosa-Frotman Inversiones S.R.L. Todos los derechos reservados.
        </p>
        <p className="mt-1 text-graphite">Moca, República Dominicana</p>
      </footer>
    </div>
  );
}
