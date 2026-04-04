import { Cormorant_Garamond } from "next/font/google";
import type { Metadata } from "next";

const displaySerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clinical Specialties | Kinex",
  description:
    "Precision-led healthcare services and clinical specialties at Kinex.",
};

export default function ServicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={displaySerif.variable}>{children}</div>;
}
