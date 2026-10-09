/**
 * Componentes que usa MDX al renderizar las secciones.
 *
 * Responsabilidad: mapear elementos de Markdown a los componentes de la guía.
 * Next lo exige con este nombre y en esta ubicación para el App Router.
 */
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components };
}
