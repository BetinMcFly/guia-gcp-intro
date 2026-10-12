/**
 * Figura: arquitectura de referencia (sección 1, enlazada desde la portada).
 *
 * Responsabilidad: una empresa típica en Google Cloud en un solo dibujo: organización,
 * carpetas y proyectos; dentro del proyecto de producción, el balanceador global, la
 * red VPC global con dos regiones de tres zonas, la aplicación y Cloud SQL en zonas,
 * Cloud Storage y BigQuery; el proyecto de pruebas aparte; la cuenta de facturación
 * fuera de la jerarquía; IAM como capa que atraviesa todo de arriba abajo.
 * El <desc> enumera lo mismo que dibuja el SVG: si cambia uno, cambia el otro.
 */
import Figura from "@/components/Figura";
import { Caja, Flecha, Marcador, Rotulo } from "./primitivas";

function RegionMini({ x, y, nombre, sql }: { x: number; y: number; nombre: string; sql: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={250} height={190} rx={8} className="fig-caja" />
      <Rotulo x={x + 125} y={y + 20} clase="fig-texto fig-titulo">{nombre}</Rotulo>
      <Rotulo x={x + 125} y={y + 38} clase="fig-sutil">subred regional</Rotulo>
      {["a", "b", "c"].map((z, i) => {
        const zx = x + 10 + i * 78;
        return (
          <g key={z}>
            <rect x={zx} y={y + 48} width={72} height={132} rx={6} className="fig-zona" />
            <Rotulo x={zx + 36} y={y + 66} clase="fig-sutil">{`Zona ${z}`}</Rotulo>
            <rect x={zx + 8} y={y + 76} width={56} height={34} rx={5} className="fig-caja" />
            <Rotulo x={zx + 36} y={y + 97} clase="fig-texto">App</Rotulo>
            {sql && i < 2 && (
              <g>
                <rect x={zx + 8} y={y + 120} width={56} height={48} rx={5} className="fig-caja" />
                <Rotulo x={zx + 36} y={y + 139} clase="fig-texto">SQL</Rotulo>
                <Rotulo x={zx + 36} y={y + 156} clase="fig-sutil">{i === 0 ? "principal" : "en espera"}</Rotulo>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

export default function ArquitecturaReferencia() {
  const m = "arq-punta";
  const mp = "arq-punta-primario";
  const md = "arq-punta-dinero";
  return (
    <Figura
      id="arquitectura-de-referencia"
      pie="Una empresa típica en Google Cloud. Todo cuelga de la organización y vive dentro de proyectos. El proyecto de producción tiene una red global con dos regiones de tres zonas, la aplicación repartida en ellas, Cloud SQL con copia en espera, y servicios de datos. Los usuarios entran por un balanceador global. La cuenta de facturación paga los proyectos desde fuera del árbol, e IAM decide quién puede hacer qué en cada nivel."
    >
      <svg viewBox="0 0 960 660" role="img" aria-labelledby="arq-t arq-d">
        <title id="arq-t">Arquitectura de referencia de una empresa en Google Cloud</title>
        <desc id="arq-d">
          Arriba, la organización; debajo, las carpetas Producción y Pruebas. Bajo Producción, un
          proyecto grande, app-produccion, que contiene: un balanceador global al que llegan los
          usuarios de internet; una red VPC global con dos regiones, A y B, cada una con una subred
          y tres zonas con la aplicación en cada zona, y en la región A Cloud SQL principal en la
          zona a y en espera en la zona b; y debajo, Cloud Storage y BigQuery como servicios del
          proyecto. Bajo Pruebas, un proyecto pequeño, sandbox-equipo, con una máquina virtual de
          pruebas. A la derecha, abajo, la cuenta de facturación, unida con líneas discontinuas a
          los dos proyectos. A la izquierda, una flecha vertical rotulada IAM: los permisos se
          heredan hacia abajo. Leyenda: recurso; entrada de usuarios; dinero.
        </desc>
        <defs>
          <Marcador id={m} />
          <Marcador id={mp} clase="fig-flecha-primario-punta" />
          <Marcador id={md} clase="fig-flecha-dinero-punta" />
        </defs>

        {/* IAM: capa que atraviesa */}
        <Flecha d="M 22 70 L 22 560" clase="fig-flecha-primario" marcador={mp} />
        <text transform="translate(14 330) rotate(-90)" textAnchor="middle" className="fig-primario-texto fig-sutil">
          IAM: quién puede hacer qué · se hereda hacia abajo
        </text>

        {/* Jerarquía */}
        <Caja x={380} y={14} w={200} h={40} titulo="Organización" />
        <Caja x={170} y={76} w={190} h={38} titulo="Carpeta Producción" />
        <Caja x={620} y={76} w={190} h={38} titulo="Carpeta Pruebas" />
        <path d="M 480 54 L 480 66 L 265 66 L 265 76" className="fig-linea" />
        <path d="M 480 66 L 715 66 L 715 76" className="fig-linea" />
        <path d="M 265 114 L 265 134" className="fig-linea" />
        
        {/* Proyecto de producción */}
        <rect x={44} y={134} width={590} height={470} rx={12} className="fig-contenedor" />
        <Rotulo x={60} y={156} anchor="start" clase="fig-texto fig-titulo">Proyecto app-produccion</Rotulo>

        <Caja x={400} y={168} w={220} h={40} titulo="Balanceador global" sub="una sola entrada" clase="fig-primario" claseTexto="fig-primario-texto" />
        <Caja x={660} y={168} w={280} h={40} titulo="Usuarios de internet" clase="fig-primario" claseTexto="fig-primario-texto" />
        <Flecha d="M 660 188 L 624 188" clase="fig-flecha-primario" marcador={mp} />

        <rect x={60} y={222} width={560} height={300} rx={10} className="fig-contenedor" />
        <Rotulo x={76} y={244} anchor="start" clase="fig-texto fig-titulo">Red VPC global · firewall en el borde</Rotulo>
        <Flecha d="M 510 208 L 510 216 L 215 216 L 215 256" clase="fig-flecha-primario" marcador={mp} />
        <Flecha d="M 510 216 L 470 216 L 470 256" clase="fig-flecha-primario" marcador={mp} />
        <RegionMini x={76} y={256} nombre="Región A" sql={true} />
        <RegionMini x={350} y={256} nombre="Región B" sql={false} />
        <Rotulo x={340} y={508} clase="fig-sutil">la app corre en las seis zonas; si una falla, las demás siguen</Rotulo>

        <Caja x={60} y={540} w={200} h={44} titulo="Cloud Storage" sub="archivos y copias" />
        <Caja x={280} y={540} w={200} h={44} titulo="BigQuery" sub="análisis" />
        <Rotulo x={500} y={567} anchor="start" clase="fig-sutil">servicios del proyecto</Rotulo>

        {/* Proyecto de pruebas */}
        <rect x={660} y={240} width={280} height={120} rx={12} className="fig-contenedor" />
        <Rotulo x={676} y={262} anchor="start" clase="fig-texto fig-titulo">Proyecto sandbox-equipo</Rotulo>
        <Caja x={690} y={280} w={220} h={44} titulo="Máquina virtual" sub="pruebas; cuotas bajas" />
        <path d="M 715 114 L 715 124 L 647 124 L 647 300 L 660 300" className="fig-linea" />

        {/* Cuenta de facturación */}
        <Caja x={660} y={520} w={280} h={48} titulo="Cuenta de facturación" sub="paga los dos proyectos; no da permisos" clase="fig-dinero" claseTexto="fig-dinero-texto" />
        <Flecha d="M 800 520 L 800 364" clase="fig-flecha-dinero" marcador={md} />
        <Flecha d="M 660 544 L 638 544" clase="fig-flecha-dinero" marcador={md} />

        {/* Leyenda */}
        <rect x={60} y={622} width={18} height={18} rx={4} className="fig-caja" />
        <Rotulo x={86} y={636} anchor="start">recurso</Rotulo>
        <rect x={180} y={622} width={18} height={18} rx={4} className="fig-primario" />
        <Rotulo x={206} y={636} anchor="start">entrada de usuarios y permisos</Rotulo>
        <rect x={430} y={622} width={18} height={18} rx={4} className="fig-dinero" />
        <Rotulo x={456} y={636} anchor="start">dinero</Rotulo>
      </svg>
    </Figura>
  );
}
