/**
 * Calculadora de costos (ruta /calculadora/).
 *
 * Responsabilidad: alojar el componente Calculadora y mostrar, de forma inevitable,
 * la fecha de verificación de content/precios.json, el aviso de «estimación
 * orientativa, precios de lista, sin descuentos» y el enlace a la calculadora oficial
 * https://cloud.google.com/products/calculator.
 */
import type { Metadata } from "next";
import Calculadora from "@/components/Calculadora";
import { fechaVerificacionPrecios } from "@/lib/contenido";

export const metadata: Metadata = {
  title: "Calculadora de costos",
  description: "Escenarios simples para hacerse una idea del orden de magnitud de una factura.",
};

export default function PaginaCalculadora() {
  const fecha = fechaVerificacionPrecios();
  return (
    <article className="seccion">
      <header className="seccion-cabecera">
        <h1 className="titular">Calculadora de costos</h1>
        <p className="entrada">
          Escenarios simples para hacerse una idea del orden de magnitud de una factura antes de
          pedirle al equipo técnico una estimación de verdad.
        </p>
      </header>
      <aside className="aviso-costo" aria-label="Alcance de las estimaciones">
        <p>
          Estimación orientativa con precios de lista en dólares,{" "}
          {fecha ? `verificados el ${fecha}` : "todavía sin verificar"}, sin descuentos por
          compromiso ni por uso sostenido. Para una cifra que sirva en un presupuesto, use la{" "}
          <a href="https://cloud.google.com/products/calculator" rel="noopener">
            calculadora oficial de Google Cloud
          </a>
          .
        </p>
      </aside>
      <Calculadora />
      <noscript>
        <p className="vacio">La calculadora necesita JavaScript. El resto de la guía, no.</p>
      </noscript>
    </article>
  );
}
