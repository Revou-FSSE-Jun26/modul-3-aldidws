import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Details",
};

export default function DashboardOrderDetailsLayout({ children }: LayoutProps<"/dashboard/orders/[order_id]">) {
  return children;
}
