import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in or Sign up | Kinex",
  description:
    "Secure HIPAA-compliant access to Kinex — The Clinical Sanctuary for modern healthcare.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
