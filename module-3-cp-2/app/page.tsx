"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { VEHICLE_DATA, CAR_BRANDS } from "@/lib/vehicle-data";
import {
  productMatchesVehicle,
  type Fitment,
} from "@/lib/product-fitment";
import ProductCard from "@/components/ui/ProductCard";
import { CheckCircle2 } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://revo-otoshop.onrender.com";

interface Product {
  id: number;
  sku: string;
  name: string;
  brand: string;
  description: string;
  price: number | string;
  stock: number;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  category_id: number;
  category_name: string;
  fitments?: Array<{
    brand: string;
    series?: string;
    model?: string;
    engine?: string;
  }> | null;
}

const formatPrice = (price: number | string) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(price));

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBrand, setSelectedBrand] = useState("");
  const [brandOpen, setBrandOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState("");
  const [seriesOpen, setSeriesOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState("");
  const [engineOpen, setEngineOpen] = useState(false);

  const seriesOptions = useMemo(
    () => (selectedBrand ? VEHICLE_DATA[selectedBrand] ?? [] : []),
    [selectedBrand]
  );

  const modelOptions = useMemo(
    () => seriesOptions.find((s) => s.name === selectedSeries)?.models ?? [],
    [seriesOptions, selectedSeries]
  );

  const engineOptions = useMemo(
    () => modelOptions.find((m) => m.name === selectedModel)?.engines ?? [],
    [modelOptions, selectedModel]
  );

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Unable to load products (${response.status}).`);
        }

        const data = await response.json();

        if (!Array.isArray(data.products)) {
          throw new Error("The product API returned an unexpected response.");
        }

        setProducts(
          data.products.filter((product: Product) => product.is_active)
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading products."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => [
      "All Products",
      ...Array.from(
        new Set(products.map((product) => product.category_name))
      ).filter(Boolean),
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const query = search.toLowerCase();

      const matchesSearch = [
        product.name,
        product.brand,
        product.sku,
        product.category_name,
      ].some((value) => value?.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === "All Products" ||
        product.category_name === selectedCategory;

      const matchesVehicle = productMatchesVehicle(product, {
        brand: selectedBrand,
        series: selectedSeries,
        model: selectedModel,
        engine: selectedEngine,
      });

      return matchesSearch && matchesCategory && matchesVehicle;
    });

    return result.sort((a, b) => {
      if (sort === "price-low") {
        return Number(a.price) - Number(b.price);
      }

      if (sort === "price-high") {
        return Number(b.price) - Number(a.price);
      }

      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }

      return Number(b.is_featured) - Number(a.is_featured);
    });
  }, [
    products,
    search,
    selectedCategory,
    sort,
    selectedBrand,
    selectedSeries,
    selectedModel,
    selectedEngine,
  ]);

  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* ── HERO ── */}
      <section
        className="relative -mt-8 mb-0 overflow-hidden"
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
        }}
      >
        <div className="relative h-[380px] w-full sm:h-[460px] lg:h-[540px]">
          <Image
            src="https://ik.imagekit.io/3xk2xnjekw/FoS_18_JoaoFilipe_1697.webp"
            alt="BMW M4 Competition on track — performance automotive parts"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#17365d]/90 via-[#17365d]/60 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16">
            <span className="mb-3 w-fit rounded-full bg-blue-400/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-200 backdrop-blur-sm">
              Premium Auto Parts
            </span>
            <h1 className="max-w-xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Find the Right Parts{" "}
              <span className="text-amber-400">for Your BMW</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300 sm:text-base">
              OEM-quality components, performance upgrades, and expert fitment
              guidance — all in one place.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-amber-300"
              >
                Shop Now
              </button>
              <a
                href="/about"
                className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                About Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section
        className="border-b border-slate-200 bg-[#17365d]"
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 px-5 md:grid-cols-4">
          {[
            { title: "Quality Parts", desc: "Carefully selected products" },
            { title: "Full Catalog", desc: "Find the right components" },
            { title: "Easy Shopping", desc: "Simple product discovery" },
            { title: "Customer Support", desc: "Assistance when you need it" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 px-4 py-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-400" />
              <div>
                <p className="text-xs font-bold text-white">{item.title}</p>
                <p className="text-[11px] text-white/60">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* VEHICLE SEARCH */}
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 md:p-7">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            VEHICLE SELECTOR
          </span>

          <h2 className="mt-2 text-xl font-bold text-[#17365d]">
            Find parts for your vehicle
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Select your vehicle to help identify compatible components.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Car Brand
              </label>

              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={brandOpen}
                onClick={() => {
                  setBrandOpen((open) => !open);
                  setSeriesOpen(false);
                  setModelOpen(false);
                  setEngineOpen(false);
                }}
                className={`flex w-full items-center gap-3 border bg-white px-3 py-2.5 text-left text-sm transition ${
                  brandOpen
                    ? "border-[#17365d] ring-1 ring-[#17365d]"
                    : selectedBrand
                    ? "border-[#17365d]"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f2d21b] text-[11px] font-bold text-slate-900">
                  1
                </span>
                <span
                  className={selectedBrand ? "text-slate-900" : "text-slate-500"}
                >
                  {selectedBrand || "Select a car brand"}
                </span>
                <svg
                  className={`ml-auto h-4 w-4 shrink-0 text-slate-600 transition-transform ${
                    brandOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {brandOpen && (
                <div
                  role="listbox"
                  aria-label="Car brand"
                  className="absolute left-0 right-0 top-full z-30 max-h-60 overflow-y-auto border-x border-b border-slate-300 bg-white shadow-lg"
                >
                  {CAR_BRANDS.map((brand) => {
                    const isSelected = selectedBrand === brand;
                    return (
                      <button
                        key={brand}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedBrand(brand);
                          setSelectedSeries("");
                          setSelectedModel("");
                          setSelectedEngine("");
                          setBrandOpen(false);
                        }}
                        className={`block w-full border-b border-slate-200 px-3 py-2.5 text-left text-sm transition last:border-b-0 ${
                          isSelected
                            ? "bg-[#202020] font-medium text-[#f2d21b]"
                            : "text-slate-800 hover:bg-[#202020] hover:text-[#f2d21b]"
                        }`}
                      >
                        {brand}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Series */}
            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Series
              </label>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={seriesOpen}
                disabled={!selectedBrand}
                onClick={() => {
                  setSeriesOpen((open) => !open);
                  setBrandOpen(false);
                  setModelOpen(false);
                  setEngineOpen(false);
                }}
                className={`flex w-full items-center gap-3 border bg-white px-3 py-2.5 text-left text-sm transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${
                  seriesOpen
                    ? "border-[#17365d] ring-1 ring-[#17365d]"
                    : selectedSeries
                    ? "border-[#17365d]"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f2d21b] text-[11px] font-bold text-slate-900">
                  2
                </span>
                <span
                  className={
                    selectedSeries ? "text-slate-900" : "text-slate-500"
                  }
                >
                  {selectedSeries ||
                    (selectedBrand ? "Select series" : "Select a brand first")}
                </span>
                <svg
                  className={`ml-auto h-4 w-4 shrink-0 text-slate-600 transition-transform ${
                    seriesOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {seriesOpen && (
                <div
                  role="listbox"
                  aria-label="Series"
                  className="absolute left-0 right-0 top-full z-30 max-h-60 overflow-y-auto border-x border-b border-slate-300 bg-white shadow-lg"
                >
                  {seriesOptions.map((series) => {
                    const isSelected = selectedSeries === series.name;
                    return (
                      <button
                        key={series.name}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedSeries(series.name);
                          setSelectedModel("");
                          setSelectedEngine("");
                          setSeriesOpen(false);
                        }}
                        className={`block w-full border-b border-slate-200 px-3 py-2.5 text-left text-sm transition last:border-b-0 ${
                          isSelected
                            ? "bg-[#202020] font-medium text-[#f2d21b]"
                            : "text-slate-800 hover:bg-[#202020] hover:text-[#f2d21b]"
                        }`}
                      >
                        {series.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Model */}
            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Model
              </label>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={modelOpen}
                disabled={!selectedSeries}
                onClick={() => {
                  setModelOpen((open) => !open);
                  setBrandOpen(false);
                  setSeriesOpen(false);
                  setEngineOpen(false);
                }}
                className={`flex w-full items-center gap-3 border bg-white px-3 py-2.5 text-left text-sm transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${
                  modelOpen
                    ? "border-[#17365d] ring-1 ring-[#17365d]"
                    : selectedModel
                    ? "border-[#17365d]"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f2d21b] text-[11px] font-bold text-slate-900">
                  3
                </span>
                <span
                  className={selectedModel ? "text-slate-900" : "text-slate-500"}
                >
                  {selectedModel ||
                    (selectedSeries
                      ? "Select model"
                      : "Select a series first")}
                </span>
                <svg
                  className={`ml-auto h-4 w-4 shrink-0 text-slate-600 transition-transform ${
                    modelOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {modelOpen && (
                <div
                  role="listbox"
                  aria-label="Model"
                  className="absolute left-0 right-0 top-full z-30 max-h-60 overflow-y-auto border-x border-b border-slate-300 bg-white shadow-lg"
                >
                  {modelOptions.map((model) => {
                    const isSelected = selectedModel === model.name;
                    return (
                      <button
                        key={model.name}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedModel(model.name);
                          setSelectedEngine("");
                          setModelOpen(false);
                        }}
                        className={`block w-full border-b border-slate-200 px-3 py-2.5 text-left text-sm transition last:border-b-0 ${
                          isSelected
                            ? "bg-[#202020] font-medium text-[#f2d21b]"
                            : "text-slate-800 hover:bg-[#202020] hover:text-[#f2d21b]"
                        }`}
                      >
                        {model.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Engine */}
            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Engine
              </label>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={engineOpen}
                disabled={!selectedModel}
                onClick={() => {
                  setEngineOpen((open) => !open);
                  setBrandOpen(false);
                  setSeriesOpen(false);
                  setModelOpen(false);
                }}
                className={`flex w-full items-center gap-3 border bg-white px-3 py-2.5 text-left text-sm transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${
                  engineOpen
                    ? "border-[#17365d] ring-1 ring-[#17365d]"
                    : selectedEngine
                    ? "border-[#17365d]"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f2d21b] text-[11px] font-bold text-slate-900">
                  4
                </span>
                <span
                  className={
                    selectedEngine ? "text-slate-900" : "text-slate-500"
                  }
                >
                  {selectedEngine ||
                    (selectedModel
                      ? "Select engine"
                      : "Select a model first")}
                </span>
                <svg
                  className={`ml-auto h-4 w-4 shrink-0 text-slate-600 transition-transform ${
                    engineOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {engineOpen && (
                <div
                  role="listbox"
                  aria-label="Engine"
                  className="absolute left-0 right-0 top-full z-30 max-h-60 overflow-y-auto border-x border-b border-slate-300 bg-white shadow-lg"
                >
                  {engineOptions.map((engine) => {
                    const isSelected = selectedEngine === engine;
                    return (
                      <button
                        key={engine}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedEngine(engine);
                          setEngineOpen(false);
                        }}
                        className={`block w-full border-b border-slate-200 px-3 py-2.5 text-left text-sm transition last:border-b-0 ${
                          isSelected
                            ? "bg-[#202020] font-medium text-[#f2d21b]"
                            : "text-slate-800 hover:bg-[#202020] hover:text-[#f2d21b]"
                        }`}
                      >
                        {engine}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-lg bg-[#17365d] px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              SEARCH
            </button>

            {(selectedBrand || selectedSeries || selectedModel || selectedEngine) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedBrand("");
                  setSelectedSeries("");
                  setSelectedModel("");
                  setSelectedEngine("");
                  setBrandOpen(false);
                  setSeriesOpen(false);
                  setModelOpen(false);
                  setEngineOpen(false);
                }}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Reset Filter
              </button>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Pick a vehicle to filter the catalog to compatible parts
          </p>
        </section>

        {/* PRODUCTS */}
        <section id="products" className="mt-10">
          {/* Catalog header */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  OUR CATALOG
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Automotive Parts
                </h2>
              </div>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-blue-500"
                aria-label="Sort products"
              >
                <option value="featured">Featured products</option>
                <option value="name">Product name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <p className="font-bold">Unable to load products</p>
                <p className="mt-1">{error}</p>

                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 font-semibold underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white"
                  >
                    <div className="aspect-[4/3] bg-slate-100" />
                    <div className="space-y-3 p-3">
                      <div className="h-2.5 w-1/3 rounded bg-slate-200" />
                      <div className="h-3.5 rounded bg-slate-200" />
                      <div className="h-3.5 w-2/3 rounded bg-slate-200" />
                      <div className="h-8 rounded-lg bg-slate-200" />
                      <div className="h-8 rounded-lg bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="mt-5 rounded-lg border border-slate-200 px-4 py-12 text-center">
                <h3 className="font-bold text-slate-900">No products found</h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try another search term or category.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All Products");
                  }}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  View all products
                </button>
              </div>
            )}

            {/* Product grid */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    stock={product.stock}
                    description={product.description}
                    brand={product.brand}
                    sku={product.sku}
                    image_url={product.image_url}
                    is_featured={product.is_featured}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
