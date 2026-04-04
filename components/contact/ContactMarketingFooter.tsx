import Link from "next/link";
import { Globe, Share2, Sun } from "lucide-react";

const product = [
  { href: "/#features", label: "Features" },
  { href: "/#care", label: "Care Plans" },
  { href: "/#integration", label: "Integration" },
  { href: "/#security", label: "Security" },
];

const company = [
  { href: "/#about", label: "About Us" },
  { href: "/#careers", label: "Careers" },
  { href: "/#press", label: "Press Kit" },
  { href: "/#investors", label: "Investors" },
];

const support = [
  { href: "/contact", label: "Contact Us" },
  { href: "/#docs", label: "Documentation" },
  { href: "/#status", label: "Status" },
  { href: "/#community", label: "Community" },
];

export function ContactMarketingFooter() {
  return (
    <footer className="bg-kinex-primary px-6 pb-10 pt-16 text-white lg:px-8 lg:pt-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <p className="text-xl font-bold tracking-tight">Kinex</p>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/75">
              Empowering clinicians with intelligent tools to deliver safer,
              faster, and more human-centered care.
            </p>
            <div className="mt-6 flex items-center gap-4 text-white/80">
              <Link
                href="#share"
                className="transition-colors hover:text-white"
                aria-label="Share"
              >
                <Share2 className="h-5 w-5" />
              </Link>
              <Link
                href="#globe"
                className="transition-colors hover:text-white"
                aria-label="Globe"
              >
                <Globe className="h-5 w-5" />
              </Link>
              <Link
                href="#theme"
                className="transition-colors hover:text-white"
                aria-label="Theme"
              >
                <Sun className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white/60">
              Product
            </p>
            <ul className="mt-5 space-y-3">
              {product.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[15px] text-white/85 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white/60">
              Company
            </p>
            <ul className="mt-5 space-y-3">
              {company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[15px] text-white/85 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white/60">
              Support
            </p>
            <ul className="mt-5 space-y-3">
              {support.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[15px] text-white/85 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 text-sm text-white/65 sm:flex-row sm:items-center">
          <p>© 2026 Kinex Healthcare. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="#terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link href="#hipaa" className="transition-colors hover:text-white">
              HIPAA Compliance
            </Link>
            <Link href="#cookies" className="transition-colors hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
