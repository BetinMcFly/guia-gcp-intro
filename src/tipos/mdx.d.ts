/**
 * Tipos de los módulos MDX de content/secciones.
 *
 * Responsabilidad: declarar lo que exporta cada sección además del componente:
 * `frontmatter` (lo inyecta remark-mdx-frontmatter) y, opcionalmente, `fuentes`.
 */
declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { Metadatos, FuenteOficial } from "@/lib/contenido";

  export const frontmatter: Metadatos;
  export const fuentes: FuenteOficial[] | undefined;
  const Contenido: ComponentType;
  export default Contenido;
}
