/**
 * Índice de búsqueda.
 *
 * Responsabilidad: construir en build un índice ligero (título, slug, fragmentos)
 * a partir de las secciones y el glosario, serializado como JSON estático que el
 * Buscador consulta en el navegador. Sin dependencias de red.
 *
 * Lee los MDX como texto plano con node:fs (solo en build, en el servidor), quita el
 * front matter, los exports y la sintaxis de Markdown, y parte el texto por
 * encabezados. Los ids de encabezado se calculan con github-slugger, el mismo
 * algoritmo que usa rehype-slug, para que las anclas coincidan.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import GithubSlugger from "github-slugger";
import { listarGlosario, SECCIONES } from "@/lib/contenido";

export interface EntradaIndice {
  /** Título de la sección o «Glosario». */
  origen: string;
  /** Encabezado del fragmento o término del glosario. */
  titulo: string;
  /** Ruta con ancla, p. ej. /computo/#qué-se-paga-en-gke o /glosario/#termino-zona */
  url: string;
  /** Texto plano del fragmento, en minúsculas y sin acentos para buscar. */
  texto: string;
  /** Texto original, para mostrar un extracto. */
  extracto: string;
}

export function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function anclaGlosario(termino: string): string {
  return "termino-" + normalizar(termino).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function limpiarMarkdown(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // enlaces → texto
    .replace(/[*_`>#|]/g, "")
    .replace(/^\s*[-\d.]+\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function indexarSeccion(slug: string): EntradaIndice[] {
  const ruta = join(process.cwd(), "content", "secciones", `${slug}.mdx`);
  let s = readFileSync(ruta, "utf8");
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(s);
  const titulo = fm ? (/titulo:\s*"([^"]*)"/.exec(fm[1])?.[1] ?? slug) : slug;
  s = s.replace(/^---\n[\s\S]*?\n---\n/, "");
  s = s.replace(/^export const fuentes = \[[\s\S]*?\];\n/m, "");
  s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  // Importaciones y etiquetas JSX de figuras: no son texto que buscar.
  s = s.replace(/^import .*$/gm, "");
  s = s.replace(/<[A-Z][A-Za-z]*[^>]*\/>/g, "");

  const slugger = new GithubSlugger();
  const entradas: EntradaIndice[] = [];
  const bloques = s.split(/^## /m);
  for (const bloque of bloques) {
    const salto = bloque.indexOf("\n");
    if (salto < 0) continue;
    const encabezado = bloque.slice(0, salto).trim();
    const cuerpo = limpiarMarkdown(bloque.slice(salto + 1));
    if (!encabezado || !cuerpo) continue;
    const id = slugger.slug(encabezado);
    entradas.push({
      origen: titulo,
      titulo: encabezado,
      url: `/${slug}/#${id}`,
      texto: normalizar(`${encabezado} ${cuerpo}`),
      extracto: cuerpo.slice(0, 220),
    });
  }
  return entradas;
}

export function construirIndice(): EntradaIndice[] {
  const secciones = SECCIONES.flatMap(indexarSeccion);
  const glosario = listarGlosario().map((t) => ({
    origen: "Glosario",
    titulo: t.termino,
    url: `/glosario/#${anclaGlosario(t.termino)}`,
    texto: normalizar(`${t.termino} ${(t.alias ?? []).join(" ")} ${t.definicion}`),
    extracto: t.definicion.slice(0, 220),
  }));
  return [...glosario, ...secciones];
}
