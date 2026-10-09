/**
 * Layout raíz.
 *
 * Responsabilidad: envolver todas las páginas con el <html lang="es">, los metadatos
 * comunes, la fuente autoalojada (sin peticiones a Google en tiempo de lectura), la
 * hoja de estilos global, la barra superior con el botón de tema, el índice y el pie.
 * No contiene contenido de la guía.
 */
import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import Link from "next/link";
import Navegacion from "@/components/Navegacion";
import TemaToggle from "@/components/TemaToggle";
import { fechaVerificacionPrecios, listarSecciones } from "@/lib/contenido";
import "./globals.css";

const texto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--fuente-texto",
  display: "swap",
});

const URL_SITIO = process.env.NEXT_PUBLIC_SITE_URL ?? "https://guia-gcp.albertosolano.dev";

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITIO),
  title: {
    default: "Google Cloud para directivos",
    template: "%s · Google Cloud para directivos",
  },
  description:
    "Conceptos y costos de Google Cloud explicados para quien aprueba el presupuesto, no para quien administra.",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

/* Aplica el tema guardado antes del primer pintado. Va en línea y sin dependencias
   para que no haya parpadeo. Si no hay nada guardado, manda prefers-color-scheme. */
const guionTema = `try{var t=localStorage.getItem("tema");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const secciones = await listarSecciones();
  const fecha = fechaVerificacionPrecios();
  return (
    <html lang="es" className={texto.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: guionTema }} />
      </head>
      <body>
        <a className="saltar" href="#contenido">
          Ir al contenido
        </a>
        <header className="cabecera">
          <Link href="/" className="marca">
            <span className="marca-puntos" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="marca-texto">Google Cloud para directivos</span>
          </Link>
          <div className="cabecera-acciones">
            <a href="#indice" className="ir-indice">
              Índice
            </a>
            <TemaToggle />
          </div>
        </header>
        <div className="pagina">
          <main id="contenido" className="contenido">
            {children}
          </main>
          <aside className="riel">
            <Navegacion secciones={secciones} />
          </aside>
          <footer className="pie">
            <p>
              Guía independiente: no está afiliada a Google ni cuenta con su respaldo. Google Cloud
              es una marca de Google LLC.
            </p>
            <p>
              Precios en dólares de lista,{" "}
              {fecha ? `verificados el ${fecha}` : "pendientes de verificación"}. Sin cookies ni
              rastreo; el tema elegido se recuerda en este navegador.
            </p>
            <p>
              <a href="https://github.com/BetinMcFly/guia-gcp-intro">Código y contenido en GitHub</a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
