"use client";

import { Liquid } from "liquid-gooey";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { CV_OPCIONES, NAV } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import { IconoCV, IconoDescarga, IconoPestana } from "./Iconos";
import { VisorCV } from "./VisorCV";
import css from "./MenuCV.module.css";

/** Entre el botón y la primera opción, y entre las dos opciones. */
const SEPARACION = 12;
const ALTO_OPCION = 36;
const ANCHO_OPCION = 104;

/**
 * EL BOTON «CV». En el sitio abre directo la vista previa (`VisorCV`): el libro
 * ya trae los dos idiomas. Formas: `icono` (el hero, sutil como GitHub y
 * LinkedIn), `barra` (el encabezado) y `pastilla` (el contacto).
 *
 * En la barra de la vista previa, `descarga` (baja el PDF) y `pestana` (lo abre
 * en otra pestaña, la vista de siempre) sí eligen idioma: las dos opciones
 * (Español y English) brotan del botón hacia arriba como gotas, un líquido
 * (`liquid-gooey`) que se estira y se separa en dos. Es un desplegable de
 * enlaces (el patrón de «disclosure»): se abre con clic o teclado, se cierra
 * con Esc, con un clic afuera o al elegir.
 */
export function MenuCV({ lang, variante = "barra" }: { lang: Idioma; variante?: "barra" | "icono" | "pastilla" | "texto" | "descarga" | "pestana" }) {
  const descarga = variante === "descarga";
  const pestana = variante === "pestana";
  const enVisor = descarga || pestana;
  const [abierto, setAbierto] = useState(false);
  const [alto, setAlto] = useState(32);
  const [ancho, setAncho] = useState(32);
  // En una pantalla táctil el sitio no abre el libro: el botón suelta las dos gotas y cada una abre su PDF.
  const [tactil, setTactil] = useState(false);
  const [viendo, setViendo] = useState(false);
  const cerrarVisor = useCallback(() => setViendo(false), []);
  const raiz = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const primero = useRef<HTMLAnchorElement>(null);
  const id = useId();

  useEffect(() => {
    setTactil(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
  }, []);

  useLayoutEffect(() => {
    if (!boton.current) return;
    setAlto(boton.current.offsetHeight);
    setAncho(boton.current.offsetWidth);
  }, [tactil]);

  useEffect(() => {
    if (!abierto) return;
    const afuera = (e: PointerEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        boton.current?.focus();
      }
    };
    const foco = (e: FocusEvent) => {
      if (e.relatedTarget && !raiz.current?.contains(e.relatedTarget as Node)) setAbierto(false);
    };
    const r = raiz.current;
    document.addEventListener("pointerdown", afuera);
    document.addEventListener("keydown", tecla);
    r?.addEventListener("focusout", foco);
    return () => {
      document.removeEventListener("pointerdown", afuera);
      document.removeEventListener("keydown", tecla);
      r?.removeEventListener("focusout", foco);
    };
  }, [abierto]);

  const alternar = (e: MouseEvent<HTMLButtonElement>) => {
    // En el menú del teléfono, tocar «CV» no lo cierra: primero hay que elegir idioma.
    e.stopPropagation();
    const abrir = !abierto;
    setAbierto(abrir);
    // Abierto con el teclado (un clic sin puntero): el foco pasa a la primera opción.
    if (abrir && e.detail === 0) window.setTimeout(() => primero.current?.focus(), 120);
  };

  // En el sitio: un botón que abre la vista previa, sin gotas.
  if (!enVisor && !tactil)
    return (
      <>
        <button
          type="button"
          className={variante === "icono" ? css.icono : variante === "pastilla" ? "pastilla hueca" : variante === "texto" ? css.texto : css.boton}
          data-contacto={variante === "icono" ? "cv" : undefined}
          aria-label={variante === "icono" ? NAV.cvVer[lang] : undefined}
          data-pista={variante === "icono" ? NAV.cvLargo[lang] : undefined}
          aria-haspopup="dialog"
          onClick={() => setViendo(true)}
        >
          {variante === "icono" ? <IconoCV /> : variante === "texto" ? NAV.cvVer[lang] : NAV.cv[lang]}
        </button>
        {viendo && <VisorCV idioma={lang} alCerrar={cerrarVisor} />}
      </>
    );

  const claseBoton = pestana ? css.pestana : descarga ? css.descarga : variante === "icono" ? css.icono : variante === "pastilla" ? "pastilla hueca" : variante === "texto" ? css.texto : css.boton;
  // Hacia dónde brotan las gotas: en el hero, abajo; en el menú del teléfono, al costado (dentro de su fila); si no, arriba.
  const hacia = enVisor ? "arriba" : variante === "icono" ? "abajo" : variante === "barra" ? "derecha" : "arriba";
  const lejos = (i: number) => (hacia === "derecha" ? ancho / 2 + SEPARACION + ANCHO_OPCION / 2 + i * (ANCHO_OPCION + SEPARACION) : alto / 2 + SEPARACION + ALTO_OPCION / 2 + i * (ALTO_OPCION + SEPARACION));
  const rotulo = pestana ? NAV.cvPestana[lang] : descarga ? NAV.cvMenu[lang] : NAV.cvElegir[lang];

  return (
    <div ref={raiz} className={css.menu} data-abierto={abierto || undefined} data-hacia={hacia}>
      {/* El líquido, detrás del botón: una gota del tamaño del botón y las dos opciones, escondidas debajo hasta abrir. */}
      <Liquid className={css.liquido} blur={5} contrast={20} fill="oklch(22% 0 0)" shadow="0 16px 36px -14px oklch(0% 0 0 / 0.75)" filterPadding={hacia === "derecha" ? 300 : 140}>
        <Liquid.Item className={css.gota} scale={abierto ? 1 : 0} transition="bouncy">
          <div className={css.relleno} />
        </Liquid.Item>
        <ul id={id} className={css.opciones} aria-hidden={!abierto}>
          {CV_OPCIONES.map((o, i) => (
            <Liquid.Item
              key={o.lang}
              className={css.item}
              x={abierto && hacia === "derecha" ? lejos(i) : 0}
              y={!abierto || hacia === "derecha" ? 0 : hacia === "abajo" ? lejos(i) : -lejos(i)}
              scale={abierto ? 1 : 0}
              transition="bouncy"
              delay={abierto ? i * 60 : (1 - i) * 40}
            >
              <li>
                <a
                  ref={i === 0 ? primero : undefined}
                  className={css.opcion}
                  href={o.href}
                  target="_blank"
                  rel="noopener"
                  hrefLang={o.lang}
                  lang={o.lang}
                  tabIndex={abierto ? 0 : -1}
                  download={descarga || undefined}
                  onClick={() => setAbierto(false)}
                >
                  {o.idioma}
                </a>
              </li>
            </Liquid.Item>
          ))}
        </ul>
      </Liquid>
      <button
        ref={boton}
        type="button"
        className={claseBoton}
        aria-expanded={abierto}
        aria-controls={id}
        aria-label={rotulo}
        title={enVisor ? rotulo : undefined}
        data-contacto={variante === "icono" ? "cv" : undefined}
        onClick={alternar}
      >
        {descarga ? (
          <IconoDescarga lado={18} />
        ) : variante === "icono" ? (
          <IconoCV />
        ) : !enVisor ? (
          variante === "texto" ? (
            NAV.cvVer[lang]
          ) : (
            NAV.cv[lang]
          )
        ) : (
          <>
            <IconoPestana lado={17} />
            {NAV.cvAbrir[lang]}
          </>
        )}
      </button>
    </div>
  );
}
