/**
 * Acceso al contenido.
 *
 * Responsabilidad: única capa que lee content/. Expone los slugs y el orden de las
 * secciones, carga el MDX de una sección (componente, front matter y fuentes), su
 * cuestionario y el glosario. Los componentes y páginas reciben datos de aquí y
 * no leen archivos por su cuenta.
 */
import type { ComponentType } from "react";
import glosario from "../../content/glosario.json";
import precios from "../../content/precios.json";

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

export interface Metadatos {
  titulo: string;
  resumen: string;
  orden: number;
}

export interface FuenteOficial {
  titulo: string;
  url: string;
}

export interface TerminoGlosario {
  termino: string;
  definicion: string;
  fuente: string;
  alias?: string[];
}

export interface ModuloSeccion {
  default: ComponentType;
  frontmatter: Metadatos;
  fuentes?: FuenteOficial[];
}

export interface ResumenSeccion extends Metadatos {
  slug: Seccion;
}

export function esSeccion(valor: string): valor is Seccion {
  return (SECCIONES as readonly string[]).includes(valor);
}

export function cargarSeccion(slug: Seccion): Promise<ModuloSeccion> {
  return import(`../../content/secciones/${slug}.mdx`);
}

export async function listarSecciones(): Promise<ResumenSeccion[]> {
  const modulos = await Promise.all(SECCIONES.map(cargarSeccion));
  return modulos
    .map((m, i) => ({ slug: SECCIONES[i], ...m.frontmatter }))
    .sort((a, b) => a.orden - b.orden);
}

export function listarGlosario(): TerminoGlosario[] {
  return [...(glosario as TerminoGlosario[])].sort((a, b) =>
    a.termino.localeCompare(b.termino, "es"),
  );
}

/** Fecha en que se verificaron los precios, o null si aún no se ha hecho. */
export function fechaVerificacionPrecios(): string | null {
  return precios.fecha_verificacion;
}
