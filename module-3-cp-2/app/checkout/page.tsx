"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import { useCart } from "@/lib/cart";
import { createOrder } from "@/lib/api";

interface FormValues {
  name: string;
  email: string;
  address: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
}

const EMPTY_FORM: FormValues = {
  name: "",
  email: "",
  address: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Your name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "An email address is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.address.trim()) {
    errors.address = "A shipping address is required.";
  }

  return errors;
}

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clear } = useCart();
  const router = useRouter();

  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

    setSubmitting(true);
    try {
      await createOrder({
        customerName: values.name.trim(),
        email: values.email.trim(),
        address: values.address.trim(),
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

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

            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <input
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
                className="rounded-md border border-black/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 dark:border-white/20"
              />
              {errors.name && (
                <p className="text-xs text-red-500" aria-live="polite">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                className="rounded-md border border-black/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 dark:border-white/20"
              />
              {errors.email && (
                <p className="text-xs text-red-500" aria-live="polite">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="address" className="text-sm font-medium">
                Shipping address
              </label>
              <textarea
                id="address"
                name="address"
                value={values.address}
                onChange={handleChange}
                rows={3}
                aria-invalid={Boolean(errors.address)}
                className="rounded-md border border-black/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 dark:border-white/20"
              />
              {errors.address && (
                <p className="text-xs text-red-500" aria-live="polite">
                  {errors.address}
                </p>
              )}
            </div>

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

            <div className="flex items-center justify-between border-t border-black/10 pt-3 dark:border-white/15">
              <span className="text-sm text-foreground/60">
                {totalItems} item{totalItems === 1 ? "" : "s"}
              </span>
              <span className="text-lg font-bold">
                Rp {totalPrice.toLocaleString("id-ID")}
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
