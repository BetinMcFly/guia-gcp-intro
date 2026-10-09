/**
 * Layout raíz.
 *
 * Responsabilidad: envolver todas las páginas con el <html lang="es">, los metadatos
 * comunes (título, descripción, URL canónica), la hoja de estilos global y la
 * navegación entre secciones. No contiene contenido de la guía.
 */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guía de Google Cloud para directivos",
  description:
    "Conceptos y costos de Google Cloud explicados para quien toma decisiones, no para quien administra.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // PENDIENTE: navegación y estructura de página.
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
