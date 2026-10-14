import Link from "next/link";

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 py-8">
      <Link
        href="/"
        className="text-2xl font-bold tracking-tight"
        aria-label="RevoShop home"
      >
        Revo Otoshop
      </Link>

      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
