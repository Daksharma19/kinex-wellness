import Link from "next/link";
import { AtSign, Globe, Shield } from "lucide-react";

const product = [
  { href: "#analytics", label: "Analytics" },
  { href: "#compliance", label: "Compliance" },
  { href: "#integrations", label: "Integrations" },
];

const company = [
  { href: "#about", label: "About Us" },
  { href: "#careers", label: "Careers" },
  { href: "#privacy", label: "Privacy" },
];

const support = [
  { href: "#help", label: "Help Center" },
  { href: "#docs", label: "Documentation" },
  { href: "#contact", label: "Contact" },
];

export function AuthFooter() {
  return (
    <footer className="mt-auto bg-kinex-primary px-6 pb-10 pt-14 text-white lg:px-8 lg:pt-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <p className="text-xl font-bold tracking-tight">Kinex</p>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/75">
              Transforming clinical operations through intuitive design and
              predictive intelligence. The Clinical Sanctuary for modern
              healthcare providers.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Product</p>
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
            <p className="text-sm font-bold text-white">Company</p>
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
            <p className="text-sm font-bold text-white">Support</p>
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
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/15 pt-8 text-sm text-white/65 sm:flex-row">
          <p>© 2024 Kinex Healthcare. The Clinical Sanctuary.</p>
          <div className="flex items-center gap-4">
            <Link
              href="#locale"
              className="text-white/80 transition-colors hover:text-white"
              aria-label="Language or region"
            >
              <Globe className="h-5 w-5" />
            </Link>
            <Link
              href="#social"
              className="text-white/80 transition-colors hover:text-white"
              aria-label="Social"
            >
              <AtSign className="h-5 w-5" />
            </Link>
            <Link
              href="#trust"
              className="text-white/80 transition-colors hover:text-white"
              aria-label="Security"
            >
              <Shield className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
