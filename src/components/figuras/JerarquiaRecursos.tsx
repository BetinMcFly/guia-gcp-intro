/**
 * Figura: jerarquía de recursos y herencia de permisos (sección 2).
 *
 * Responsabilidad: mostrar organización → carpetas → proyectos → recursos, una
 * política concedida en una carpeta que cubre todo lo que cuelga de ella, y la
 * cuenta de facturación fuera de la jerarquía, que paga pero no da permisos.
 * El <desc> enumera lo mismo que dibuja el SVG: si cambia uno, cambia el otro.
 */
import Figura from "@/components/Figura";
import { Caja, Flecha, Marcador, Rotulo } from "./primitivas";

export default function JerarquiaRecursos() {
  const m = "jerarquia-punta";
  const md = "jerarquia-punta-dinero";
  return (
    <Figura pie="La jerarquía de recursos. El rol concedido en la carpeta Producción (zona sombreada) se hereda por sus dos proyectos y todos sus recursos. La cuenta de facturación está fuera del árbol: paga los proyectos, pero no concede permisos.">
      <svg viewBox="0 0 960 400" role="img" aria-labelledby="jerarquia-t jerarquia-d">
        <title id="jerarquia-t">Jerarquía de recursos de Google Cloud y herencia de permisos</title>
        <desc id="jerarquia-d">
          Árbol con la organización arriba; debajo, dos carpetas, Producción y Pruebas; bajo
          Producción, los proyectos app-produccion y datos-produccion; bajo Pruebas, app-pruebas y
          sandbox-equipo. Bajo app-produccion, tres recursos: Cloud Run, Cloud SQL y Cloud Storage.
          Una zona sombreada cubre la carpeta Producción y todo lo que cuelga de ella, con el rótulo
          «rol concedido aquí: se hereda hacia abajo». A la derecha, fuera del árbol, la cuenta de
          facturación, unida a los cuatro proyectos con líneas discontinuas rotuladas «paga, no da
          permisos».
        </desc>
        <defs>
          <Marcador id={m} />
          <Marcador id={md} clase="fig-flecha-dinero-punta" />
        </defs>

        {/* Zona de herencia: la carpeta Producción y todo lo que cuelga */}
        <rect x={40} y={96} width={470} height={290} rx={12} className="fig-herencia" />
        <Rotulo x={56} y={376} anchor="start" clase="fig-primario-texto fig-sutil">
          Rol concedido en la carpeta Producción: se hereda hacia abajo
        </Rotulo>

        {/* Organización */}
        <Caja x={320} y={16} w={220} h={44} titulo="Organización" sub="la empresa" />

        {/* Carpetas */}
        <Caja x={160} y={110} w={200} h={44} titulo="Carpeta Producción" clase="fig-primario" claseTexto="fig-primario-texto" />
        <Caja x={560} y={110} w={200} h={44} titulo="Carpeta Pruebas" />
        <path d="M 430 60 L 430 84 L 260 84 L 260 110" className="fig-linea" />
        <path d="M 430 84 L 660 84 L 660 110" className="fig-linea" />

        {/* Proyectos */}
        <Caja x={60} y={200} w={190} h={44} titulo="app-produccion" sub="proyecto" />
        <Caja x={270} y={200} w={190} h={44} titulo="datos-produccion" sub="proyecto" />
        <Caja x={560} y={200} w={190} h={44} titulo="app-pruebas" sub="proyecto" />
        <Caja x={770} y={200} w={170} h={44} titulo="sandbox-equipo" sub="proyecto" />
        <path d="M 260 154 L 260 176 L 155 176 L 155 200" className="fig-linea" />
        <path d="M 260 176 L 365 176 L 365 200" className="fig-linea" />
        <path d="M 660 154 L 660 176 L 655 176 L 655 200" className="fig-linea" />
        <path d="M 660 176 L 855 176 L 855 200" className="fig-linea" />

        {/* Recursos bajo app-produccion */}
        <Caja x={40} y={290} w={100} h={40} titulo="Cloud Run" clase="fig-zona" />
        <Caja x={150} y={290} w={100} h={40} titulo="Cloud SQL" clase="fig-zona" />
        <Caja x={260} y={290} w={120} h={40} titulo="Cloud Storage" clase="fig-zona" />
        <path d="M 155 244 L 155 268 L 90 268 L 90 290" className="fig-linea" />
        <path d="M 155 268 L 200 268 L 200 290" className="fig-linea" />
        <path d="M 200 268 L 320 268 L 320 290" className="fig-linea" />
        <Rotulo x={210} y={352}>recursos: lo que de verdad cuesta</Rotulo>

        {/* Herencia: flecha descendente */}
        <Flecha d="M 24 110 L 24 330" clase="fig-flecha-primario" marcador={m} />

        {/* Cuenta de facturación, fuera del árbol */}
        <Caja x={700} y={300} w={240} h={48} titulo="Cuenta de facturación" sub="quién paga" clase="fig-dinero" claseTexto="fig-dinero-texto" />
        <Flecha d="M 820 300 L 820 246" clase="fig-flecha-dinero" marcador={md} />
        <Flecha d="M 790 300 L 660 246" clase="fig-flecha-dinero" marcador={md} />
        <Flecha d="M 720 300 L 380 246" clase="fig-flecha-dinero" marcador={md} />
        <Flecha d="M 710 310 L 175 248" clase="fig-flecha-dinero" marcador={md} />
        <Rotulo x={820} y={372} clase="fig-dinero-texto fig-sutil">paga los proyectos; no da permisos</Rotulo>
      </svg>
    </Figura>
  );
}
