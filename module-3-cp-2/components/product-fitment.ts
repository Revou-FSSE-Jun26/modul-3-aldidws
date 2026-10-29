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
      .filter((f) => f && typeof (f as unknown as Record<string, unknown>).brand === "string" && ((f as unknown as Record<string, unknown>).brand as string).trim() !== "")
      .map((f) => {
        const raw = f as unknown as Record<string, unknown>;
        const normalized: Fitment = { brand: raw.brand as string };
        if (raw.series != null) normalized.series = raw.series as string;
        if (raw.model != null) normalized.model = raw.model as string;
        if (raw.engine != null) normalized.engine = raw.engine as string;
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

export function productMatchesVehicle(
  product: FitmentProduct,
  selection: VehicleSelection
): boolean {
  // No vehicle selected → show all products
  if (!selection.brand) return true;

  const fitments = getProductFitments(product);

  // Product has no fitment data → treat as universal, always show
  if (fitments.length === 0) return false;

  return fitments.some((f) => {
    // Brand must always match
    if (f.brand !== selection.brand) return false;

    // If the fitment has no series, it covers all series of that brand
    if (!f.series) return true;

    // Series is defined on the fitment — must match if user picked one
    if (selection.series && f.series !== selection.series) return false;

    // If the fitment has no model, it covers all models in that series
    if (!f.model) return true;

    // Model is defined — must match if user picked one
    if (selection.model && f.model !== selection.model) return false;

    // If the fitment has no engine, it covers all engines in that model
    if (!f.engine) return true;

    // Engine is defined — must match if user picked one
    if (selection.engine && f.engine !== selection.engine) return false;

    return true;
  });
}
