# CLAUDE.md — memoria del proyecto

Lee esto antes de tocar nada. Aquí están las decisiones de la entrevista inicial y las
reglas que **no** se pueden deducir del código. Estado: **CI operativo, diseño hecho, cuestionario implementado, sección 1 escrita y
publicada; faltan las secciones 2 a 7, la calculadora y el buscador**.

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
| Progreso del lector | **No se guarda** | Nada en localStorage, nada en servidor. Única excepción: la clave `tema` (claro/oscuro), que es una comodidad del lector y el pie lo dice |
| Acceso | Pública, sin autenticación | Lo más simple; Firebase Hosting no restringe acceso por sí solo |
| Precios | Tabla fija en USD con fecha de verificación | Google cambia precios; la fecha visible y el aviso evitan publicar cifras como si fueran actuales |
| Contenido | Claude redacta, contrastado con docs oficiales, el propietario aprueba | Tema que cambia a menudo; la verificación es obligatoria |
| Diseño | Cercano a Google Cloud (paleta de Google, Roboto, Material), con botón de tema claro/oscuro | Cambio pedido por el propietario el 2026-10-09 tras ver la primera versión, que era una identidad propia sobria. Sin logotipos ni marcas de Google; el pie declara que la guía es independiente |
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
├── src/mdx-components.tsx    # mapeo de elementos MDX (Next lo exige con este nombre)
├── src/tipos/mdx.d.ts        # lo que exporta cada módulo MDX: frontmatter y fuentes
├── src/components/           # Navegacion, TemaToggle, Cuestionario, Calculadora, Glosario, Buscador, Fuente
├── src/lib/                  # contenido.ts (única lectura de content/), precios.ts, indice-busqueda.ts
└── content/
    ├── README.md             # esquema de cada archivo de contenido y lista de secciones
    ├── secciones/*.mdx       # 7 secciones: introduccion, organizacion, computo, almacenamiento,
    │                         #   redes, facturacion, control-de-gasto. Front matter: titulo,
    │                         #   resumen, orden. Exportan `fuentes` (lista de {titulo, url})
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

**Cómo se verifican las fuentes (aprendido con la sección 1, 2026-10-09).** La
documentación vive en `docs.cloud.google.com` (las URL `cloud.google.com/docs/...`
redirigen con 301; enlaza la definitiva). Las páginas de marketing
(`cloud.google.com/pricing`, `/learn/...`) pesan más de 2 MB y WebFetch las devuelve
truncadas: descárgalas con `curl -A "Mozilla/5.0"`, quita etiquetas y busca las frases
clave. Toda afirmación de la sección 1 salió de seis páginas; están en su `fuentes`.

**Las cifras de promociones y descuentos tampoco van en prosa** (crédito de la
prueba gratuita, plazo, porcentaje máximo de descuento): cambian igual que los
precios. Se dice que existen y se enlaza.

**En los cuestionarios, la respuesta correcta no puede ser siempre la primera
opción.** Varía su posición a mano en el JSON; en la primera versión de la sección 1
lo era en las cinco preguntas y se delataba. Las anclas (`ancla`) apuntan al id que
`rehype-slug` genera del encabezado: minúsculas, sin puntuación, con acentos
(`#qué-es-físicamente-google-cloud`). Comprueba los ids en `out/` tras el build.

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

Línea visual **cercana a Google Cloud**, decidida por el propietario el 2026-10-09 y
implementada en `src/app/globals.css`. Antes hubo una identidad propia (Newsreader,
papel neutro, acento burdeos) que se descartó; no volver a ella.

**Qué se toma de Google y qué no.** Se toma la paleta (azul 600/700, grises
900/700/300, verde 800), Roboto autoalojada con `next/font` y el lenguaje de
Material: barra superior fija, riel con la entrada activa en píldora, tarjetas
delineadas de 8 px, botones en píldora, enlaces azules sin subrayar hasta el hover.
**No se usan logotipos ni marcas de Google.** La marca del sitio son cuatro puntos
de colores propios del CSS, no un logotipo, y el pie declara que la guía es
independiente y que Google Cloud es marca de Google LLC. Esa línea entre «parecerse
a» y «hacerse pasar por» no se cruza.

| Token | Claro | Oscuro | Significa |
|---|---|---|---|
| `--fondo` / `--superficie` | `#FFFFFF` / `#F8F9FA` | `#202124` / `#303134` | fondo y fondo de bloques |
| `--texto` / `--secundario` | `#202124` / `#5F6368` | `#E8EAED` / `#9AA0A6` | texto y texto secundario |
| `--borde` | `#DADCE0` | `#3C4043` | líneas de 1 px, nunca texto |
| `--primario` / `--primario-contenedor` | `#1967D2` / `#E8F0FE` | `#8AB4F8` / `#394457` | **lo interactivo**: enlaces, entrada activa, acierto del cuestionario |
| `--primario-boton` | `#1A73E8` | `#8AB4F8` | fondo de botones rellenos |
| `--dinero` / `--dinero-contenedor` | `#137333` / `#E6F4EA` | `#81C995` / `#1E3A2B` | **solo dinero**: avisos de precio, calculadora |

Contrastes medidos: todos los pares en uso ≥ 4.5:1. Dos que fallan y por eso no se
usan: texto secundario sobre `--primario-contenedor` en oscuro (3.7:1) y el verde 600
de Google (`#188038`) sobre su contenedor (4.4:1), por eso el texto de dinero es el
verde 800.

**Botón de tema** (`TemaToggle`): alterna `data-theme` en `<html>`, guarda la
elección en `localStorage` bajo la clave `tema` y un guion en línea en el `<head>` la
aplica antes del primer pintado para que no haya parpadeo. Sin elección guardada manda
`prefers-color-scheme`. Probado en navegador el 2026-10-09: cambio, recarga y vuelta.

**Estructura:** barra superior fija de 4 rem; en escritorio (≥ 56 rem), riel
izquierdo fijo con el índice y columna de lectura de 68 caracteres. En móvil, la barra
enlaza con «Índice» al índice que vive al pie, y cada sección termina con una tarjeta
hacia la siguiente. Sin JavaScript todo sigue funcionando salvo el botón de tema y el
cuestionario; `Navegacion` solo lo usa para marcar la entrada activa.

**El número de sección es información, no decoración:** las siete secciones se
leen en orden. No numerar nada que no sea una secuencia.

**Dos trampas ya caídas:** (1) en una cuadrícula con `::before` como primera
columna, cualquier hijo adicional cae en la columna 1 por colocación automática; por
eso `.lista-secciones li > *` fija `grid-column: 2`. (2) Con `min-height`, una página
corta reparte el hueco entre todas las filas de la cuadrícula; por eso `.pagina` fija
`grid-template-rows` con un único `1fr`.

Criterios fijos:

- Tipografía de lectura, mucho aire, pocos colores y cada uno con significado.
- Tema claro y oscuro con tokens en `:root`; ningún color escrito en línea salvo los
  cuatro puntos de la marca, que son decorativos y no llevan texto.
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
firebase hosting:channel:delete <canal> --site guia-gcp-albertosolano --force   # borrar uno a mano
```

Puesta en marcha (estado al 2026-10-09):

1. ✅ Sitio `guia-gcp-albertosolano` creado.
2. ✅ Dominio personalizado dado de alta por la API REST de Hosting (la CLI no tiene
   comando para ello; hace falta la cabecera `x-goog-user-project`). CNAME creado en
   Cloud DNS; propiedad verificada. El certificado lo emite Firebase solo.
3. ✅ Repositorio en GitHub con el secreto `FIREBASE_SERVICE_ACCOUNT` cargado.
4. ✅ Esqueleto de Next.js y `firebase.json` apuntando a `out/` y al sitio.
5. ✅ Primer despliegue manual hecho el 2026-10-09: 12 páginas vacías.
6. ✅ Workflows reales probados el 2026-10-09: push a `main` publicó y verificó. El
   PR #1 obtuvo su canal temporal pero el borrado falló (ver abajo); el PR #2 probó
   el ciclo completo ya corregido: canal creado, comentado y borrado al cerrar.

**Lección del borrado de canales:** `firebase hosting:channel:delete` **ignora el
`site` de `firebase.json`** y apunta al sitio por defecto del proyecto
(`claude-projects-496723`), que no es el nuestro: devuelve un 404 engañoso. Hay que
pasar `--site guia-gcp-albertosolano` siempre, en CI y a mano. Además, el shell de
Actions corre con `-e`: un comando que falla aborta el script antes de imprimir su
salida, así que captura el código con `|| CODIGO=$?` si quieres leer el motivo.

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
