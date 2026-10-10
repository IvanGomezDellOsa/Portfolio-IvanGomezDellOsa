import type { Idioma } from "@/contenido/tipos";
import { funcionesDe, vitrinaDe } from "@/lib/funciones";
import { inicio } from "@/lib/rutas";
import { Arriba } from "./Arriba";
import { Encabezado } from "./Encabezado";
import { Galeria } from "./Galeria";
import { Hero } from "./Hero";
import { Indice } from "./Indice";
import { Pie } from "./Pie";
import { Revelador } from "./Revelador";
import { Teatro } from "./Teatro";

/**
 * LA PORTADA, corta a propósito: el hero (nombre y puesto), las telas con los
 * nueve proyectos, la lista de proyectos y la persona (sobre mí, experiencia y
 * contacto). Las telas y la lista llevan al mismo lugar, la página de cada
 * proyecto, que es el único sitio donde se lo presenta.
 */
export function Portada({ lang }: { lang: Idioma }) {
  const funciones = funcionesDe(lang);
  return (
    <>
      <Encabezado lang={lang} rutaOtra={inicio(lang === "es" ? "en" : "es")} enPortada />
      <main id="contenido">
        <Hero lang={lang} funciones={funciones} vitrina={vitrinaDe(lang)} />
        <Indice lang={lang} />
        <Galeria lang={lang} />
      </main>
      <Pie />
      <Arriba lang={lang} />
      <Teatro lang={lang} funciones={funciones} />
      <Revelador />
    </>
  );
}
