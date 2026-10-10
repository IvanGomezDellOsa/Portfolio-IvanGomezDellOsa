/**
 * «CONTACTO», EN LA BARRA (prueba, 2026-10-10): en vez de bajar a una sección,
 * vuelve al hero y señala dónde está cada forma de contacto. Un anillo de luz
 * sale del enlace, rodea uno por uno los íconos (GitHub, LinkedIn, CV) y
 * termina en el del mail, que se abre con la dirección lista para copiar.
 *
 * Con movimiento reducido no hay anillo: sube y abre el mail.
 */

const ORDEN = ["github", "linkedin", "cv", "email"] as const;
const VUELO = 560;
const PAUSA = 340;
const LADO = 52;

const espera = (ms: number) => new Promise<void>((ok) => window.setTimeout(ok, ms));

/** Sube hasta el hero y avisa cuando la página ya está quieta arriba. */
async function subir(suave: boolean) {
  if (window.scrollY < 2) return;
  window.scrollTo({ top: 0, behavior: suave ? "smooth" : "auto" });
  const limite = performance.now() + 2500;
  while (window.scrollY > 1 && performance.now() < limite) await espera(60);
  await espera(160);
}

let enCurso = false;

export async function senalarContacto(origen: HTMLElement) {
  if (enCurso) return;
  enCurso = true;
  try {
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    await subir(!quieto);
    const hero = document.getElementById("inicio");
    const iconos = ORDEN.map((k) => hero?.querySelector<HTMLElement>(`[data-contacto="${k}"]`)).filter((x): x is HTMLElement => !!x);
    const mail = iconos[iconos.length - 1];
    if (!mail) return;
    if (quieto) {
      if (mail.getAttribute("aria-expanded") !== "true") mail.click();
      return;
    }

    const anillo = document.createElement("div");
    anillo.className = "guia-contacto";
    anillo.setAttribute("aria-hidden", "true");
    document.body.appendChild(anillo);
    const llevar = (el: HTMLElement, escala = 1) => {
      const r = el.getBoundingClientRect();
      anillo.style.translate = `${r.left + r.width / 2 - LADO / 2}px ${r.top + r.height / 2 - LADO / 2}px`;
      anillo.style.scale = String(escala);
    };

    // Nace chico, sobre el enlace de la barra, y vuela al primer ícono.
    anillo.style.transition = "none";
    llevar(origen, 0.35);
    void anillo.offsetWidth;
    anillo.style.transition = "";
    anillo.style.opacity = "1";
    for (const el of iconos) {
      llevar(el);
      await espera(VUELO);
      el.dataset.senalado = "";
      await espera(PAUSA);
      if (el !== mail) delete el.dataset.senalado;
    }
    if (mail.getAttribute("aria-expanded") !== "true") mail.click();
    anillo.style.opacity = "0";
    anillo.style.scale = "1.5";
    await espera(450);
    delete mail.dataset.senalado;
    anillo.remove();
  } finally {
    enCurso = false;
  }
}
