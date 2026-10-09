/**
 * Glosario de términos.
 *
 * Responsabilidad: renderizar la lista alfabética de content/glosario.json, cada
 * término con su definición breve y su fuente oficial. Es el destino de los enlaces
 * a términos desde las secciones (ancla #termino-<slug>).
 */
import type { TerminoGlosario } from "@/lib/contenido";

function ancla(termino: string): string {
  return (
    "termino-" +
    termino
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  );
}

export default function Glosario({ terminos }: { terminos: TerminoGlosario[] }) {
  if (terminos.length === 0) {
    return <p className="vacio">El glosario se escribe junto con las secciones.</p>;
  }
  return (
    <dl className="glosario">
      {terminos.map((t) => (
        <div key={t.termino} id={ancla(t.termino)} className="glosario-entrada">
          <dt>{t.termino}</dt>
          <dd>
            {t.definicion}{" "}
            <a href={t.fuente} rel="noopener" className="glosario-fuente">
              Fuente oficial
            </a>
          </dd>
        </div>
      ))}
    </dl>
  );
}
