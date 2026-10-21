import { Link } from "react-router-dom";

const footerLink = "text-body-sm text-silver transition-colors hover:text-snow";

export function FooterSosa() {
  return (
    <footer className="bg-ink py-12 text-snow">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src="/logo-sosa.png" alt="Sosa-Frotman Inversiones" className="h-20 w-auto brightness-0 invert" />
          <p className="mt-3 text-body-sm font-bold text-snow">
            Siempre inspirados en tu desarrollo.
          </p>
          <div className="mt-5 flex items-center gap-3" aria-label="Redes sociales y contacto">
            <a href="https://instagram.com/sosafrotman_inversiones" target="_blank" rel="noreferrer" aria-label="Instagram de Sosa-Frotman" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-snow transition-colors hover:border-teal hover:text-teal">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://wa.me/18098227913" target="_blank" rel="noreferrer" aria-label="WhatsApp de Sosa-Frotman" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-snow transition-colors hover:border-teal hover:text-teal">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2a9.9 9.9 0 0 0-8.47 15.03L2.2 22l5.1-1.34A10 10 0 1 0 12.04 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.03.8.81-2.96-.2-.31A8.2 8.2 0 1 1 12.04 20.2Zm4.5-6.14c-.25-.13-1.48-.73-1.7-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.02-1.23-.75-.66-1.25-1.48-1.4-1.73-.15-.25-.02-.39.11-.52.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.45.06-.68.32-.23.25-.89.87-.89 2.11s.91 2.45 1.04 2.62c.13.17 1.79 2.73 4.34 3.83.61.26 1.09.42 1.46.54.61.19 1.17.16 1.61.1.49-.08 1.48-.61 1.69-1.2.21-.59.21-1.09.15-1.2-.06-.11-.23-.17-.49-.3Z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-base font-medium tracking-tight">Conócenos</h2>
          <ul className="mt-4 space-y-3">
            <li><Link to="/" className={footerLink}>Inicio</Link></li>
            <li><Link to="/nosotros" className={footerLink}>Nosotros</Link></li>
            <li><Link to="/contacto" className={footerLink}>Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-medium tracking-tight">Servicios</h2>
          <ul className="mt-4 space-y-3">
            <li><Link to="/servicios" className={footerLink}>Todos los servicios</Link></li>
            <li><Link to="/solicitud" className={footerLink}>Solicitar préstamo</Link></li>
            <li><Link to="/servicios/seguro-vehicular" className={footerLink}>Seguro vehicular</Link></li>
            <li><Link to="/servicios/traspaso-vehicular" className={footerLink}>Traspaso vehicular</Link></li>
            <li><Link to="/servicios/gps" className={footerLink}>Venta e instalación de GPS</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-medium tracking-tight">Visítanos o llámanos</h2>
          <p className="mt-4 text-body-sm text-silver">
            Calle Independencia #46 esq. Mella, Plaza Mi Pueblo, Módulo 7, Moca, R.D.
          </p>
          <a href="tel:8098227913" className={`${footerLink} mt-3 inline-block`}>
            809-822-7913 / 829-258-3629
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[1200px] border-t border-white/20 px-6 pt-5 text-caption text-silver">
        © {new Date().getFullYear()} Sosa-Frotman Inversiones S.R.L. Todos los derechos reservados.
      </div>
    </footer>
  );
}
