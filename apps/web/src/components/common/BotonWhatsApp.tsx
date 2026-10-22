export function BotonWhatsApp() {
  return (
    <a
      href="https://wa.me/18493528891?text=Hola%2C%20quisiera%20informacion%20sobre%20sus%20servicios"
      target="_blank"
      rel="noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-5 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 sm:right-6 sm:w-auto sm:gap-2 sm:px-5"
    >
      <svg aria-hidden="true" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2a9.9 9.9 0 0 0-8.47 15.03L2.2 22l5.1-1.34A10 10 0 1 0 12.04 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.03.8.81-2.96-.2-.31A8.2 8.2 0 1 1 12.04 20.2Zm4.5-6.14c-.25-.13-1.48-.73-1.7-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.02-1.23-.75-.66-1.25-1.48-1.4-1.73-.15-.25-.02-.39.11-.52.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.45.06-.68.32-.23.25-.89.87-.89 2.11s.91 2.45 1.04 2.62c.13.17 1.79 2.73 4.34 3.83.61.26 1.09.42 1.46.54.61.19 1.17.16 1.61.1.49-.08 1.48-.61 1.69-1.2.21-.59.21-1.09.15-1.2-.06-.11-.23-.17-.49-.3Z" />
      </svg>
      <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
    </a>
  );
}
