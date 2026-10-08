import type { MetadataRoute } from "next";
import { PROYECTOS } from "@/contenido/proyectos";
import { SITIO } from "@/contenido/sitio";
import { caso } from "@/lib/rutas";

export const dynamic = "force-static";

/** Cada página en sus dos idiomas, con su alternativa declarada. */
export default function sitemap(): MetadataRoute.Sitemap {
  const par = (es: string, en: string, prioridad: number): MetadataRoute.Sitemap =>
    [es, en].map((ruta) => ({
      url: `${SITIO}${ruta}`,
      changeFrequency: "monthly",
      priority: prioridad,
      alternates: { languages: { es: `${SITIO}${es}`, en: `${SITIO}${en}` } },
    }));
  return [...par("/", "/en/", 1), ...PROYECTOS.flatMap((p) => par(caso("es", p.slug), caso("en", p.slug), 0.8))];
}
