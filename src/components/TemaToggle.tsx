/**
 * Botón de tema claro / oscuro.
 *
 * Responsabilidad: alternar el atributo data-theme del <html> entre "light" y
 * "dark" y recordar la elección en localStorage (clave "tema"). Es una comodidad
 * del lector, no progreso ni rastreo: la única excepción a «nada en localStorage»
 * que admite CLAUDE.md. Si localStorage falla (modo privado, bloqueo), el botón
 * sigue funcionando para la sesión. El guion en línea del layout aplica la
 * elección antes del primer pintado para evitar el parpadeo de tema.
 */
"use client";

import { useEffect, useState } from "react";

type Tema = "light" | "dark";

function temaActual(): Tema {
  const html = document.documentElement;
  const fijado = html.getAttribute("data-theme");
  if (fijado === "light" || fijado === "dark") return fijado;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function TemaToggle() {
  // null hasta montar: el servidor no sabe el tema y así el HTML es estable.
  const [tema, setTema] = useState<Tema | null>(null);

  useEffect(() => {
    setTema(temaActual());
  }, []);

  const alternar = () => {
    const nuevo: Tema = temaActual() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nuevo);
    setTema(nuevo);
    try {
      localStorage.setItem("tema", nuevo);
    } catch {
      /* sin almacenamiento: la elección dura lo que la página */
    }
  };

  const oscuro = tema === "dark";
  return (
    <button
      type="button"
      className="tema"
      onClick={alternar}
      aria-label={oscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      aria-pressed={oscuro}
    >
      {oscuro ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5h0a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 18a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zM2 12a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1zm17 0a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1zM4.9 4.9a1 1 0 0 1 1.4 0l1.4 1.4a1 1 0 0 1-1.4 1.4L4.9 6.3a1 1 0 0 1 0-1.4zm11.4 11.4a1 1 0 0 1 1.4 0l1.4 1.4a1 1 0 0 1-1.4 1.4l-1.4-1.4a1 1 0 0 1 0-1.4zM4.9 19.1a1 1 0 0 1 0-1.4l1.4-1.4a1 1 0 1 1 1.4 1.4l-1.4 1.4a1 1 0 0 1-1.4 0zM16.3 7.7a1 1 0 0 1 0-1.4l1.4-1.4a1 1 0 1 1 1.4 1.4l-1.4 1.4a1 1 0 0 1-1.4 0z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.3 2a9.9 9.9 0 0 0-1.6.1 1 1 0 0 0-.4 1.8A7 7 0 0 1 14 15.5a7 7 0 0 1-3.7 1.5 1 1 0 0 0-.8 1.6A10 10 0 1 0 12.3 2z" />
        </svg>
      )}
      <span className="tema-texto">{tema === null ? "Tema" : oscuro ? "Claro" : "Oscuro"}</span>
    </button>
  );
}
