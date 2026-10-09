/**
 * Configuración de Next.js.
 *
 * Responsabilidad: fijar el modo de exportación estática acordado en CLAUDE.md.
 * - output: 'export'        → `next build` genera la carpeta `out/` que sirve Firebase Hosting.
 * - trailingSlash: true     → cada ruta sale como `carpeta/index.html`, compatible con cleanUrls.
 * - images.unoptimized      → obligatorio sin servidor de imágenes.
 * - pageExtensions con mdx  → las secciones de content/ se escriben en MDX.
 */
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
