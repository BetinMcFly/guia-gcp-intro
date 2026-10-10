/**
 * Calculadora de costos.
 *
 * Responsabilidad: permitir escenarios simples («una máquina de este tamaño durante
 * un mes», «guardar X TB») y estimar su costo mensual leyendo exclusivamente
 * content/precios.json a través de src/lib/precios.ts. Nunca contiene cifras de
 * precio en el código. Muestra la fecha de verificación y el aviso de estimación
 * orientativa junto a cada resultado. No guarda nada.
 */
"use client";

import { useState } from "react";
import {
  estimarAlmacenamiento,
  estimarBigQuery,
  estimarCloudRun,
  estimarMaquinaVirtual,
  estimarSalidaInternet,
  formatearUSD,
  HORAS_MES,
  META_PRECIOS,
  type ClaseAlmacenamiento,
  type Estimacion,
} from "@/lib/precios";

type Escenario = "vm" | "storage" | "salida" | "bigquery" | "cloudrun";

const ESCENARIOS: { id: Escenario; titulo: string; descripcion: string }[] = [
  { id: "vm", titulo: "Una máquina virtual", descripcion: "Encendida cierto número de horas al mes, con su disco." },
  { id: "storage", titulo: "Guardar archivos", descripcion: "Cierta cantidad de datos en Cloud Storage, un mes, en una clase." },
  { id: "salida", titulo: "Sacar datos a internet", descripcion: "Datos que salen hacia los usuarios o hacia otro proveedor." },
  { id: "bigquery", titulo: "Analizar datos en BigQuery", descripcion: "Consultas bajo demanda y datos almacenados." },
  { id: "cloudrun", titulo: "Un servicio en Cloud Run", descripcion: "Facturado por solicitudes: tiempo activo y número de peticiones." },
];

function Numero({
  id,
  etiqueta,
  valor,
  min,
  paso,
  onChange,
}: {
  id: string;
  etiqueta: string;
  valor: number;
  min?: number;
  paso?: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min ?? 0}
        step={paso ?? 1}
        value={valor}
        onChange={(e) => onChange(Math.max(min ?? 0, Number(e.target.value) || 0))}
      />
    </div>
  );
}

function Resultado({ e }: { e: Estimacion }) {
  return (
    <div className="resultado" role="status" aria-live="polite">
      <p className="resultado-total">
        <span>Estimación mensual</span>
        <strong>{formatearUSD(e.total)}</strong>
      </p>
      <ul className="resultado-lineas">
        {e.lineas.map((l) => (
          <li key={l.concepto}>
            <span>{l.concepto}</span>
            <span>{formatearUSD(l.usd)}</span>
          </li>
        ))}
      </ul>
      <p className="resultado-nota">
        Precio de lista en {META_PRECIOS.region}, sin descuentos ni nivel gratuito,{" "}
        {META_PRECIOS.fecha ? `verificado el ${META_PRECIOS.fecha}` : "pendiente de verificación"}.
      </p>
    </div>
  );
}

export default function Calculadora() {
  const [escenario, setEscenario] = useState<Escenario>("vm");
  const [vm, setVm] = useState({ vcpu: 2, ramGiB: 8, horasMes: HORAS_MES, discoGiB: 100 });
  const [st, setSt] = useState<{ gib: number; clase: ClaseAlmacenamiento }>({ gib: 1000, clase: "standard" });
  const [sal, setSal] = useState({ gib: 500 });
  const [bq, setBq] = useState({ tibConsultados: 5, gibAlmacenados: 500 });
  const [cr, setCr] = useState({ vcpu: 1, gib: 0.5, horasActivasMes: 60, millonesSolicitudes: 2 });

  return (
    <div className="calculadora">
      <fieldset className="escenarios">
        <legend>Qué quiere estimar</legend>
        {ESCENARIOS.map((e) => (
          <label key={e.id} className={`escenario ${escenario === e.id ? "activo" : ""}`}>
            <input
              type="radio"
              name="escenario"
              value={e.id}
              checked={escenario === e.id}
              onChange={() => setEscenario(e.id)}
            />
            <span className="escenario-titulo">{e.titulo}</span>
            <span className="escenario-desc">{e.descripcion}</span>
          </label>
        ))}
      </fieldset>

      {escenario === "vm" && (
        <section className="panel" aria-label="Máquina virtual">
          <div className="campos">
            <Numero id="vm-vcpu" etiqueta="Procesadores (vCPU)" valor={vm.vcpu} min={1} onChange={(n) => setVm({ ...vm, vcpu: n })} />
            <Numero id="vm-ram" etiqueta="Memoria (GiB)" valor={vm.ramGiB} min={1} onChange={(n) => setVm({ ...vm, ramGiB: n })} />
            <Numero id="vm-horas" etiqueta={`Horas encendida al mes (${HORAS_MES} = todo el mes)`} valor={vm.horasMes} min={0} onChange={(n) => setVm({ ...vm, horasMes: Math.min(n, HORAS_MES) })} />
            <Numero id="vm-disco" etiqueta="Disco (GiB)" valor={vm.discoGiB} min={10} paso={10} onChange={(n) => setVm({ ...vm, discoGiB: n })} />
          </div>
          <Resultado e={estimarMaquinaVirtual(vm)} />
          <p className="pista">
            Pruebe a bajar las horas a 200, lo que dura una jornada laboral al mes: es la diferencia
            entre una máquina que se apaga por la noche y una que no.
          </p>
        </section>
      )}

      {escenario === "storage" && (
        <section className="panel" aria-label="Guardar archivos">
          <div className="campos">
            <Numero id="st-gib" etiqueta="Datos guardados (GiB)" valor={st.gib} min={1} paso={100} onChange={(n) => setSt({ ...st, gib: n })} />
            <div className="campo">
              <label htmlFor="st-clase">Clase de almacenamiento</label>
              <select id="st-clase" value={st.clase} onChange={(e) => setSt({ ...st, clase: e.target.value as ClaseAlmacenamiento })}>
                <option value="standard">Standard (uso frecuente)</option>
                <option value="nearline">Nearline (una vez al mes)</option>
                <option value="coldline">Coldline (una vez al trimestre)</option>
                <option value="archive">Archive (menos de una vez al año)</option>
              </select>
            </div>
          </div>
          <Resultado e={estimarAlmacenamiento(st)} />
          <p className="pista">
            Solo el espacio. Las clases frías cobran además por leer y exigen un periodo mínimo; la
            sección 4 explica cuándo compensan.
          </p>
        </section>
      )}

      {escenario === "salida" && (
        <section className="panel" aria-label="Sacar datos a internet">
          <div className="campos">
            <Numero id="sal-gib" etiqueta="Datos que salen a internet al mes (GiB)" valor={sal.gib} min={0} paso={100} onChange={(n) => setSal({ gib: n })} />
          </div>
          <Resultado e={estimarSalidaInternet(sal)} />
          <p className="pista">
            Precio del primer tramo del nivel Premium hacia la mayoría de destinos; a partir de ciertos
            volúmenes el precio por GiB baja. Meter datos no cuesta; sacarlos, sí.
          </p>
        </section>
      )}

      {escenario === "bigquery" && (
        <section className="panel" aria-label="BigQuery">
          <div className="campos">
            <Numero id="bq-tib" etiqueta="Datos leídos por consultas al mes (TiB)" valor={bq.tibConsultados} min={0} paso={0.5} onChange={(n) => setBq({ ...bq, tibConsultados: n })} />
            <Numero id="bq-gib" etiqueta="Datos almacenados (GiB)" valor={bq.gibAlmacenados} min={0} paso={100} onChange={(n) => setBq({ ...bq, gibAlmacenados: n })} />
          </div>
          <Resultado e={estimarBigQuery(bq)} />
          <p className="pista">
            Bajo demanda se paga por lo que leen las consultas, no por lo que tardan. Un TiB leído
            cuesta más que guardar cientos de GiB un mes.
          </p>
        </section>
      )}

      {escenario === "cloudrun" && (
        <section className="panel" aria-label="Cloud Run">
          <div className="campos">
            <Numero id="cr-vcpu" etiqueta="vCPU por instancia" valor={cr.vcpu} min={1} onChange={(n) => setCr({ ...cr, vcpu: n })} />
            <Numero id="cr-gib" etiqueta="Memoria por instancia (GiB)" valor={cr.gib} min={0.25} paso={0.25} onChange={(n) => setCr({ ...cr, gib: n })} />
            <Numero id="cr-horas" etiqueta="Horas activas al mes (atendiendo solicitudes)" valor={cr.horasActivasMes} min={0} paso={10} onChange={(n) => setCr({ ...cr, horasActivasMes: Math.min(n, HORAS_MES) })} />
            <Numero id="cr-req" etiqueta="Solicitudes al mes (millones)" valor={cr.millonesSolicitudes} min={0} paso={0.5} onChange={(n) => setCr({ ...cr, millonesSolicitudes: n })} />
          </div>
          <Resultado e={estimarCloudRun(cr)} />
          <p className="pista">
            Compare con una máquina virtual de la misma capacidad encendida todo el mes: en Cloud Run
            solo se paga el tiempo en que algo se está atendiendo.
          </p>
        </section>
      )}
    </div>
  );
}
