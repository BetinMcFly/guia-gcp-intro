/**
 * Bloque de fuentes oficiales.
 *
 * Responsabilidad: mostrar al pie de cada sección la lista de enlaces a
 * cloud.google.com que respaldan lo afirmado. Una sección sin este bloque no se
 * publica (CLAUDE.md, reglas de contenido); mientras está en preparación lo dice.
 */
import type { FuenteOficial } from "@/lib/contenido";

export default function Fuente({ fuentes }: { fuentes?: FuenteOficial[] }) {
  return (
    <section className="fuentes" aria-labelledby="fuentes-titulo">
      <h2 id="fuentes-titulo">Fuentes oficiales</h2>
      {fuentes && fuentes.length > 0 ? (
        <ul>
          {fuentes.map((f) => (
            <li key={f.url}>
              <a href={f.url} rel="noopener">
                {f.titulo}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Las fuentes se añaden junto con el contenido de la sección.</p>
      )}
    </section>
  );
}
