import type { ReactNode } from "react";

/**
 * EL MARCADO MINIMO DE LOS TEXTOS: **negrita**, *cursiva*, `código` y
 * [enlace](url). Se arma con elementos de React, sin `dangerouslySetInnerHTML`:
 * lo que no es marcado sale como texto, siempre.
 */
function partes(t: string, clave = "t"): ReactNode[] {
  const patron = /\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g;
  const out: ReactNode[] = [];
  let ultimo = 0;
  let n = 0;
  for (let m = patron.exec(t); m; m = patron.exec(t)) {
    if (m.index > ultimo) out.push(t.slice(ultimo, m.index));
    const k = `${clave}-${n++}`;
    if (m[1] !== undefined) out.push(<strong key={k}>{partes(m[1], k)}</strong>);
    else if (m[2] !== undefined) out.push(<em key={k}>{partes(m[2], k)}</em>);
    else if (m[3] !== undefined) out.push(<code key={k}>{m[3]}</code>);
    else if (m[4] !== undefined && m[5] !== undefined) {
      const externo = /^https?:/.test(m[5]);
      out.push(
        <a key={k} href={m[5]} {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {partes(m[4], k)}
        </a>,
      );
    }
    ultimo = patron.lastIndex;
  }
  if (ultimo < t.length) out.push(t.slice(ultimo));
  return out;
}

export function Texto({ t }: { t: string }) {
  return <>{partes(t)}</>;
}

/** El texto plano, sin marcas: para `alt`, `aria-label` y metadatos. */
export const plano = (t: string) =>
  t.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
