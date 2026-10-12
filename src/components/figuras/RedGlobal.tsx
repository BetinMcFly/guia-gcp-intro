/**
 * Figura: regiones, zonas y red global (sección 5).
 *
 * Responsabilidad: mostrar una red VPC global que abarca dos regiones, cada una con
 * su subred y tres zonas, el firewall como borde, un balanceador global con una sola
 * entrada para los usuarios, la conexión con la oficina, y qué tráfico se cobra.
 * El <desc> enumera lo mismo que dibuja el SVG: si cambia uno, cambia el otro.
 */
import Figura from "@/components/Figura";
import { Caja, Flecha, Marcador, Rotulo } from "./primitivas";

function Region({ x, nombre, sql }: { x: number; nombre: string; sql: boolean }) {
  const zonas = ["a", "b", "c"];
  return (
    <g>
      <rect x={x} y={150} width={380} height={300} rx={10} className="fig-caja" />
      <Rotulo x={x + 16} y={176} anchor="start" clase="fig-texto fig-titulo">{nombre}</Rotulo>
      <rect x={x + 16} y={190} width={348} height={26} rx={6} className="fig-zona" />
      <Rotulo x={x + 190} y={208}>subred regional: direcciones internas de esta región</Rotulo>
      {zonas.map((z, i) => {
        const zx = x + 16 + i * 116;
        return (
          <g key={z}>
            <rect x={zx} y={230} width={108} height={200} rx={8} className="fig-zona" />
            <Rotulo x={zx + 54} y={252} clase="fig-texto fig-titulo">{`Zona ${z}`}</Rotulo>
            <Caja x={zx + 8} y={268} w={92} h={40} titulo="App" sub="Cloud Run o GKE" clase="fig-caja" />
            {sql && i === 0 && <Caja x={zx + 8} y={322} w={92} h={40} titulo="Cloud SQL" sub="principal" clase="fig-caja" />}
            {sql && i === 1 && <Caja x={zx + 8} y={322} w={92} h={40} titulo="Cloud SQL" sub="en espera" clase="fig-caja" />}
            {i === 2 && (
              <Rotulo x={zx + 54} y={345} clase="fig-sutil">{"un dominio de fallo"}</Rotulo>
            )}
          </g>
        );
      })}
    </g>
  );
}

export default function RedGlobal() {
  const m = "red-punta";
  const mp = "red-punta-primario";
  return (
    <Figura pie="Una red VPC global con subredes en dos regiones. Cada región tiene tres zonas; la aplicación corre en todas y Cloud SQL tiene una copia en espera en otra zona. El balanceador global es la única puerta para los usuarios. Lo que entra no se cobra; lo que se mueve entre zonas, entre regiones o hacia internet, sí.">
      <svg viewBox="0 0 960 560" role="img" aria-labelledby="red-t red-d">
        <title id="red-t">Regiones, zonas y red global en Google Cloud</title>
        <desc id="red-d">
          Un recuadro discontinuo rotulado «Red VPC global de la empresa, con firewall en el borde»
          contiene dos regiones, A y B. Cada región tiene una subred regional y tres zonas, a, b y
          c; en cada zona corre una copia de la aplicación en Cloud Run o GKE, y en la región A la
          zona a tiene Cloud SQL principal y la zona b, Cloud SQL en espera. Encima del recuadro,
          los usuarios de internet llegan a un balanceador global con una sola dirección, que reparte
          a las dos regiones; a la derecha, la oficina se conecta por Cloud VPN o Cloud Interconnect.
          Rótulos de tráfico: la entrada no se cobra; entre zonas se cobra; entre regiones se cobra
          más; la salida a internet se cobra.
        </desc>
        <defs>
          <Marcador id={m} />
          <Marcador id={mp} clase="fig-flecha-primario-punta" />
        </defs>

        {/* Usuarios → balanceador */}
        <Caja x={20} y={20} w={200} h={48} titulo="Usuarios de internet" clase="fig-primario" claseTexto="fig-primario-texto" />
        <Caja x={360} y={20} w={240} h={48} titulo="Balanceador global" sub="una sola dirección de entrada" clase="fig-primario" claseTexto="fig-primario-texto" />
        <Flecha d="M 220 44 L 356 44" clase="fig-flecha-primario" marcador={mp} />
        <Rotulo x={288} y={36} clase="fig-sutil">entrada: no se cobra</Rotulo>

        {/* Oficina */}
        <Caja x={740} y={20} w={200} h={48} titulo="Oficina o centro de datos" sub="Cloud VPN o Interconnect" />
        <Flecha d="M 840 68 L 840 110" marcador={m} />

        {/* VPC global */}
        <rect x={20} y={110} width={920} height={400} rx={12} className="fig-contenedor" />
        <Rotulo x={36} y={134} anchor="start" clase="fig-texto fig-titulo">Red VPC global de la empresa · firewall en el borde: reglas de qué entra</Rotulo>

        {/* Balanceador → regiones */}
        <Flecha d="M 480 68 L 480 90 L 230 90 L 230 146" clase="fig-flecha-primario" marcador={mp} />
        <Flecha d="M 480 90 L 730 90 L 730 146" clase="fig-flecha-primario" marcador={mp} />

        <Region x={40} nombre="Región A" sql={true} />
        <Region x={540} nombre="Región B" sql={false} />

        {/* Tráfico entre regiones */}
        <Flecha d="M 420 300 L 536 300" marcador={m} />
        <Rotulo x={480} y={290} clase="fig-sutil">entre regiones:</Rotulo>
        <Rotulo x={480} y={318} clase="fig-sutil">se cobra más</Rotulo>

        {/* Tráfico entre zonas */}
        <Rotulo x={230} y={470} clase="fig-sutil">misma zona: no se cobra · entre zonas: se cobra</Rotulo>
        <Rotulo x={730} y={470} clase="fig-sutil">cada zona es un dominio de fallo independiente</Rotulo>

        {/* Salida a internet */}
        <Flecha d="M 480 510 L 480 536" marcador={m} />
        <Rotulo x={480} y={552} clase="fig-dinero-texto fig-sutil">salida a internet: se cobra, según volumen y nivel de red</Rotulo>
      </svg>
    </Figura>
  );
}
