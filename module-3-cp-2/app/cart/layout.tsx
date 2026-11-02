import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartLayout({ children }: LayoutProps<"/cart">) {
  return children;
}
