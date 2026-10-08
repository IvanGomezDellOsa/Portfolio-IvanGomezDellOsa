import { Portada } from "@/componentes/Portada";
import { metadatosDe } from "../raiz";

export const metadata = metadatosDe("es", { ruta: "/", rutaOtra: "/en/" });

export default function Pagina() {
  return <Portada lang="es" />;
}
