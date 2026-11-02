import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegisterLayout({ children }: LayoutProps<"/register">) {
  return children;
}
