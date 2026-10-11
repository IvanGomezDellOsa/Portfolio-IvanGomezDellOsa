import { PROYECTOS } from "@/contenido/proyectos";
import type { SalaId } from "@/contenido/salas";
import type { Idioma } from "@/contenido/tipos";
import { funcionesDe, vitrinaDe } from "@/lib/funciones";
import { inicio } from "@/lib/rutas";
import { Arriba } from "./Arriba";
import { BarraProyectos } from "./BarraProyectos";
import { Encabezado } from "./Encabezado";
import { Galeria } from "./Galeria";
import { Hero } from "./Hero";
import { Indice } from "./Indice";
import { ObservadorSalas } from "./ObservadorSalas";
import { Proyecto } from "./Proyecto";
import { Revelador } from "./Revelador";
import { Teatro } from "./Teatro";

/**
 * LA PORTADA, que es todo el sitio: el hero (nombre y puesto), las telas, la
 * lista de proyectos, LOS NUEVE PROYECTOS y, recién después, la persona (sobre
 * mí y experiencia). Los proyectos van en el recorrido principal
 * (decisión del dueño, 2026-10-10): son su punto fuerte, y quien baja tiene que
 * pasar por ellos antes de llegar a la experiencia. Cada uno muestra lo
 * esencial; su caso completo se despliega a pedido.
 */
export function Portada({ lang }: { lang: Idioma }) {
  const funciones = funcionesDe(lang);
  return (
    <>
      <Encabezado lang={lang} rutaOtra={inicio(lang === "es" ? "en" : "es")} />
      <BarraProyectos lang={lang} />
      <main id="contenido">
        <Hero lang={lang} funciones={funciones} vitrina={vitrinaDe(lang)} />
        <Indice lang={lang} />
        {PROYECTOS.map((p, i) => (
          <Proyecto key={p.slug} p={p} lang={lang} previa={(i === 0 ? "taller" : PROYECTOS[i - 1]!.slug) as SalaId} />
        ))}
        <Galeria lang={lang} />
      </main>
      <Arriba lang={lang} />
      <Teatro lang={lang} funciones={funciones} />
      <Revelador />
      <ObservadorSalas />
    </>
  );
}
