# CLAUDE.md — memoria del proyecto

Lee esto antes de tocar nada. Aquí están las decisiones de la entrevista inicial y las
reglas que **no** se pueden deducir del código. Estado: **decisiones cerradas, estructura creada, CI operativo, sin lógica ni
contenido todavía**.

## Qué es este proyecto

Una guía de estudio de Google Cloud Platform para **directivos no técnicos**, en
español, publicada en https://guia-gcp.albertosolano.dev

Su lector no va a administrar nada: necesita entender los conceptos para seguir una
conversación con su equipo técnico y entender **de dónde sale el costo** para tomar
decisiones de presupuesto. Cada sección se escribe con esa persona en mente. Si una
explicación exige saber qué es una subred o un contenedor para entenderse, está mal
escrita para esta audiencia.

## Decisiones de la entrevista (cerradas)

| Decisión | Elección | Por qué |
|---|---|---|
| Audiencia | Directivos no técnicos | Conceptos y costos, no operación ni certificación |
| Alcance | Fundamentos + costos | Jerarquía de recursos, IAM, cómputo, almacenamiento, redes, modelo de facturación, FinOps básico, cómo leer una factura y controlar el gasto. Sin comparativas con AWS/Azure |
| Hosting | Firebase Hosting, sitio `guia-gcp-albertosolano` | Consistente con los tres subdominios que ya existen; CDN y HTTPS sin costo |
| Proyecto GCP | `claude-projects-496723` | Es donde vive la zona DNS; evita cruzar proyectos |
| Stack | Next.js + React + TypeScript | Elegido por el propietario para la interactividad |
| Modo Next.js | **Exportación estática** (`output: 'export'`) | Sale una carpeta `out/` que Hosting sirve desde CDN. Sin servidor, sin rutas API, sin SSR |
| Interactividad | Cuestionarios, calculadora de costos, glosario con búsqueda, fuentes oficiales | Todo corre en el navegador |
| Progreso del lector | **No se guarda** | Nada en localStorage, nada en servidor |
| Acceso | Pública, sin autenticación | Lo más simple; Firebase Hosting no restringe acceso por sí solo |
| Precios | Tabla fija en USD con fecha de verificación | Google cambia precios; la fecha visible y el aviso evitan publicar cifras como si fueran actuales |
| Contenido | Claude redacta, contrastado con docs oficiales, el propietario aprueba | Tema que cambia a menudo; la verificación es obligatoria |
| Diseño | Propio, sobrio, ejecutivo, claro/oscuro, móvil primero | No hereda la estética de claude-code-guide |
| Cuestionarios | Retroalimentación inmediata, sin persistir | Al recargar se reinician; nada se envía |
| Despliegue | GitHub Actions, mismo patrón que claude-code-guide | Push a `main` publica; cada PR obtiene una URL temporal |

Confirmado por el propietario el 2026-10-09, además de la tabla:

- Sin analítica ni rastreo de ningún tipo.
- Repositorio GitHub: `BetinMcFly/guia-gcp-intro`.
- Precios de lista de `us-central1` como región de referencia.

## Infraestructura

| | |
|---|---|
| Proyecto GCP / Firebase | `claude-projects-496723` (número 857913674434) |
| Zona de Cloud DNS | `albertosolano-dev` (`albertosolano.dev.`), en el mismo proyecto |
| Subdominio | `guia-gcp.albertosolano.dev` |
| Sitio de Firebase Hosting | `guia-gcp-albertosolano` → `https://guia-gcp-albertosolano.web.app` (creado 2026-10-09) |
| Registro DNS | CNAME `guia-gcp.albertosolano.dev.` → `guia-gcp-albertosolano.web.app.` (TTL 300, creado 2026-10-09). Firebase verificó la propiedad solo con el CNAME; no pidió TXT `_acme-challenge` |
| Certificado | Gestionado por Firebase, renovación automática |
| Despliegue desde CI | Service account `github-actions-deploy@claude-projects-496723.iam.gserviceaccount.com` (con `firebasehosting.admin` y `firebase.viewer`). Clave propia de este repositorio, id `684c9069…`, creada 2026-10-09 y cargada solo como secreto `FIREBASE_SERVICE_ACCOUNT` en GitHub; el archivo local se destruyó al momento. La clave `0794fa44…` es la de claude-code-guide |
| Repositorio | https://github.com/BetinMcFly/guia-gcp-intro (público), rama `main`, remoto `origin` por SSH |
| Herramientas locales | Node 24, npm 11, Firebase CLI 15.26 en `~/.local/bin`, gcloud autenticado como el propietario |

Los sitios hermanos siguen el mismo patrón y sirven de referencia: `pca-albertosolano`
y `venta-ia-albertosolano` (CNAME a `<sitio>.web.app`), y `claude-code-guide` para
los workflows de CI.

## Estructura (creada el 2026-10-09; archivos con cabecera y sin lógica)

```
guia-gcp-intro/
├── CLAUDE.md
├── package.json              # next, react, typescript
├── next.config.ts            # output: 'export', trailingSlash: true, images.unoptimized: true
├── firebase.json             # hosting.site = guia-gcp-albertosolano, public = out, cleanUrls
├── .firebaserc               # default = claude-projects-496723
├── .github/workflows/
│   ├── publicar.yml          # push a main → build → deploy live → verificar
│   └── previsualizar.yml     # PR → build → canal temporal 7d; al cerrar, borrar canal
├── src/app/                  # App Router: layout, portada, [seccion]/, glosario/, calculadora/, not-found
├── src/components/           # Navegacion, Cuestionario, Calculadora, Glosario, Buscador, Fuente
├── src/lib/                  # contenido.ts (única lectura de content/), precios.ts, indice-busqueda.ts
└── content/
    ├── README.md             # esquema de cada archivo de contenido y lista de secciones
    ├── secciones/*.mdx       # 7 secciones: introduccion, organizacion, computo, almacenamiento,
    │                         #   redes, facturacion, control-de-gasto; fuentes al pie
    ├── cuestionarios/*.json  # preguntas, opción correcta, explicación, enlace a sección
    ├── glosario.json         # término, definición breve, fuente oficial
    └── precios.json          # precios de lista USD + fecha_verificacion + url de origen
```

`trailingSlash: true` hace que cada ruta salga como `carpeta/index.html`, que es lo
que Firebase Hosting resuelve bien con `cleanUrls`. `images.unoptimized` es
obligatorio con exportación estática.

## Reglas de contenido

**Contrasta cada afirmación contra https://cloud.google.com/docs antes de escribirla,
nunca de memoria.** Cada sección termina con un bloque «Fuentes oficiales» con los
enlaces concretos que respaldan lo dicho. Una afirmación sin fuente no se publica.

**Los precios viven solo en `content/precios.json`.** Cada entrada lleva `usd`,
`unidad`, `region`, `url` de la página oficial de precios y `fecha_verificacion`.
La calculadora muestra esa fecha y un aviso de «estimación orientativa, precios de
lista, sin descuentos» con enlace a https://cloud.google.com/products/calculator.
Ninguna cifra de precio se escribe en prosa dentro de las secciones: siempre se
lee del archivo, para que actualizar un precio sea cambiar un número en un sitio.

**Los cuestionarios no guardan nada.** Sin localStorage, sin cookies, sin envío.
Cada respuesta muestra si es correcta, por qué, y enlaza a la sección que lo explica.

**El glosario y la búsqueda se resuelven en el navegador** con un índice generado en
build. Sin servicios externos de búsqueda.

**Escribe para quien no es técnico.** Antes de usar un término técnico por primera
vez, defínelo en una frase o enlázalo al glosario. Las analogías valen si son exactas;
una analogía que simplifica hasta ser falsa es peor que la definición seca.

## Reglas de redacción (heredadas de claude-code-guide, siguen vigentes)

- **Nombra el sujeto en cada frase.** Nada de «le» sin antecedente.
- **Nada de verbos calcados del inglés** (*deployar*, *escalar* vale, *autoscalear* no).
  Los sustantivos prestados que un equipo usa de verdad sí: bucket, región, instancia.
- **Una idea, una vez.** No repitas el mismo contraste en dos secciones.
- **Retocar la redacción no es revisar lo que afirma.** Si tocas una frase que hace
  una afirmación sobre GCP, contrástala aunque la toques por estilo.
- **Una verificación caduca.** Los precios y los límites gratuitos cambian; si una
  cifra lleva meses escrita, vuelve a comprobarla antes de apoyarte en ella.

## Diseño

Identidad propia, no la del sitio hermano. Criterios fijos:

- Tipografía de lectura, mucho aire, pocos colores y cada uno con significado.
- Tema claro y oscuro con tokens en `:root`; ningún color escrito en línea.
- Móvil primero: todo ítem de grid o flex con contenido que no encoge lleva
  `min-width: 0`; nada desborda a 320px.
- Contraste mínimo 4.5:1 en todo texto, medido, no estimado.
- La página debe leerse completa con JavaScript desactivado: la exportación estática
  lo garantiza para el texto; cuestionarios y calculadora son extras, no requisitos.

## Despliegue

**Basta con hacer push a `main`**: GitHub Actions comprueba tipos, construye,
despliega y verifica. Probado de extremo a extremo el 2026-10-09.

- **`publicar.yml`** — push a `main`: `npm ci`, `npm run typecheck`, `npm run build`,
  despliegue a `live`, y comparación byte a byte de `https://guia-gcp.albertosolano.dev`
  contra `out/index.html`, reintentando mientras propaga el CDN (`Cache-Control` 300 s).
- **`previsualizar.yml`** — cada PR construye y publica un canal temporal de 7 días
  cuya URL se comenta en el PR; al cerrarlo se borra el canal. PRs desde un fork
  solo construyen.

Ambos filtran por rutas: tocar solo `CLAUDE.md` o `README.md` no dispara nada.

**La acción de Firebase está fijada a un SHA de commit** (`v0.11.0`), no a la
etiqueta `v0`: recibe la clave de la service account y una etiqueta mutable es un
vector de cadena de suministro. Al actualizarla, cambia el SHA y el comentario de
versión juntos.

Despliegue manual, útil para probar sin commit:

```bash
npm run build && npm run deploy      # a producción
npm run build && npm run preview     # a un canal temporal de 7 días
```

Puesta en marcha (estado al 2026-10-09):

1. ✅ Sitio `guia-gcp-albertosolano` creado.
2. ✅ Dominio personalizado dado de alta por la API REST de Hosting (la CLI no tiene
   comando para ello; hace falta la cabecera `x-goog-user-project`). CNAME creado en
   Cloud DNS; propiedad verificada. El certificado lo emite Firebase solo.
3. ✅ Repositorio en GitHub con el secreto `FIREBASE_SERVICE_ACCOUNT` cargado.
4. ✅ Esqueleto de Next.js y `firebase.json` apuntando a `out/` y al sitio.
5. ✅ Primer despliegue manual hecho el 2026-10-09: 12 páginas vacías.
6. ✅ Workflows reales probados el 2026-10-09: push a `main` publicó y verificó; el
   PR #1 obtuvo su canal temporal y se borró al cerrarlo.

**Lección del primer build:** con `output: 'export'`, `generateStaticParams` de
`[seccion]` no puede devolver un arreglo vacío. Por eso `SECCIONES` existe como
constante en `src/lib/contenido.ts` desde el esqueleto. Next también reescribe
`tsconfig.json` en cada build (`jsx: react-jsx`, rutas de tipos); no pelear con eso.

`firebase hosting:rollback` **no existe** en el CLI 15.26. Marcha atrás: consola de
Firebase (historial de versiones), `firebase hosting:clone`, o revertir en git.

## Comprobar el resultado visualmente

Existe el mismo entorno de capturas que usa el hermano:

```bash
source ~/.local/share/capturas/entorno.sh
node ~/.local/share/capturas/capturar.js <url> <carpeta-salida>
```

Captura a 320, 360, 390, 820 y 1280 px en claro y oscuro y reporta desbordamiento
horizontal. Espera a `document.fonts.ready` antes de medir.

## Casos borde a tener presentes

- **Precios desactualizados** es el riesgo principal; por eso la fecha es visible y
  los precios viven en un solo archivo.
- **Nivel gratuito (free tier) y descuentos** cambian y varían por región: se
  mencionan como existentes, con enlace, sin cifras en prosa.
- **Moneda:** solo USD. Si un directivo necesita su moneda local, la guía lo dice
  explícitamente y enlaza a la calculadora oficial.
- **Lector sin JavaScript:** el texto se lee entero; los componentes interactivos
  muestran un aviso corto en vez de una zona vacía.
- **Cache del CDN:** un cambio tarda hasta 5 minutos en verse; no es un fallo.
- **404:** Next.js genera `out/404.html`; Firebase lo sirve automáticamente.
