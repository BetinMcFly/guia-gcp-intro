/**
 * Envoltorio de figura.
 *
 * Responsabilidad: presentar un diagrama SVG en línea con su pie, dentro de un marco
 * que en móvil se desplaza en horizontal (el SVG mantiene un ancho mínimo para que
 * el texto siga siendo legible). `overflow-y: hidden` es a propósito: con solo
 * `overflow-x`, el eje vertical pasa a `auto` y el marco atrapa el gesto táctil.
 */
import type { ReactNode } from "react";

export default function Figura({
  id,
  pie,
  children,
}: {
  id?: string;
  pie: string;
  children: ReactNode;
}) {
  return (
    <figure className="figura" id={id}>
      <div className="figura-scroll">{children}</div>
      <figcaption>{pie}</figcaption>
    </figure>
  );
}
