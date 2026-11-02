import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return children;
}
