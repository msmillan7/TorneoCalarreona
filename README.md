# Torneo Calarreona 2026

Web estática para publicar en GitHub Pages.

## Qué incluye

- Página principal del torneo.
- Formulario de inscripción por pareja.
- Instrucciones de pago por Bizum.
- Mensaje de confirmación tras enviar.
- Diseño responsive para móvil y ordenador.

## Cómo publicarla en GitHub Pages

1. Crea un repositorio en GitHub, por ejemplo: `torneo-calarreona-2026`.
2. Sube estos archivos:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
3. En GitHub, entra en:
   - Settings
   - Pages
   - Branch: `main`
   - Folder: `/root`
4. Guarda.
5. GitHub generará una URL parecida a:
   `https://tuusuario.github.io/torneo-calarreona-2026/`

## Antes de publicar

Edita en `index.html`:

- Fecha del torneo.
- Número de Bizum: busca `XXX XXX XXX`.
- Categorías.
- Lugar o texto descriptivo.
- Nombre de la organización.

## Cómo hacer que el formulario guarde inscripciones

Ahora mismo el formulario está preparado para Formspree.

### Opción rápida: Formspree

1. Entra en https://formspree.io/
2. Crea un formulario nuevo.
3. Copia el endpoint, parecido a:
   `https://formspree.io/f/abcdwxyz`
4. En `index.html`, cambia:

   `https://formspree.io/f/YOUR_FORM_ID`

   por tu endpoint real.

Con esto recibirás las inscripciones por email. Después puedes exportarlas o conectarlas a Google Sheets.

### Opción Google Forms

También se puede usar Google Forms y embeberlo en la página. Es menos bonito, pero guarda directamente en Google Sheets.

## Flujo recomendado

1. La pareja rellena el formulario.
2. Hace Bizum.
3. Tú revisas el Bizum.
4. Marcas la pareja como pagada/aceptada en tu hoja interna.
