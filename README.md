# Module 3 — Web Foundations (RevoShop)

Coursework for Module 3 by **Aldi Dwi Seprianto**. It builds up the same
auto-parts store, **RevoShop**, three times — each exercise adding a new layer
of the front-end stack: static markup, then interactive JavaScript, then a typed
and tooled TypeScript + Tailwind build.

All three exercises share the same product data (BMW parts, wheels, engine,
interior, accessories) and the images in `module-3-cp-1/image/`.

## Repository layout

```
modul-3-aldidws/
└─ module-3-cp-1/
   ├─ html-css/            # Exercise 1 — static profile page (HTML + CSS)
   │  ├─ index.html
   │  └─ style.css
   ├─ javascript/          # Exercise 2 — interactive catalog (vanilla JS)
   │  ├─ index.html
   │  ├─ array.js          # array methods: map/filter/reduce/forEach + analytics
   │  └─ dom.js            # DOM rendering, search, sort, cart state
   ├─ typescript-tailwind/ # Exercise 3 — typed catalog (TypeScript + Tailwind)
   │  └─ src/{types,products,main}.ts
   └─ image/               # shared product + profile images
```

## Exercises

### 1. HTML + CSS — `module-3-cp-1/html-css`
A static personal profile page for the developer, styled with hand-written CSS.
Focuses on semantic HTML, layout, and styling fundamentals.

Open `html-css/index.html` in any browser.

### 2. JavaScript — `module-3-cp-1/javascript`
An interactive product catalog built with vanilla JavaScript, no build step.

- `array.js` — a product dataset plus array-method exercises (`map`, `filter`,
  `reduce`, `forEach`): inventory value, per-category counts, top-rated product,
  average in-stock engine price, and cart totals with tax and shipping.
- `dom.js` — renders product cards and wires up live search, sorting
  (price / rating), category filters, and an add-to-cart flow with running totals.

Open `javascript/index.html` in a browser. Use a local server if your browser
blocks local scripts:

```bash
npx serve module-3-cp-1/javascript
# or
python -m http.server
```

### 3. TypeScript + Tailwind — `module-3-cp-1/typescript-tailwind`
The same catalog re-implemented with types and a real build pipeline. It
demonstrates interfaces (`Product`, `CartItem`, `CatalogState`), type aliases
(`Rupiah`, `Rating`, `CartTotals`), and string-literal union types (`Category`,
`SortMode`, `CategoryFilter`), all styled with Tailwind CSS.

```bash
cd module-3-cp-1/typescript-tailwind
npm install     # typescript + tailwindcss
npm run build   # compiles TS -> dist/*.js and CSS -> dist/output.css
```

Then open `index.html` (serve the folder if `file://` modules are blocked).
See its own [README](module-3-cp-1/typescript-tailwind/README.md) for watch
mode and details.

## Tech stack

- HTML5, hand-written CSS
- Vanilla JavaScript (ES modules, DOM API)
- TypeScript 5 (strict, compiled with `tsc`)
- Tailwind CSS 3

## Author

Aldi Dwi Seprianto — Software Engineer
