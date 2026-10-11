/**
 * LO QUE LOS DOS LAYOUTS RAIZ COMPARTEN. Hay dos (`(es)` y `(en)`) porque cada
 * idioma emite su propio `<html lang>`; todo lo demás vive acá, una sola vez.
 *
 * LAS TIPOGRAFIAS SE SIRVEN DESDE EL PROPIO DOMINIO: `next/font` las descarga
 * en el build, sin conexiones a terceros en el momento más caro de la página.
 * Una sola familia, en sus dos versiones variables:
 *
 *   · Geist: los títulos, la lectura y la interfaz.
 *   · Geist Mono: la voz de la máquina (números medidos, stack, fechas).
 */
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { EMAIL, GITHUB, LINKEDIN, META, NOMBRE, SITIO } from "@/contenido/sitio";
import { SALAS } from "@/contenido/salas";
import type { Idioma } from "@/contenido/tipos";
import { alternativas } from "@/lib/rutas";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--fuente-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--fuente-maquina",
  display: "swap",
});

const FUENTES = `${geist.variable} ${geistMono.variable}`;

const LOCALE: Record<Idioma, string> = { es: "es_AR", en: "en_US" };

/** Metadatos de una página. `ruta` es la de este idioma; `rutaOtra`, la del otro. */
export function metadatosDe(
  lang: Idioma,
  { titulo, descripcion, ruta, rutaOtra }: { titulo?: string; descripcion?: string; ruta: string; rutaOtra: string },
): Metadata {
  const t = titulo ?? META.titulo[lang];
  const d = descripcion ?? META.descripcion[lang];
  const [es, en] = lang === "es" ? [ruta, rutaOtra] : [rutaOtra, ruta];
  const og = lang === "es" ? "/og-1200x630.png" : "/og-1200x630-en.png";
  return {
    // Con `www.`: es el host canónico (el dominio pelado redirige a él).
    metadataBase: new URL(SITIO),
    title: t,
    description: d,
    authors: [{ name: NOMBRE, url: SITIO }],
    alternates: { canonical: ruta, languages: alternativas(es, en) },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/icono-192.png", sizes: "192x192", type: "image/png" }],
      apple: "/icono-180.png",
    },
    openGraph: {
      type: "website",
      locale: LOCALE[lang],
      url: ruta,
      siteName: NOMBRE,
      title: t,
      description: titulo ? d : META.social[lang],
      images: [{ url: og, width: 1200, height: 630, alt: NOMBRE }],
    },
    twitter: { card: "summary_large_image", title: t, description: titulo ? d : META.social[lang], images: [og] },
  };
}

export const VIEWPORT: Viewport = {
  // En hexa: `theme-color` se lee fuera de la hoja de estilos.
  themeColor: SALAS.taller.hex,
  colorScheme: "dark",
  viewportFit: "cover",
};

/**
 * DATOS ESTRUCTURADOS: sólo lo comprobable. Quién es, qué hace, dónde está y
 * dónde más se lo encuentra. Nada de títulos ni fechas que no estén en el CV.
 */
function persona(lang: Idioma) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: NOMBRE,
    url: SITIO,
    email: `mailto:${EMAIL}`,
    jobTitle: "Full Stack Developer",
    image: `${SITIO}/medios/persona/foto-900.webp`,
    address: { "@type": "PostalAddress", addressLocality: "Tandil", addressRegion: "Buenos Aires", addressCountry: "AR" },
    knowsLanguage: ["es", "en"],
    knowsAbout: ["Python", "TypeScript", "React", "Next.js", "FastAPI", "PostgreSQL", "RAG", "LLM", "Computer vision", "UX/UI"],
    sameAs: [LINKEDIN, GITHUB],
    description: META.descripcion[lang],
  };
}

/**
 * EL TINTE DE LA BARRA, POR PROYECTO. La barra superior está fija y no vive
 * dentro de ninguna sección: cuando `ObservadorSalas` marca en qué proyecto se
 * está (`<html data-sala>`), estas reglas le pasan su tinte.
 */
const CSS_NAV = Object.entries(SALAS)
  .map(
    ([id, a]) =>
      `:root[data-sala="${id}"]{--nav-fondo:${a.fondo};--nav-tinta:${a.tinta};--nav-tinta-2:${a.tinta2};--nav-pelo:${a.pelo};--nav-acento:${a.acento}}`,
  )
  .join("");

export function Documento({ lang, children }: { lang: Idioma; children: ReactNode }) {
  return (
    <html lang={lang} className={FUENTES} data-sala="taller" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: CSS_NAV }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(persona(lang)).replace(/</g, "\\u003c") }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
