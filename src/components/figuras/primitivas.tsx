/**
 * Primitivas de dibujo para los diagramas.
 *
 * Responsabilidad: cajas, flechas y marcadores con una sola regla: los colores van
 * por clase CSS (globals.css, clases .fig-*), nunca por atributo fill/stroke, para que
 * el tema claro/oscuro llegue al SVG. Los textos heredan Roboto de la página.
 */
export function Caja({
  x,
  y,
  w,
  h,
  titulo,
  sub,
  clase = "fig-caja",
  claseTexto = "fig-texto",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  titulo: string;
  sub?: string;
  clase?: string;
  claseTexto?: string;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} className={clase} />
      <text x={cx} y={sub ? y + h / 2 - 3 : y + h / 2 + 5} textAnchor="middle" className={`${claseTexto} fig-titulo`}>
        {titulo}
      </text>
      {sub && (
        <text x={cx} y={y + h / 2 + 14} textAnchor="middle" className="fig-sutil">
          {sub}
        </text>
      )}
    </g>
  );
}

export function Flecha({ d, clase = "fig-flecha", marcador }: { d: string; clase?: string; marcador: string }) {
  return <path d={d} className={clase} markerEnd={`url(#${marcador})`} />;
}

export function Marcador({ id, clase = "fig-flecha-punta" }: { id: string; clase?: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" className={clase} />
    </marker>
  );
}

export function Rotulo({
  x,
  y,
  children,
  clase = "fig-sutil",
  anchor = "middle",
}: {
  x: number;
  y: number;
  children: string;
  clase?: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={clase}>
      {children}
    </text>
  );
}
