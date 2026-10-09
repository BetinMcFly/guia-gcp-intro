/**
 * Componentes que usa MDX al renderizar las secciones.
 *
 * Responsabilidad: mapear elementos de Markdown a los componentes de la guía.
 * Next lo exige con este nombre y en esta ubicación para el App Router.
 * Las tablas van dentro de un contenedor con desplazamiento horizontal para que
 * una tabla ancha no rompa la página en móvil.
 */
import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

function Tabla(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="tabla-scroll">
      <table {...props} />
    </div>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { table: Tabla, ...components };
}
