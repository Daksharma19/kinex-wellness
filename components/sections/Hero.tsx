import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, PlayCircle ,PhoneCall} from "lucide-react";

import { Button } from "@/components/ui/button";

import heroBackground from "@/assets/images/hero-background.jpg";

// import { FindDoctor } from "./FindDoctor";

export function Hero() {
  return (
    <section className="relative min-h-[clamp(520px,72vh,900px)] overflow-hidden px-6 pb-20 pt-12 lg:px-8 lg:pb-28 lg:pt-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <Image
          src={heroBackground}
          alt=""
          fill
          priority
          className="object-cover object-[50%_42%]  sm:object-[50%_40%]"
          sizes="100vw"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/88 to-white/25 md:via-white/80 md:to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <div className="max-w-xl">
          {/* <p className="inline-flex rounded-full bg-kinex-badge px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-kinex-primary">
            Delivering Healthy Future
          </p> */}
          <h1 className="mt-6 max-w-xl text-4xl font-bold leading-[1.12] tracking-[-0.02em] text-kinex-on-surface md:text-5xl lg:text-[3.25rem]">
            The Sanctuary of{" "}
            <span className="text-kinex-primary">Modern Clinical Excellence.</span>
          </h1>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-kinex-on-surface-variant">
            Kinex integrates world-class medical expertise with a
            compassion-inspired patient experience. Advanced healthcare, delivered
            with human warmth.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              className="h-12 rounded-xl bg-kinex-primary px-7 text-[15px] font-semibold text-white shadow-sm hover:bg-kinex-container"
            >
              <Link
                href="#appointments"
                className="inline-flex items-center gap-2"
              >
                Book Appointments
                <ArrowUpRight className="h-5 w-5" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="h-12 rounded-xl bg-[#E8EAED] px-7 text-[15px] font-semibold text-kinex-on-surface hover:bg-[#dde0e5]"
            >
              <a
                href="tel:+911122334455"
                className="inline-flex items-center gap-2"
              >
                <PhoneCall className="h-5 w-5" aria-hidden />
                Call Now
              </a>
            </Button>
          </div>
          {/* <FindDoctor /> */}
        </div>
      </div>
    </section>
  );
}
