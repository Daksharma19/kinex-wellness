"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/#solutions", label: "Platform" },
  { href: "/#solutions", label: "Solutions" },
  { href: "/#resources", label: "Resources" },
  { href: "/#pricing", label: "Pricing" },
];

export function ContactMarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-kinex-outline/10 bg-white/90 shadow-nav backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-kinex-primary"
        >
          Kinex
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 md:flex md:items-center md:gap-10">
          {links.map((l) => (
            <Link
              key={`${l.href}-${l.label}`}
              href={l.href}
              className="text-[15px] font-medium text-kinex-on-surface-variant transition-colors hover:text-kinex-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/auth?mode=login"
            className="text-[15px] font-medium text-kinex-on-surface-variant transition-colors hover:text-kinex-primary"
          >
            Log In
          </Link>
          <Button
            asChild
            className="h-10 rounded-lg bg-kinex-primary px-6 text-[15px] font-semibold text-white hover:bg-kinex-container"
          >
            <Link href="/auth?mode=signup">Sign Up</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 text-kinex-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(100%,320px)]">
            <SheetHeader>
              <SheetTitle className="text-left text-kinex-primary">
                Menu
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-4">
              {links.map((l) => (
                <SheetClose asChild key={`${l.href}-${l.label}`}>
                  <Link
                    href={l.href}
                    className="text-lg font-medium text-kinex-on-surface"
                  >
                    {l.label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Link
                  href="/auth?mode=login"
                  className="text-lg font-medium text-kinex-on-surface-variant"
                >
                  Log In
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  asChild
                  className="mt-2 h-11 rounded-lg bg-kinex-primary text-white hover:bg-kinex-container"
                >
                  <Link href="/auth?mode=signup">Sign Up</Link>
                </Button>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
