/**
 * Portada (ruta /).
 *
 * Responsabilidad: presentar a quién va dirigida la guía, qué va a aprender el lector
 * y el índice de secciones en orden de lectura. Es la única página con tono de
 * bienvenida; el resto enseña.
 */
import Link from "next/link";
import { listarSecciones } from "@/lib/contenido";

export default async function Portada() {
  const secciones = await listarSecciones();
  return (
    <article className="portada">
      <h1 className="titular">Entender Google Cloud lo suficiente para decidir sobre él.</h1>
      <p className="entrada">
        Una guía para directivos que no van a administrar la nube, pero sí van a aprobar su
        presupuesto. Siete secciones cortas con los conceptos que aparecen en cualquier
        conversación con el equipo técnico y, sobre todo, de dónde sale cada dólar de la
        factura.
      </p>

      <section aria-labelledby="como-leerla">
        <h2 id="como-leerla">Cómo leerla</h2>
        <p>
          En orden. Cada sección se apoya en la anterior, termina con un cuestionario breve para
          comprobar lo esencial, y cierra con las fuentes oficiales de Google que respaldan lo
          dicho. Los precios que aparecen son de lista, en dólares, y llevan la fecha en que se
          verificaron.
        </p>
      </section>

      <section aria-labelledby="secciones">
        <h2 id="secciones">Las siete secciones</h2>
        <ol className="lista-secciones">
          {secciones.map((s) => (
            <li key={s.slug}>
              <Link href={`/${s.slug}/`}>{s.titulo}</Link>
              <p>{s.resumen}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="herramientas">
        <h2 id="herramientas">Dos herramientas</h2>
        <ul className="lista-herramientas">
          <li>
            <Link href="/glosario/">Glosario</Link>
            <p>Cada término técnico que usa la guía, definido en una o dos frases.</p>
          </li>
          <li>
            <Link href="/calculadora/">Calculadora de costos</Link>
            <p>Escenarios simples para hacerse una idea del orden de magnitud de una factura.</p>
          </li>
        </ul>
      </section>
    </article>
  );
}
