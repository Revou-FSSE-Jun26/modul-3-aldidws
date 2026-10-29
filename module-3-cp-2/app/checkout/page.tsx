"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { createOrder } from "@/lib/api";

interface FormValues {
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
  shipping_cost: string;
  discount: string;
  customer_note: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY_FORM: FormValues = {
  recipient_name: "",
  recipient_phone: "",
  shipping_address: "",
  shipping_city: "",
  shipping_province: "",
  shipping_postal_code: "",
  shipping_cost: "0",
  discount: "0",
  customer_note: "",
};

const PHONE_PATTERN = /^[+\d][\d\s-]{6,}$/;
const POSTAL_PATTERN = /^\d{4,10}$/;

const FIELD_CLASS =
  "rounded-md border border-black/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 dark:border-white/20";

interface FieldConfig {
  name: keyof FormValues;
  label: string;
  type?: string;
  multiline?: boolean;
  placeholder?: string;
  optional?: boolean;
}

const FIELDS: FieldConfig[] = [
  { name: "recipient_name", label: "Recipient name" },
  { name: "recipient_phone", label: "Recipient phone", type: "tel" },
  { name: "shipping_address", label: "Shipping address", type: "text", },
  { name: "shipping_city", label: "City" },
  { name: "shipping_province", label: "Province" },
  { name: "shipping_postal_code", label: "Postal code", type: "text" },
  { name: "shipping_cost", label: "Shipping cost (Rp)", type: "number" },
  { name: "discount", label: "Discount (Rp)", type: "number" },
  {
    name: "customer_note",
    label: "Customer note",
    multiline: true,
    optional: true,
    placeholder: "Optional delivery notes…",
  },
];

/** Parse a currency-ish string input into a non-negative number (0 when blank/invalid). */
function parseAmount(raw: string): number {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.recipient_name.trim()) {
    errors.recipient_name = "Recipient name is required.";
  }

  if (!values.recipient_phone.trim()) {
    errors.recipient_phone = "A phone number is required.";
  } else if (!PHONE_PATTERN.test(values.recipient_phone.trim())) {
    errors.recipient_phone = "Enter a valid phone number.";
  }

  if (!values.shipping_address.trim()) {
    errors.shipping_address = "A shipping address is required.";
  }

  if (!values.shipping_city.trim()) {
    errors.shipping_city = "City is required.";
  }

  if (!values.shipping_province.trim()) {
    errors.shipping_province = "Province is required.";
  }

  if (!values.shipping_postal_code.trim()) {
    errors.shipping_postal_code = "Postal code is required.";
  } else if (!POSTAL_PATTERN.test(values.shipping_postal_code.trim())) {
    errors.shipping_postal_code = "Enter a valid postal code.";
  }

  if (values.shipping_cost.trim() && Number(values.shipping_cost) < 0) {
    errors.shipping_cost = "Shipping cost cannot be negative.";
  }

  if (values.discount.trim() && Number(values.discount) < 0) {
    errors.discount = "Discount cannot be negative.";
  }

  return errors;
}

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clear } = useCart();
  const { token, status } = useAuth(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/login?redirect=${encodeURIComponent("/checkout")}`);
    }
  }, [status, router]);

  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const shippingCost = parseAmount(values.shipping_cost);
  const discount = parseAmount(values.discount);
  const grandTotal = Math.max(0, totalPrice + shippingCost - discount);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (items.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    if (!token) {
      router.push(`/auth/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }

    setSubmitting(true);
    try {
      await createOrder(
        {
          recipientName: values.recipient_name.trim(),
          recipientPhone: values.recipient_phone.trim(),
          shippingAddress: values.shipping_address.trim(),
          shippingCity: values.shipping_city.trim(),
          shippingProvince: values.shipping_province.trim(),
          shippingPostalCode: values.shipping_postal_code.trim(),
          shippingCost,
          discount,
          customerNote: values.customer_note.trim() || undefined,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        },
        token,
      );

      clear();
      router.push("/orders");
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Could not place your order. Please try again.",
      );
      setSubmitting(false);
    }
  }

  // --- Auth loading --------------------------------------------------------
  if (status === "loading") {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
        <p className="py-10 text-center text-sm text-foreground/60" aria-live="polite">
          Loading…
        </p>
      </div>
    );
  }

  // --- Empty cart ----------------------------------------------------------
  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
        <Card className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-foreground/60">
            Your cart is empty, so there is nothing to check out.
          </p>
          <Link
            href="/products"
            className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
          >
            Browse products
          </Link>
        </Card>
      </div>
    );
  }

  // --- Checkout form + summary --------------------------------------------
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Shipping details form */}
        <Card>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <h2 className="text-lg font-semibold">Shipping details</h2>

            {FIELDS.map((config) => {
              const { name, label, type, multiline, placeholder, optional } =
                config;
              const error = errors[name];
              const shared = {
                id: name,
                name,
                value: values[name],
                onChange: handleChange,
                placeholder,
                "aria-invalid": Boolean(error),
                className: FIELD_CLASS,
              } as const;

              return (
                <div key={name} className="flex flex-col gap-1">
                  <label htmlFor={name} className="text-sm font-medium">
                    {label}
                    {optional && (
                      <span className="ml-1 text-xs font-normal text-foreground/50">
                        (optional)
                      </span>
                    )}
                  </label>
                  {multiline ? (
                    <textarea {...shared} rows={3} />
                  ) : (
                    <input
                      {...shared}
                      type={type ?? "text"}
                      {...(type === "number"
                        ? { min: 0, inputMode: "numeric" as const }
                        : {})}
                    />
                  )}
                  {error && (
                    <p className="text-xs text-red-500" aria-live="polite">
                      {error}
                    </p>
                  )}
                </div>
              );
            })}

            {submitError && (
              <p
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300"
              >
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Placing order…" : "Place order"}
            </button>
          </form>
        </Card>

        {/* Order summary */}
        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <span className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-foreground/60">
                      {item.quantity} &times; Rp{" "}
                      {item.price.toLocaleString("id-ID")}
                    </span>
                  </span>
                  <span className="whitespace-nowrap font-semibold">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2 border-t border-black/10 pt-3 text-sm dark:border-white/15">
              <div className="flex items-center justify-between text-foreground/70">
                <span>
                  Subtotal ({totalItems} item{totalItems === 1 ? "" : "s"})
                </span>
                <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between text-foreground/70">
                <span>Shipping</span>
                <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between text-foreground/70">
                <span>Discount</span>
                <span>&minus; Rp {discount.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-black/10 pt-3 dark:border-white/15">
              <span className="text-sm text-foreground/60">Total</span>
              <span className="text-lg font-bold">
                Rp {grandTotal.toLocaleString("id-ID")}
              </span>
            </div>
          </Card>

          <Link
            href="/cart"
            className="text-center text-sm font-medium text-foreground/70 hover:underline"
          >
            &larr; Back to cart
          </Link>
        </div>
      </div>
    </div>
  );
}
