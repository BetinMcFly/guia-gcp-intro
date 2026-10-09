/**
 * Página de sección (ruta /<seccion>/).
 *
 * Responsabilidad: renderizar una sección de content/secciones/<seccion>.mdx con su
 * número de orden, su resumen como entrada, el cuestionario y el bloque de fuentes
 * oficiales al pie, más el enlace a la siguiente sección. generateStaticParams
 * enumera los slugs para que la exportación estática genere una carpeta por sección.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cuestionario from "@/components/Cuestionario";
import Fuente from "@/components/Fuente";
import { cargarSeccion, esSeccion, listarSecciones, SECCIONES } from "@/lib/contenido";

type Params = { seccion: string };

export function generateStaticParams(): Params[] {
  return SECCIONES.map((seccion) => ({ seccion }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { seccion } = await params;
  if (!esSeccion(seccion)) return {};
  const { frontmatter } = await cargarSeccion(seccion);
  return { title: frontmatter.titulo, description: frontmatter.resumen };
}

export default async function Seccion({ params }: { params: Promise<Params> }) {
  const { seccion } = await params;
  if (!esSeccion(seccion)) notFound();

  const [{ default: Contenido, frontmatter, fuentes }, todas] = await Promise.all([
    cargarSeccion(seccion),
    listarSecciones(),
  ]);
  const posicion = todas.findIndex((s) => s.slug === seccion);
  const siguiente = todas[posicion + 1];

  return (
    <article className="seccion">
      <header className="seccion-cabecera">
        <p className="seccion-orden">
          Sección {frontmatter.orden} de {todas.length}
        </p>
        <h1 className="titular">{frontmatter.titulo}</h1>
        <p className="entrada">{frontmatter.resumen}</p>
      </header>

      <div className="prosa">
        <Contenido />
      </div>

      <Cuestionario />

      <Fuente fuentes={fuentes} />

      {siguiente ? (
        <nav className="siguiente" aria-label="Siguiente sección">
          <p>Siguiente sección</p>
          <Link href={`/${siguiente.slug}/`}>{siguiente.titulo}</Link>
        </nav>
      ) : (
        <nav className="siguiente" aria-label="Fin de la guía">
          <p>Fin de la guía</p>
          <Link href="/glosario/">Repasar el glosario</Link>
        </nav>
      )}
    </article>
  );
}
