import type { Metadata } from "next";

import { ContactInfoCards } from "@/components/contact/ContactInfoCards";
import { ContactMainSection } from "@/components/contact/ContactMainSection";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Contact Us | Kinex",
  description:
    "Reach Kinex for clinical support, technical help, and partnership inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50/80 via-white to-white pb-14 pt-12 md:pb-16 md:pt-16">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[min(420px,70vw)] w-[min(420px,70vw)] -translate-x-1/2 rounded-full bg-cyan-100/40 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-[720px] px-6 text-center lg:px-8">
            <h1 className=" text-4xl font-bold tracking-tight text-kinex-primary md:text-5xl">
              Get in Touch
            </h1>
            <p className="mx-auto mt-5 max-w-[540px] text-[15px] leading-relaxed text-kinex-on-surface-variant md:text-base">
              Our dedicated clinical team is here to support your journey.
              Reach out for expert guidance, technical assistance, or partnership
              inquiries.
            </p>
          </div>
          <div className="relative mx-auto mt-12 max-w-[1200px]">
            <ContactInfoCards />
          </div>
        </section>

        <ContactMainSection />
        {/* <ContactDepartmentDirectory /> */}
      </main>
      <Footer />
    </>
  );
}
