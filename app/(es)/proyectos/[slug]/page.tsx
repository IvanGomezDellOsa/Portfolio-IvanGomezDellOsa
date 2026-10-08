import type { Metadata } from "next";
import { PaginaCaso, tituloCaso } from "@/componentes/PaginaCaso";
import { PROYECTOS, proyectoPorSlug } from "@/contenido/proyectos";
import { caso } from "@/lib/rutas";
import { metadatosDe } from "../../../raiz";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROYECTOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = proyectoPorSlug(slug)!;
  return metadatosDe("es", {
    titulo: tituloCaso(p.nombre),
    descripcion: p.descripcionMeta.es,
    ruta: caso("es", slug),
    rutaOtra: caso("en", slug),
  });
}

export default async function Pagina({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PaginaCaso lang="es" slug={slug} />;
}
