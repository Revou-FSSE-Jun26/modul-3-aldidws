# RevoShop — TypeScript + Tailwind

A typed, interactive product catalog compiled with `tsc` and styled with Tailwind CSS.
It mirrors the plain-JS exercise in `../javascript`, but re-implements it with
interfaces, type aliases, union types, and a single typed state object.

## What the exercise demonstrates

- **Interfaces** — `Product`, `CartItem`, `CatalogState` (`src/types.ts`)
- **Type aliases** — `Rupiah`, `Rating`, `CartTotals` (`src/types.ts`)
- **Union types** — `Category`, `SortMode`, `CategoryFilter` (string-literal unions)
- **Tailwind-styled cards** — product cards built in `createProductCard` (`src/main.ts`)
- **Live search** — filters as you type via the `input` event on `#search`
- **Interactive state update** — add to cart and adjust quantity with `+ / −`,
  which mutate the typed `state.cart` and re-render

## Project layout

```
typescript-tailwind/
├─ index.html            # Tailwind-classed shell, loads dist/output.css + dist/main.js
├─ package.json          # build scripts + dev dependencies
├─ tsconfig.json         # strict tsc config, ES2020 modules, outDir=dist
├─ tailwind.config.js    # v3 config; content globs scan html + src + dist
└─ src/
   ├─ input.css          # @tailwind base/components/utilities
   ├─ types.ts           # interfaces · type aliases · union types
   ├─ products.ts        # typed PRODUCTS: Product[] + formatIDR
   └─ main.ts            # DOM rendering, events, cart state
```

## Setup & build

```bash
npm install       # installs typescript + tailwindcss
npm run build     # compiles TS -> dist/*.js and CSS -> dist/output.css
```

Then open `index.html` in a browser (or serve the folder). Because it loads a
JavaScript module, use a local server if your browser blocks `file://` modules:

```bash
npx serve .       # or: python -m http.server
```

## Dev watch mode

Run the two watchers in separate terminals:

```bash
npm run watch:ts    # recompile TS on change
npm run watch:css   # rebuild Tailwind on change
```

## Notes

- Product images are shared with the sibling exercise and referenced as
  `../image/Product-id-N.*`.
- The Tailwind `content` array includes `./dist/**/*.js` so class names emitted
  from the compiled TypeScript are also scanned (belt-and-suspenders; the HTML
  already lists every class used).
