import AdminGuard from "@/components/AdminGuard";
import DashboardShell from "@/components/DashboardShell";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <AdminGuard>
      <DashboardShell>{children}</DashboardShell>
    </AdminGuard>
  );
}
