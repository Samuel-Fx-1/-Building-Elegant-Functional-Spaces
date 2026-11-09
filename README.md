# Alex Smith — Architect Portfolio

A self-contained Node.js + Express implementation of the Alex Smith architecture portfolio template. All fonts and images are hosted locally.

## Run Locally

```bash
npm install
npm start
```

Open **http://localhost:3000**.

For development with automatic restarts:

```bash
npm run dev
```

## Dark Mode

Use the sun/moon button in the header on any page.

- Defaults to the operating system color scheme.
- Remembers an explicit choice in `localStorage`.
- Applies before CSS loads to avoid a flash of the wrong theme.
- Updates `aria-pressed`, the button label, and the browser `theme-color`.
- Covers every page, including cards, forms, articles, and the footer.

## Main Routes

- `/`
- `/about`
- `/services`
- `/projects`
- `/projects/:slug`
- `/blog`
- `/blog/:slug`
- `/contact`
- `/does-not-exist` (404 demo)

## Project Structure

- `server.js` — Express app, routes, contact validation, newsletter endpoint.
- `views/` — EJS pages and partials.
- `data/content.js` — portfolio content and page data.
- `public/css/style.css` — layout, responsive styles, and dark theme.
- `public/js/main.js` — navigation, reveal animations, newsletter, and theme toggle.
- `public/images/`, `public/fonts/` — local assets.

## QA Scripts

With the server running:

```bash
node scripts/verify.js
node scripts/test-theme.js
node scripts/capture-clone-sections.js
```

Screenshots and reports are written to `data/clone/` and `data/theme/`.
