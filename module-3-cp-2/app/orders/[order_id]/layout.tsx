import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Details",
};

export default function OrderDetailsLayout({ children }: LayoutProps<"/orders/[order_id]">) {
  return children;
}
