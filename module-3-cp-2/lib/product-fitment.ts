export type Fitment = {
  brand: string;
  series?: string;
  model?: string;
  engine?: string;
};

export type FitmentProduct = {
  sku: string;
  fitments?: Fitment[] | null;
};

export const PRODUCT_FITMENT: Record<string, Fitment[]> = {
  "BC-COILOVER-DEMO": [
    { brand: "BMW", series: "3 Series" },
    { brand: "BMW", series: "5 Series" },
  ],
};

export function getProductFitments(product: FitmentProduct): Fitment[] {
  if (Array.isArray(product.fitments) && product.fitments.length > 0) {
    // Normalize null → undefined and filter out entries without a brand
    const valid = product.fitments
      .filter((f) => f && typeof f.brand === "string" && f.brand.trim() !== "")
      .map((f): Fitment => {
        const normalized: Fitment = { brand: f.brand };
        if (f.series != null) normalized.series = f.series;
        if (f.model != null) normalized.model = f.model;
        if (f.engine != null) normalized.engine = f.engine;
        return normalized;
      });
    if (valid.length > 0) return valid;
  }
  return PRODUCT_FITMENT[product.sku] ?? [];
}

export type VehicleSelection = {
  brand?: string;
  series?: string;
  model?: string;
  engine?: string;
};

/** Normalize dashes: replace en dash (–) and em dash (—) with hyphen (-) */
function normalizeDashes(str: string): string {
  return str.replace(/[\u2013\u2014]/g, "-");
}

/** Case-insensitive, dash-normalized string comparison */
function looseMatch(a: string, b: string): boolean {
  return normalizeDashes(a).toLowerCase() === normalizeDashes(b).toLowerCase();
}

export function productMatchesVehicle(
  product: FitmentProduct,
  selection: VehicleSelection
): boolean {
  // No vehicle selected → show all products
  if (!selection.brand) return true;

  const fitments = getProductFitments(product);

  // Product has no fitment data → treat as universal, always show
  if (fitments.length === 0) return true;

  return fitments.some((f) => {
    // Brand must always match
    if (!looseMatch(f.brand, selection.brand!)) return false;

    // If the fitment has no series, it covers all series of that brand
    if (!f.series) return true;

    // Series is defined on the fitment — must match if user picked one
    if (selection.series && !looseMatch(f.series, selection.series)) return false;

    // If the fitment has no model, it covers all models (check engine if present)
    if (!f.model) {
      if (!f.engine) return true; // brand+series covers all models/engines
      return !selection.engine || looseMatch(f.engine, selection.engine);
    }

    // Model is defined — must match if user picked one
    if (selection.model && !looseMatch(f.model, selection.model)) return false;

    // If the fitment has no engine, it covers all engines in that model
    if (!f.engine) return true;

    // Engine is defined — must match if user picked one
    if (selection.engine && !looseMatch(f.engine, selection.engine)) return false;

    return true;
  });
}
