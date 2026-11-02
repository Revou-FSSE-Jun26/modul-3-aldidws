import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
};

export default function DashboardOrdersLayout({ children }: LayoutProps<"/dashboard/orders">) {
  return children;
}
