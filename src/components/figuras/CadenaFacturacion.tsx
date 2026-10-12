/**
 * Figura: cadena de facturación (sección 6).
 *
 * Responsabilidad: mostrar de dónde sale cada línea de la factura: recurso → SKU →
 * servicio → proyecto → cuenta de facturación → factura mensual, y dónde entran las
 * etiquetas, los descuentos, los informes y la exportación a BigQuery.
 * El <desc> enumera lo mismo que dibuja el SVG: si cambia uno, cambia el otro.
 */
import Figura from "@/components/Figura";
import { Caja, Flecha, Marcador, Rotulo } from "./primitivas";

export default function CadenaFacturacion() {
  const m = "cadena-punta";
  const md = "cadena-punta-dinero";
  const xs = [2, 164, 326, 488, 650, 812];
  return (
    <Figura pie="La cadena de un cargo. Un recurso consume; el consumo se mide contra un SKU con precio por región; el SKU pertenece a un servicio; el consumo ocurre en un proyecto, vinculado a una cuenta de facturación, que recibe la factura. Las etiquetas se ponen en el recurso; los descuentos actúan entre el SKU y la cuenta; los informes y la exportación salen de la cuenta.">
      <svg viewBox="0 0 960 300" role="img" aria-labelledby="cadena-t cadena-d">
        <title id="cadena-t">Cadena de facturación de Google Cloud</title>
        <desc id="cadena-d">
          Seis cajas en fila unidas por flechas: Recurso (una máquina, un bucket), SKU (precio por
          región), Servicio (Compute Engine, Cloud Storage…), Proyecto, Cuenta de facturación y
          Factura mensual. Debajo, tres notas con flechas: Etiquetas, que apuntan al recurso;
          Descuentos por uso sostenido, Spot y compromiso, que cubren del SKU a la cuenta; e
          Informes y exportación a BigQuery, que salen de la cuenta de facturación.
        </desc>
        <defs>
          <Marcador id={m} />
          <Marcador id={md} clase="fig-flecha-dinero-punta" />
        </defs>

        <Caja x={xs[0]} y={60} w={146} h={60} titulo="Recurso" sub="una máquina, un bucket" claseTexto="fig-texto fig-compacto" />
        <Caja x={xs[1]} y={60} w={146} h={60} titulo="SKU" sub="precio por región" clase="fig-dinero" claseTexto="fig-dinero-texto fig-compacto" />
        <Caja x={xs[2]} y={60} w={146} h={60} titulo="Servicio" sub="Compute Engine…" claseTexto="fig-texto fig-compacto" />
        <Caja x={xs[3]} y={60} w={146} h={60} titulo="Proyecto" sub="donde se consume" claseTexto="fig-texto fig-compacto" />
        <Caja x={xs[4]} y={60} w={146} h={60} titulo="Cuenta de facturación" sub="quién paga" clase="fig-dinero" claseTexto="fig-dinero-texto fig-compacto" />
        <Caja x={xs[5]} y={60} w={146} h={60} titulo="Factura mensual" sub="un resumen" clase="fig-dinero" claseTexto="fig-dinero-texto fig-compacto" />
        {xs.slice(0, 5).map((x) => (
          <Flecha key={x} d={`M ${x + 146} 90 L ${x + 160} 90`} marcador={m} />
        ))}

        {/* Etiquetas → recurso */}
        <Caja x={2} y={200} w={146} h={44} titulo="Etiquetas" sub="área, cliente, entorno" clase="fig-zona" claseTexto="fig-texto fig-compacto" />
        <Flecha d="M 75 200 L 75 124" marcador={m} />

        {/* Descuentos: del SKU a la cuenta */}
        <rect x={164} y={150} width={632} height={2} className="fig-flecha-dinero" />
        <Caja x={300} y={200} w={360} h={44} titulo="Descuentos" sub="uso sostenido, Spot, compromiso de uso" clase="fig-dinero" claseTexto="fig-dinero-texto" />
        <Flecha d="M 237 200 L 237 124" clase="fig-flecha-dinero" marcador={md} />
        <Flecha d="M 723 200 L 723 124" clase="fig-flecha-dinero" marcador={md} />
        <Rotulo x={480} y={172} clase="fig-dinero-texto fig-sutil">rebajan el precio antes de llegar a la cuenta</Rotulo>

        {/* Informes y exportación ← cuenta */}
        <Caja x={760} y={200} w={198} h={44} titulo="Informes y exportación" sub="por proyecto, SKU, etiqueta" clase="fig-zona" claseTexto="fig-texto fig-compacto" />
        <Flecha d="M 790 124 L 790 200" marcador={m} />
        <Rotulo x={480} y={280}>el detalle no está en la factura: está en los informes y en la exportación a BigQuery</Rotulo>
      </svg>
    </Figura>
  );
}
