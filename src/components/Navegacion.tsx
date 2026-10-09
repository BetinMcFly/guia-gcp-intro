/**
 * Navegación entre secciones.
 *
 * Responsabilidad: índice con las secciones en orden de lectura, glosario y
 * calculadora, marcando la entrada activa. Son enlaces normales: funciona sin
 * JavaScript. En escritorio vive en el riel izquierdo; en móvil, al pie, y la
 * cabecera enlaza a él con «Índice».
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ResumenSeccion } from "@/lib/contenido";

const HERRAMIENTAS = [
  { href: "/glosario/", titulo: "Glosario" },
  { href: "/calculadora/", titulo: "Calculadora de costos" },
];

export default function Navegacion({ secciones }: { secciones: ResumenSeccion[] }) {
  const ruta = usePathname();
  const activo = (href: string) => (ruta === href ? "page" : undefined);
  return (
    <nav id="indice" className="indice" aria-label="Índice de la guía">
      <p className="indice-titulo">Secciones, en orden de lectura</p>
      <ol className="indice-secciones">
        {secciones.map((s) => (
          <li key={s.slug}>
            <Link href={`/${s.slug}/`} aria-current={activo(`/${s.slug}/`)}>
              {s.titulo}
            </Link>
          </li>
        ))}
      </ol>
      <p className="indice-titulo">Herramientas</p>
      <ul className="indice-herramientas">
        {HERRAMIENTAS.map((h) => (
          <li key={h.href}>
            <Link href={h.href} aria-current={activo(h.href)}>
              {h.titulo}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
