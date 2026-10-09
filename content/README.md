# content/ — todo el contenido de la guía

Aquí vive lo que lee el directivo. El código de `src/` solo lo presenta.

## secciones/*.mdx

Una sección por archivo, en el orden de lectura definido en `src/lib/contenido.ts`.
Cada MDX lleva front matter con `titulo`, `resumen` (una frase) y `orden`, y termina
con el bloque de fuentes oficiales. Ninguna cifra de precio en prosa: se lee de
`precios.json`.

| Slug | Qué cubre |
|---|---|
| `introduccion` | Qué es la nube, qué es Google Cloud y por qué le importa a quien decide |
| `organizacion` | Jerarquía de recursos (organización, carpetas, proyectos) e IAM: quién puede hacer qué |
| `computo` | Opciones de cómputo (máquinas virtuales, contenedores, sin servidor) y qué se paga en cada una |
| `almacenamiento` | Almacenamiento de objetos, discos y bases de datos administradas |
| `redes` | Regiones y zonas, conectividad, y por qué el tráfico de salida cuesta |
| `facturacion` | Modelo de facturación: cuentas, proyectos, SKUs, descuentos, nivel gratuito |
| `control-de-gasto` | FinOps básico: leer la factura, presupuestos, alertas y preguntas para el equipo técnico |

## cuestionarios/<slug>.json

Un archivo por sección, mismo slug. Arreglo de preguntas:

```json
[
  {
    "id": "organizacion-01",
    "pregunta": "…",
    "opciones": ["…", "…", "…", "…"],
    "correcta": 0,
    "explicacion": "…",
    "ancla": "#proyectos"
  }
]
```

## glosario.json

Arreglo de términos: `termino`, `definicion` (una o dos frases para no técnicos),
`fuente` (URL oficial), `alias` opcional.

## precios.json

Único lugar con cifras. `fecha_verificacion` (AAAA-MM-DD), `region`, `moneda` y
`items`, cada uno con `id`, `concepto`, `usd`, `unidad`, `url` de la página oficial de
precios. La calculadora muestra la fecha y el aviso de estimación orientativa.
