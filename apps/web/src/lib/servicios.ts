export type Servicio = {
  titulo: string;
  descripcion: string;
  link: string;
  etiqueta: string;
};

export const SERVICIOS: Servicio[] = [
  {
    titulo: "Préstamos Personales",
    descripcion: "Financiamiento rápido y flexible adaptado a tus necesidades personales.",
    link: "/solicitud?servicio=personal",
    etiqueta: "Solicitar ahora",
  },
  {
    titulo: "Préstamos Hipotecarios",
    descripcion: "Líneas de crédito con garantía inmobiliaria y facilidades de pago ajustables.",
    link: "/solicitud?servicio=hipotecario",
    etiqueta: "Solicitar préstamo",
  },
  {
    titulo: "Financiamiento de Vehículos",
    descripcion: "Adquiere tu vehículo personal o comercial con planes de cuotas competitivos.",
    link: "/solicitud?servicio=vehiculo",
    etiqueta: "Financiar vehículo",
  },
  {
    titulo: "Financiamiento de Celulares",
    descripcion: "Estrena tu celular con cuotas accesibles y aprobación rápida.",
    link: "/solicitud?servicio=celular",
    etiqueta: "Solicitar ahora",
  },
  {
    titulo: "Seguro para tu Vehículo",
    descripcion: "Emisión de pólizas y coberturas completas para la protección de tu vehículo.",
    link: "/servicios/seguro-vehicular",
    etiqueta: "Cotizar seguro",
  },
  {
    titulo: "Traspaso Vehicular",
    descripcion: "Gestión ágil y legal de traspasos de matrícula y propiedad de vehículos.",
    link: "/servicios/traspaso-vehicular",
    etiqueta: "Ver requisitos",
  },
  {
    titulo: "Venta e Instalación de GPS",
    descripcion: "Sistemas de rastreo satelital y monitoreo en tiempo real para tu vehículo.",
    link: "/servicios/gps",
    etiqueta: "Solicitar GPS",
  },
];
