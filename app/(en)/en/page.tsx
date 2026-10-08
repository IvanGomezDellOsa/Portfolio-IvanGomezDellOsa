import { Portada } from "@/componentes/Portada";
import { metadatosDe } from "../../raiz";

export const metadata = metadatosDe("en", { ruta: "/en/", rutaOtra: "/" });

export default function Page() {
  return <Portada lang="en" />;
}
