import AdminGuard from "@/components/AdminGuard";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return <AdminGuard>{children}</AdminGuard>;
}
