/**
 * Buscador de contenido.
 *
 * Responsabilidad: búsqueda en el navegador sobre el índice generado en build por
 * src/lib/indice-busqueda.ts (secciones y glosario). Sin servicios externos. Sin
 * JavaScript, muestra un enlace al glosario en lugar del campo de búsqueda.
 *
 * Puntuación simple y predecible: cada palabra de la consulta que aparece en el
 * título vale más que en el cuerpo; se muestran los diez mejores.
 */
"use client";

import { useId, useMemo, useState } from "react";
import type { EntradaIndice } from "@/lib/indice-busqueda";

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function puntuar(e: EntradaIndice, palabras: string[]): number {
  const titulo = normalizar(e.titulo);
  let p = 0;
  for (const w of palabras) {
    if (titulo.includes(w)) p += 5;
    if (e.texto.includes(w)) p += 1;
  }
  // Todas las palabras presentes: bonificación.
  if (palabras.every((w) => e.texto.includes(w))) p += 3;
  return p;
}

export default function Buscador({ indice }: { indice: EntradaIndice[] }) {
  const [consulta, setConsulta] = useState("");
  const id = useId();
  const palabras = useMemo(
    () => normalizar(consulta).split(" ").filter((w) => w.length >= 2),
    [consulta],
  );
  const resultados = useMemo(() => {
    if (palabras.length === 0) return [];
    return indice
      .map((e) => ({ e, p: puntuar(e, palabras) }))
      .filter((r) => r.p > 0)
      .sort((a, b) => b.p - a.p)
      .slice(0, 10);
  }, [indice, palabras]);

  return (
    <section className="buscador" id="buscador" aria-labelledby={`${id}-titulo`}>
      <h2 id={`${id}-titulo`} className="buscador-titulo">
        Buscar en la guía
      </h2>
      <label className="buscador-campo">
        <span className="visualmente-oculto">Buscar términos o temas</span>
        <input
          type="search"
          placeholder="Por ejemplo: egress, cuota, Spot…"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          autoComplete="off"
        />
      </label>
      <div role="status" aria-live="polite">
        {palabras.length > 0 && resultados.length === 0 && (
          <p className="vacio">Nada con esas palabras. Pruebe con un término más corto.</p>
        )}
        {resultados.length > 0 && (
          <ol className="resultados">
            {resultados.map(({ e }) => (
              <li key={e.url}>
                <a href={e.url}>
                  <span className="resultado-origen">{e.origen}</span>
                  <span className="resultado-titulo">{e.titulo}</span>
                  <span className="resultado-extracto">{e.extracto}…</span>
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>
      <noscript>
        <p className="vacio">La búsqueda necesita JavaScript. El glosario de abajo, no.</p>
      </noscript>
    </section>
  );
}
