import { AppRoutes } from "./routes";
import { HeaderSosa } from "@/components/common/HeaderSosa";
import { FooterSosa } from "@/components/common/FooterSosa";
import { BotonWhatsApp } from "@/components/common/BotonWhatsApp";

export default function App() {
  return (
    <>
      <HeaderSosa />
      <AppRoutes />
      <FooterSosa />
      <BotonWhatsApp />
    </>
  );
}
