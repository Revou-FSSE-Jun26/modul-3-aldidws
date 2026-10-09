# RevoShop

A [Next.js](https://nextjs.org) storefront (App Router) for an automotive parts shop. Product, category, and order data is served by an external REST API, and authentication (register / login / profile) is handled by the same backend. A client-side shopping cart lets users collect items before placing an order.

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript 5
- Tailwind CSS 4

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and adjust the values if needed:

```bash
cp .env.example .env.local
```

| Variable                    | Description                                                 |
| --------------------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`  | Base URL of the catalog API (products, categories, orders). |
| `NEXT_PUBLIC_AUTH_BASE_URL` | Base URL of the auth API (login, register, profile).        |

Both default to `https://revo-otoshop.onrender.com`. These are `NEXT_PUBLIC_*` values (exposed to the browser), so they must not contain secrets.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Script          | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Start the development server. |
| `npm run build` | Create a production build.    |
| `npm run start` | Serve the production build.   |
| `npm run lint`  | Run ESLint.                   |

## Features

- Product catalog with detail pages and live search filtering.
- Category browsing with per-category product listings.
- Shopping cart with add / remove / quantity updates, persisted to `localStorage`.
- Authentication (register, login, profile) backed by the API.
- Orders page listing a signed-in user's orders.
- Route-level `loading`, `error`, and `not-found` states throughout the App Router.

## Project structure

```
app/            App Router pages
  page.tsx      Home
  products/     Product list + [id] detail (with loading/error/not-found)
  categories/   Category list + [categories_id] detail
  cart/         Shopping cart page
  orders/       Orders list + [order_id] detail (requires auth)
  login/        Login page
  register/     Register page
  layout.tsx    Root layout (wraps the app in CartProvider, Header, Footer)
components/     Reusable UI components
  Header.tsx        Site header with nav and cart indicator
  Footer.tsx        Site footer
  Card.tsx          Generic card container
  ProductCard.tsx   Product tile used in listings
  SearchBar.tsx     Live search input
  AddProductForm.tsx Form for adding a product
  ErrorState.tsx    Shared error UI
lib/
  api.ts        Catalog API client (products, categories, orders) + response mappers
  auth.ts       Auth API client (register, login, getMe)
  cart.tsx      Cart context/provider (CartProvider, useCart), persisted to localStorage
  types.ts      Shared TypeScript types
```

## API notes

- The catalog API returns wrapped responses (`{ products: [...] }`, `{ product: {...} }`, etc.). `lib/api.ts` unwraps these and maps fields such as `image_url` → `imageUrl` and `category_name` → `category`, and converts the string `price` into a number.
- The `/orders` endpoint requires authentication (`Authorization: Bearer <token>`). Without a valid token the orders page surfaces an error state. Log in first to obtain a token (stored in `localStorage` after login/register).
- The cart is entirely client-side. `lib/cart.tsx` exposes a `CartProvider` (wired up in the root layout) and a `useCart()` hook, and persists the cart to `localStorage` under the `cart` key so it survives reloads.

## Deploy on Vercel

The easiest way to deploy a Next.js app is the [Vercel Platform](https://vercel.com/new). Remember to set `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_AUTH_BASE_URL` in the project's environment variables.

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for details.
