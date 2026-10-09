/**
 * Página de sección (ruta /<seccion>/).
 *
 * Responsabilidad: renderizar una sección de content/secciones/<seccion>.mdx con su
 * cuestionario (content/cuestionarios/<seccion>.json) y su bloque de fuentes
 * oficiales al pie. generateStaticParams enumera los slugs de content/ para que la
 * exportación estática genere una carpeta por sección.
 */
import { SECCIONES } from "@/lib/contenido";

export function generateStaticParams() {
  return SECCIONES.map((seccion) => ({ seccion }));
}

export default async function Seccion() {
  // PENDIENTE
  return null;
}
