/**
 * Acceso al contenido.
 *
 * Responsabilidad: única capa que lee content/. Expone los slugs y el orden de las
 * secciones, carga el MDX de una sección, su cuestionario y el glosario. Los
 * componentes y páginas reciben datos de aquí y no leen archivos por su cuenta.
 */

/** Secciones en orden de lectura. Cada slug tiene su content/secciones/<slug>.mdx. */
export const SECCIONES = [
  "introduccion",
  "organizacion",
  "computo",
  "almacenamiento",
  "redes",
  "facturacion",
  "control-de-gasto",
] as const;

export type Seccion = (typeof SECCIONES)[number];
