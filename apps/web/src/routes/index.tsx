import { Routes, Route, useLocation } from "react-router-dom";
import Home from "@/pages/Home";
import Nosotros from "@/pages/Nosotros";
import Servicios from "@/pages/Servicios";
import SeguroVehicular from "@/pages/SeguroVehicular";
import TraspasoVehicular from "@/pages/TraspasoVehicular";
import Gps from "@/pages/Gps";
import Solicitud from "@/pages/Solicitud";
import Contacto from "@/pages/Contacto";
import NotFound from "@/pages/NotFound";

export function AppRoutes() {
  const { search } = useLocation();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/servicios/seguro-vehicular" element={<SeguroVehicular />} />
      <Route path="/servicios/traspaso-vehicular" element={<TraspasoVehicular />} />
      <Route path="/servicios/gps" element={<Gps />} />
      <Route path="/solicitud" element={<Solicitud key={search} />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
