import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutLayout({ children }: LayoutProps<"/checkout">) {
  return children;
}
