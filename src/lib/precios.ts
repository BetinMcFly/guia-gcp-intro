/**
 * Precios y estimaciones.
 *
 * Responsabilidad: leer content/precios.json, exponer la fecha de verificación, la
 * región y la moneda, y las funciones puras de estimación que usa la Calculadora.
 * Es el único módulo que conoce cifras de precio. Las funciones son puras y
 * deterministas para poder probarlas sin navegador.
 *
 * Convención: un mes son 730 horas (365 × 24 / 12), la misma que usa Google en sus
 * tablas de precios mensuales. Las estimaciones son orientativas, a precio de lista,
 * sin descuentos ni nivel gratuito.
 */
import precios from "../../content/precios.json";

export interface ItemPrecio {
  id: string;
  concepto: string;
  usd: number;
  unidad: string;
  url: string;
  sku?: string;
}

export interface Linea {
  concepto: string;
  usd: number;
}

export interface Estimacion {
  total: number;
  lineas: Linea[];
}

export const HORAS_MES = 730;

const tabla = precios as {
  fecha_verificacion: string | null;
  region: string;
  moneda: string;
  fuente_calculadora_oficial: string;
  items: ItemPrecio[];
};

export const META_PRECIOS = {
  fecha: tabla.fecha_verificacion,
  region: tabla.region,
  moneda: tabla.moneda,
  calculadoraOficial: tabla.fuente_calculadora_oficial,
};

export function precioDe(id: string): ItemPrecio {
  const item = tabla.items.find((i) => i.id === id);
  if (!item) throw new Error(`No hay precio con id "${id}" en content/precios.json`);
  return item;
}

function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}

function cerrar(lineas: Linea[]): Estimacion {
  const l = lineas.map((x) => ({ ...x, usd: redondear(x.usd) }));
  return { total: redondear(l.reduce((a, b) => a + b.usd, 0)), lineas: l };
}

/** Máquina virtual E2 encendida `horasMes` horas, con disco balanceado. */
export function estimarMaquinaVirtual(p: {
  vcpu: number;
  ramGiB: number;
  horasMes: number;
  discoGiB: number;
}): Estimacion {
  const core = precioDe("vm_e2_vcpu_hora");
  const ram = precioDe("vm_e2_ram_gib_hora");
  const disco = precioDe("disco_balanceado_gib_mes");
  return cerrar([
    { concepto: `${p.vcpu} vCPU × ${p.horasMes} h`, usd: p.vcpu * p.horasMes * core.usd },
    { concepto: `${p.ramGiB} GiB de memoria × ${p.horasMes} h`, usd: p.ramGiB * p.horasMes * ram.usd },
    { concepto: `Disco balanceado de ${p.discoGiB} GiB (todo el mes)`, usd: p.discoGiB * disco.usd },
  ]);
}

export type ClaseAlmacenamiento = "standard" | "nearline" | "coldline" | "archive";

/** Guardar `gib` en Cloud Storage un mes, en una clase, sin contar operaciones. */
export function estimarAlmacenamiento(p: { gib: number; clase: ClaseAlmacenamiento }): Estimacion {
  const item = precioDe(`storage_${p.clase}_gib_mes`);
  return cerrar([{ concepto: `${p.gib} GiB en clase ${p.clase} durante un mes`, usd: p.gib * item.usd }]);
}

/** Sacar `gib` a internet en un mes, nivel Premium, primer tramo de precio. */
export function estimarSalidaInternet(p: { gib: number }): Estimacion {
  const item = precioDe("salida_internet_premium_gib");
  return cerrar([{ concepto: `${p.gib} GiB hacia internet (nivel Premium, primer tramo)`, usd: p.gib * item.usd }]);
}

/** Consultas bajo demanda y almacenamiento activo en BigQuery, un mes. */
export function estimarBigQuery(p: { tibConsultados: number; gibAlmacenados: number }): Estimacion {
  const consulta = precioDe("bigquery_consulta_tib");
  const almacen = precioDe("bigquery_almacen_activo_gib_mes");
  return cerrar([
    { concepto: `${p.tibConsultados} TiB leídos por consultas bajo demanda`, usd: p.tibConsultados * consulta.usd },
    { concepto: `${p.gibAlmacenados} GiB de almacenamiento activo un mes`, usd: p.gibAlmacenados * almacen.usd },
  ]);
}

/** Servicio en Cloud Run, facturación por solicitudes: tiempo activo y solicitudes. */
export function estimarCloudRun(p: {
  vcpu: number;
  gib: number;
  horasActivasMes: number;
  millonesSolicitudes: number;
}): Estimacion {
  const cpu = precioDe("cloudrun_vcpu_segundo");
  const mem = precioDe("cloudrun_gib_segundo");
  const req = precioDe("cloudrun_millon_solicitudes");
  const seg = p.horasActivasMes * 3600;
  return cerrar([
    { concepto: `${p.vcpu} vCPU × ${p.horasActivasMes} h activas`, usd: p.vcpu * seg * cpu.usd },
    { concepto: `${p.gib} GiB × ${p.horasActivasMes} h activas`, usd: p.gib * seg * mem.usd },
    { concepto: `${p.millonesSolicitudes} millones de solicitudes`, usd: p.millonesSolicitudes * req.usd },
  ]);
}

export function formatearUSD(n: number): string {
  return new Intl.NumberFormat("es", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
}
