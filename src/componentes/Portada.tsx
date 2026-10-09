import { PROYECTOS } from "@/contenido/proyectos";
import type { SalaId } from "@/contenido/salas";
import type { Idioma } from "@/contenido/tipos";
import { funcionesDe, vitrinaDe } from "@/lib/funciones";
import { inicio } from "@/lib/rutas";
import { Arriba } from "./Arriba";
import { Encabezado } from "./Encabezado";
import { Galeria } from "./Galeria";
import { Hero } from "./Hero";
import { Indice } from "./Indice";
import { ObservadorSalas } from "./ObservadorSalas";
import { Pasillo } from "./Pasillo";
import { Pie } from "./Pie";
import { Revelador } from "./Revelador";
import { Sala } from "./Sala";
import { SalaLeonardo } from "./SalaLeonardo";
import { Teatro } from "./Teatro";
import { VisualSala } from "./VisualSala";

/**
 * LA PORTADA: el recorrido completo. El hero (nombre, puesto y las telas con
 * los proyectos) → el índice de los nueve proyectos → cada proyecto, en el orden de
 * relevancia para un puesto full stack o backend (Ask Leonardo siempre
 * primero) → la persona: sobre mí, experiencia, stack y contacto.
 *
 * El orden alterna los tintes para que cada paso se note: nunca dos
 * proyectos seguidos con el mismo matiz.
 */
export function Portada({ lang }: { lang: Idioma }) {
  const funciones = funcionesDe(lang);
  return (
    <>
      <Encabezado lang={lang} rutaOtra={inicio(lang === "es" ? "en" : "es")} enPortada />
      <main id="contenido">
        <Hero lang={lang} funciones={funciones} vitrina={vitrinaDe(lang)} />
        <Indice lang={lang} />
        {PROYECTOS.map((p, i) => {
          const previa: SalaId = i === 0 ? "taller" : PROYECTOS[i - 1]!.slug;
          return p.slug === "ask-leonardo-da-vinci" ? (
            <SalaLeonardo key={p.slug} p={p} lang={lang} previa={previa} />
          ) : (
            <Sala key={p.slug} p={p} lang={lang} previa={previa} visual={<VisualSala p={p} lang={lang} />} />
          );
        })}
        <Galeria lang={lang} />
      </main>
      <Pie />
      <Pasillo lang={lang} />
      <Arriba lang={lang} />
      <Teatro lang={lang} funciones={funciones} />
      <Revelador />
      <ObservadorSalas />
    </>
  );
}
