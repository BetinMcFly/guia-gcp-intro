/**
 * Configuración de Next.js.
 *
 * Responsabilidad: fijar el modo de exportación estática acordado en CLAUDE.md.
 * - output: 'export'        → `next build` genera la carpeta `out/` que sirve Firebase Hosting.
 * - trailingSlash: true     → cada ruta sale como `carpeta/index.html`, compatible con cleanUrls.
 * - images.unoptimized      → obligatorio sin servidor de imágenes.
 * - pageExtensions con mdx  → las secciones de content/ se escriben en MDX.
 * - remark-frontmatter + remark-mdx-frontmatter → el front matter YAML de cada
 *   sección se exporta como `frontmatter` desde el módulo MDX. Los plugins van
 *   por nombre (string) porque Turbopack no serializa funciones.
 */
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  options: {
    // remark-gfm: tablas y otras extensiones de GitHub Flavored Markdown.
    remarkPlugins: [["remark-frontmatter"], ["remark-mdx-frontmatter"], ["remark-gfm"]],
    // Da un id a cada encabezado para que el cuestionario enlace a la parte exacta.
    rehypePlugins: [["rehype-slug"]],
  },
});

export default withMDX(nextConfig);
