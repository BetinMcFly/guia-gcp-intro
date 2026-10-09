/**
 * Cuestionario de autoevaluación.
 *
 * Responsabilidad: mostrar las preguntas de opción múltiple de una sección y, al
 * elegir una opción, indicar si es correcta, por qué, y enlazar a la parte de la
 * sección que lo explica. Reglas fijas: NO persiste nada (ni localStorage, ni
 * cookies, ni envíos); al recargar se reinicia. Sin JavaScript muestra un aviso
 * corto en lugar de una zona vacía.
 */
"use client";

import { useState } from "react";
import type { Pregunta } from "@/lib/contenido";

export default function Cuestionario({ preguntas }: { preguntas: Pregunta[] }) {
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});

  if (preguntas.length === 0) return null;

  const responder = (id: string, opcion: number) =>
    setRespuestas((r) => ({ ...r, [id]: opcion }));

  return (
    <section className="cuestionario" aria-labelledby="cuestionario-titulo">
      <h2 id="cuestionario-titulo">Compruebe lo esencial</h2>
      <p className="cuestionario-nota">
        {preguntas.length} preguntas. Nada se guarda ni se envía: al recargar, se reinicia.
      </p>
      <noscript>
        <p className="vacio">El cuestionario necesita JavaScript. El resto de la sección, no.</p>
      </noscript>
      <ol className="preguntas">
        {preguntas.map((p) => {
          const elegida = respuestas[p.id];
          const respondida = elegida !== undefined;
          const acierto = elegida === p.correcta;
          return (
            <li key={p.id} className="pregunta">
              <p className="pregunta-texto" id={`${p.id}-texto`}>
                {p.pregunta}
              </p>
              <ul className="opciones" aria-labelledby={`${p.id}-texto`}>
                {p.opciones.map((texto, i) => {
                  let estado = "";
                  if (respondida && i === p.correcta) estado = "correcta";
                  else if (respondida && i === elegida) estado = "incorrecta";
                  return (
                    <li key={i}>
                      <button
                        type="button"
                        className={`opcion ${estado}`}
                        aria-pressed={elegida === i}
                        disabled={respondida}
                        onClick={() => responder(p.id, i)}
                      >
                        {texto}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="retro" role="status" aria-live="polite">
                {respondida && (
                  <p>
                    <strong>{acierto ? "Correcto." : "No es esa."}</strong> {p.explicacion}{" "}
                    <a href={p.ancla}>Volver a leerlo en la sección</a>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
