import Link from "next/link";
import { Linkedin, Twitter } from "lucide-react";

const product = [
  { href: "#services", label: "Services" },
  { href: "#technology", label: "Technology" },
  { href: "#locations", label: "Locations" },
  { href: "#pricing", label: "Pricing" },
];

const company = [
  { href: "#about", label: "About Us" },
  { href: "#experts", label: "Our Experts" },
  { href: "#careers", label: "Careers" },
  { href: "#contact", label: "Contact" },
];

const support = [
  { href: "#help", label: "Help Center" },
  { href: "#privacy", label: "Privacy Policy" },
  { href: "/dashboard/patient", label: "Patient Portal" },
];

export function Footer() {
  return (
    <footer className="bg-kinex-primary px-6 pb-10 pt-16 text-white lg:px-8 lg:pt-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <p className="text-xl font-bold tracking-tight">Kinex Wellness & Rehab</p>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/75">
              Advanced care with human warmth-your clinical sanctuary for
              preventive, acute, and long-term health.
            </p>
            
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
        <div className="mt-14 border-t border-white/15 pt-8 text-center text-sm text-white/65">
          © 2024 Kinex Healthcare. The Clinical Sanctuary.
        </div>
      </div>
    </footer>
  );
}
