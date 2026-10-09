/**
 * Página 404.
 *
 * Responsabilidad: Next.js la exporta como out/404.html y Firebase Hosting la sirve
 * para cualquier ruta inexistente. Ofrece el índice de secciones, no un callejón.
 */
import Link from "next/link";
import { listarSecciones } from "@/lib/contenido";

export default async function NoEncontrada() {
  const secciones = await listarSecciones();
  return (
    <article className="seccion">
      <header className="seccion-cabecera">
        <h1 className="titular">Esta página no existe.</h1>
        <p className="entrada">
          Puede que el enlace esté mal escrito o que la sección haya cambiado de nombre. Estas son
          las que hay.
        </p>
      </header>
      <ol className="lista-secciones">
        {secciones.map((s) => (
          <li key={s.slug}>
            <Link href={`/${s.slug}/`}>{s.titulo}</Link>
          </li>
        ))}
      </ol>
      <p>
        <Link href="/">Volver a la portada</Link>
      </p>
    </article>
  );
}
