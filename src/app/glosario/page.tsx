/**
 * Glosario (ruta /glosario/).
 *
 * Responsabilidad: listar todos los términos de content/glosario.json en orden
 * alfabético, cada uno con su definición breve y su fuente oficial, con el buscador
 * en cabecera. El índice de búsqueda se construye en build y viaja en la página. Es el destino de los enlaces a términos desde las secciones.
 */
import type { Metadata } from "next";
import Buscador from "@/components/Buscador";
import Glosario from "@/components/Glosario";
import { listarGlosario } from "@/lib/contenido";
import { construirIndice } from "@/lib/indice-busqueda";

export const metadata: Metadata = {
  title: "Glosario",
  description: "Cada término técnico que usa la guía, definido en una o dos frases.",
};

export default function PaginaGlosario() {
  const terminos = listarGlosario();
  const indice = construirIndice();
  return (
    <article className="seccion">
      <header className="seccion-cabecera">
        <h1 className="titular">Glosario</h1>
        <p className="entrada">
          Cada término técnico que usa la guía, definido en una o dos frases y con su fuente
          oficial. Si una palabra de una reunión no está aquí, falta en la guía.
        </p>
      </header>
      <Buscador indice={indice} />
      <Glosario terminos={terminos} />
    </article>
  );
}
