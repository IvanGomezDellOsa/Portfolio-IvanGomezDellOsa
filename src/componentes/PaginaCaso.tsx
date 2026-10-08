import { notFound } from "next/navigation";
import { NOMBRE } from "@/contenido/sitio";
import { proyectoPorSlug } from "@/contenido/proyectos";
import type { Idioma } from "@/contenido/tipos";
import { funcionesDe } from "@/lib/funciones";
import { caso, otroIdioma } from "@/lib/rutas";
import { Caso } from "./Caso";
import { Encabezado } from "./Encabezado";
import { ObservadorSalas } from "./ObservadorSalas";
import { Pie } from "./Pie";
import { Revelador } from "./Revelador";
import { Teatro } from "./Teatro";

/** Una página de caso, igual en los dos idiomas: cambia sólo `lang`. */
export function PaginaCaso({ lang, slug }: { lang: Idioma; slug: string }) {
  const p = proyectoPorSlug(slug);
  if (!p) notFound();
  return (
    <>
      <Encabezado lang={lang} rutaOtra={caso(otroIdioma(lang), p.slug)} enPortada={false} />
      <main id="contenido">
        <Caso p={p} lang={lang} />
      </main>
      <Pie />
      <Teatro lang={lang} funciones={funcionesDe(lang)} />
      <Revelador />
      <ObservadorSalas />
    </>
  );
}

export const tituloCaso = (nombre: string) => `${nombre} · ${NOMBRE}`;
