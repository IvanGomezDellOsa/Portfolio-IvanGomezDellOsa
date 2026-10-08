import type { ReactNode } from "react";
import { Documento, VIEWPORT } from "../raiz";

export const viewport = VIEWPORT;

export default function Layout({ children }: { children: ReactNode }) {
  return <Documento lang="en">{children}</Documento>;
}
