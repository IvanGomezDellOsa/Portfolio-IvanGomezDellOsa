/**
 * CÓMO SE PIDE UN VIDEO. Cualquier botón del sitio (la pantalla de una sala,
 * el reel del hero, una escena del caso) avisa con un evento y el teatro, que
 * está montado una sola vez por página, lo abre. Los botones son enlaces
 * reales a YouTube: si el teatro no está (sin JavaScript, o si falló), el
 * enlace funciona igual.
 */
import type { MouseEvent } from "react";

export const ABRIR_TEATRO = "teatro:abrir";

export interface PedidoTeatro {
  slug: string;
  t: number;
}

declare global {
  interface Window {
    __teatro?: boolean;
  }
}

/** Pide el video. Devuelve `false` si no hay teatro para abrirlo. */
export function abrirTeatro(slug: string, t = 0): boolean {
  if (typeof window === "undefined" || !window.__teatro) return false;
  window.dispatchEvent(new CustomEvent<PedidoTeatro>(ABRIR_TEATRO, { detail: { slug, t } }));
  return true;
}

/** El clic de un enlace a YouTube: abre el teatro, salvo que se pida otra pestaña. */
export function alClicVideo(e: MouseEvent<HTMLAnchorElement>, slug: string, t = 0) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  if (abrirTeatro(slug, t)) e.preventDefault();
}
