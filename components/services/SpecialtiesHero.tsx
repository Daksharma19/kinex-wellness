import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

const HERO_IMG =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=85";

export function SpecialtiesHero() {
  return (
    <section className="bg-white px-6 pb-16 pt-10 md:pb-20 md:pt-14 lg:px-8">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,480px)] lg:gap-14">
        <div className="max-w-xl lg:max-w-none">
          <span className="inline-flex rounded-lg bg-[#d4ece9] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0a4d4d]">
            Expertise &amp; Innovation
          </span>
          <h1 className="mt-5 font-display text-[2.35rem] font-semibold leading-[1.12] tracking-tight text-[#0a4d4d] md:text-5xl md:leading-[1.08]">
            Our Clinical Specialties
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed text-[#4a5560] md:text-[17px]">
            At Kinex, we combine advanced medical technology with a deeply
            human-centered approach. Our sanctuary of healing is designed to
            provide authoritative care in an environment of absolute
            tranquility.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              asChild
              className="h-12 rounded-xl bg-[#0a4d4d] px-7 text-[15px] font-semibold text-white hover:bg-[#083838]"
            >
              <Link href="/contact">Book Clinic Appointment</Link>
            </Button>
            <Button
              type="button"
              asChild
              variant="outline"
              className="h-12 rounded-xl border-2 border-[#0a4d4d] bg-transparent px-7 text-[15px] font-semibold text-[#0a4d4d] hover:bg-[#0a4d4d]/5"
            >
              <Link href="/auth?mode=signup">Online Appointment</Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[440px] lg:mx-0 lg:max-w-none">
          <div className="rounded-[28px] bg-[#0a4d4d] p-3 shadow-card md:rounded-[32px] md:p-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] md:aspect-[3/4] md:rounded-[26px]">
              <Image
                src={HERO_IMG}
                alt="Kinex clinician in lab coat"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 480px"
                priority
              />
            </div>
          </div>

          <div className="absolute -bottom-2 left-4 right-auto z-10 max-w-[240px] rounded-2xl border border-black/[0.06] bg-white p-4 shadow-card md:left-6 md:bottom-4 md:max-w-[260px] md:p-5">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0a4d4d] text-white">
                <Check className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0a4d4d]">
                  Accredited Excellence
                </p>
                <p className="mt-1 text-[13px] font-medium leading-snug text-[#5c6570]">
                  Global Health Certified
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
