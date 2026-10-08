import type { Idioma, Proyecto } from "@/contenido/tipos";
import { Capas, Cobertura, Sistema } from "./Graficos";
import { GrillaSemanas } from "./GrillaSemanas";
import { Kiosco } from "./Kiosco";
import { VideoEnVista } from "./Medios";
import { Pantalla } from "./Pantalla";
import { Imagen, Navegador, Telefono } from "./Piezas";
import css from "./Sala.module.css";

const T = (lang: Idioma, es: string, en: string) => (lang === "es" ? es : en);

/**
 * EL MATERIAL DE CADA PROYECTO. Lo principal es su video: la pantalla con el
 * fragmento mudo en loop y el play encima. Al lado, lo que el video no puede
 * ser: un gráfico interactivo con los datos reales del proyecto. Los dos sitios
 * web (Rugidos, Navkok) no tienen video: se ven en su navegador y su teléfono.
 */
export function VisualSala({ p, lang }: { p: Proyecto; lang: Idioma }) {
  const pantalla = p.video ? <Pantalla slug={p.slug} nombre={p.nombre} video={p.video} lang={lang} /> : null;
  switch (p.visual) {
    case "leonardo":
      return pantalla;

    case "datos-pauta":
      return (
        <div className={css.par}>
          {pantalla}
          <Cobertura lang={lang} />
        </div>
      );

    case "sevive":
      return (
        <div className={css.par}>
          {pantalla}
          <Sistema lang={lang} />
        </div>
      );

    case "inversiones":
      return (
        <div className={`${css.par} ${css.parInvertido}`}>
          <Capas lang={lang} />
          {pantalla}
        </div>
      );

    case "facehunt":
      return (
        <div className={css.par}>
          {pantalla}
          <Navegador url="FaceHunt2.exe">
            <Imagen
              src="/medios/facehunt-2/interfaz"
              alt={T(lang, "La interfaz de FaceHunt 2: referencia, video, opciones y resultados, en cuatro pasos.", "The FaceHunt 2 interface: reference, video, options and results, in four steps.")}
              ancho={1600}
              alto={1000}
              tam="(max-width: 900px) 100vw, 40vw"
            />
          </Navegador>
        </div>
      );

    case "mementolife":
      return (
        <div className={`${css.par} ${css.parInvertido}`}>
          <GrillaSemanas lang={lang} />
          {pantalla}
        </div>
      );

    case "rugidos":
      return (
        <div className={css.conTelefono}>
          <Navegador url="rugidosfiestas.com.ar">
            <Imagen
              src="/medios/rugidos/servicios"
              alt={T(lang, "La sección «¿Por qué elegirnos?» de Rugidos: 18 años, más de 7.500 eventos y las tarjetas de servicio.", "The Rugidos “Why choose us?” section: 18 years, more than 7,500 events and the service cards.")}
              ancho={1600}
              alto={1000}
              tam="(max-width: 900px) 100vw, 70vw"
            />
          </Navegador>
          <Telefono className={css.telefonoApoyado}>
            <img src="/medios/rugidos/movil.webp" alt={T(lang, "El sitio de Rugidos en un teléfono.", "The Rugidos website on a phone.")} width={640} height={1385} loading="lazy" decoding="async" />
          </Telefono>
        </div>
      );

    case "navkok":
      return (
        <div className={css.conTelefono}>
          <Navegador url="navkok-website-private.vercel.app">
            <VideoEnVista
              src="/medios/navkok/hero.mp4"
              poster="/medios/navkok/hero.webp"
              ancho={960}
              alto={540}
              etiqueta={T(lang, "El video de fondo del hero de Navkok, producido con IA: un predio de noche, lluvia y un auto oficial.", "The Navkok hero background video, produced with AI: a facility at night, rain and an official car.")}
              lang={lang}
            />
          </Navegador>
          <Telefono className={css.telefonoApoyado}>
            <img src="/medios/navkok/movil.webp" alt={T(lang, "El sitio de Navkok en un teléfono: el escudo y el nombre en dorado.", "The Navkok website on a phone: the badge and the name in gold.")} width={640} height={1385} loading="lazy" decoding="async" />
          </Telefono>
        </div>
      );

    case "freemagicmirror":
      return (
        <div className={css.par}>
          {pantalla}
          <Kiosco lang={lang} />
        </div>
      );
  }
}
