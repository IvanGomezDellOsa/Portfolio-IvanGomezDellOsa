/**
 * LA 404 DE TODO EL SITIO. Con dos layouts raíz (uno por idioma) no hay un
 * layout común del que colgar un `not-found`: esta página se arma sola, con su
 * propio documento, y responde en los dos idiomas.
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NO_ENCONTRADA } from "@/contenido/sitio";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--fuente-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--fuente-maquina", display: "swap" });

export const metadata: Metadata = { title: "404 · Iván Gómez Dell’Osa" };

export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <main
          style={{
            minHeight: "100svh",
            display: "grid",
            placeContent: "center",
            gap: 18,
            padding: "0 var(--canal)",
            textAlign: "center",
          }}
        >
          <p className="etiqueta">404</p>
          <h1 style={{ fontWeight: 600, fontSize: "clamp(36px, 5.4vw, 64px)", letterSpacing: "-0.05em", lineHeight: 1 }}>
            {NO_ENCONTRADA.titulo.es}
          </h1>
          <p style={{ color: "var(--tinta-2)" }}>{NO_ENCONTRADA.texto.es}</p>
          <p lang="en" style={{ color: "var(--tinta-3)" }}>
            {NO_ENCONTRADA.titulo.en}. {NO_ENCONTRADA.texto.en}
          </p>
          <p style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 10 }}>
            <a className="pastilla" href="/">
              {NO_ENCONTRADA.volver.es}
            </a>
            <a className="pastilla hueca" href="/en/" lang="en">
              {NO_ENCONTRADA.volver.en}
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
