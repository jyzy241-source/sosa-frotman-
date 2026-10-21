import { Link, useLocation } from "react-router-dom";

export function HeaderSosa() {
  const { pathname } = useLocation();

  const linkClass = (path: string) => {
    const activo = path === "/" ? pathname === "/" : pathname.startsWith(path);
    return `relative py-1 text-xs font-medium tracking-tight transition-colors lg:text-base ${
      activo ? "text-ink" : "text-graphite hover:text-ink"
    } after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-teal after:transition-all ${
      activo ? "after:w-full" : "after:w-0"
    }`;
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-silver bg-snow">
      <div className="mx-auto flex min-h-[104px] max-w-[1200px] flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 md:flex-nowrap md:gap-6 md:px-6 lg:justify-between">
        <Link to="/" className="order-1 flex max-w-[240px] shrink flex-col items-center lg:order-none lg:max-w-none lg:shrink-0" aria-label="Sosa-Frotman Inversiones, inicio">
          <img
            src="/header-sosa.jpeg"
            alt="Sosa-Frotman Inversiones"
            className="h-[44px] w-auto object-contain md:h-[68px]"
          />
          <span className="-mt-1 whitespace-nowrap text-[7px] font-bold uppercase tracking-[0.14em] text-graphite sm:text-[8px] md:text-[10px] md:tracking-[0.2em]">
            Siempre inspirados en tu desarrollo
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="order-3 flex w-full items-center justify-center gap-4 pb-1 lg:order-none lg:w-auto lg:gap-9 lg:pb-0">
          <Link to="/" className={linkClass("/")}>Inicio</Link>
          <Link to="/nosotros" className={linkClass("/nosotros")}>Nosotros</Link>

          <details className="group relative">
            <summary
              className={`${linkClass("/servicios")} flex cursor-pointer list-none items-center gap-1`}
            >
              Servicios
              <span aria-hidden="true" className="text-[12px] transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="absolute left-1/2 top-full z-20 mt-3 w-64 -translate-x-1/2 rounded-card border border-silver bg-snow p-2">
              <Link to="/servicios" className="block rounded-tag px-4 py-2.5 text-body-sm font-medium text-ink hover:bg-mist">
                Todos los servicios
              </Link>
              <Link to="/servicios/seguro-vehicular" className="block rounded-tag px-4 py-2.5 text-body-sm font-medium text-ink hover:bg-mist">
                Seguro vehicular
              </Link>
              <Link to="/servicios/traspaso-vehicular" className="block rounded-tag px-4 py-2.5 text-body-sm font-medium text-ink hover:bg-mist">
                Traspaso vehicular
              </Link>
              <Link to="/servicios/gps" className="block rounded-tag px-4 py-2.5 text-body-sm font-medium text-ink hover:bg-mist">
                Venta e instalación de GPS
              </Link>
            </div>
          </details>

          <Link to="/contacto" className={linkClass("/contacto")}>Contacto</Link>
        </nav>

      </div>
    </header>
  );
}
