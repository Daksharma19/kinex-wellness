import Image from "next/image";
import { HeartPulse } from "lucide-react";
import drMaheshwar from "@/assets/images/dr-maheshwar.jpg";
export function Team() {
  return (
    <section
      id="aboutus"
      className="scroll-mt-[88px] bg-kinex-surface px-6 py-12 lg:px-8 lg:py-16"
    >
      <div className="mx-auto grid max-w-[1200px] items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative mx-auto w-full max-w-[400px] lg:mx-0">
          <div className="overflow-hidden rounded-2xl shadow-card ring-1 ring-kinex-outline/10">
            <Image
              src={drMaheshwar}
              alt="Dr. Maheshvar Prajapati, senior consultant in white coat"
              width={440}
              height={440}
              className="h-auto w-full object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 400px"
            />
          </div>
          <div className="absolute -bottom-3 left-4 rounded-lg bg-kinex-primary px-4 py-2 shadow-ambient">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/90">
              EXPERIENCE
            </p>
            <p className="text-base font-bold text-white">15+ Years</p>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-kinex-muted">
            Senior Consultant
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-kinex-on-surface md:text-[1.85rem] md:leading-tight">
            Dr. Maheshvar Prajapati
          </h2>
          {/* <p className="mt-6 text-lg italic leading-relaxed text-kinex-on-surface-variant md:text-xl">
            &ldquo;Movement is medicine. Our goal is to restore not just function,
            but the confidence to live fully without limits.&rdquo;
          </p> */}
          <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-kinex-on-surface-variant">
            <p>
              Dr. Prajapati leads Kinex&apos;s musculoskeletal and performance
              medicine programs, blending evidence-based orthopedics with
              individualized rehabilitation plans. His practice emphasizes early,
              accurate diagnosis—whether for elite athletes or patients returning
              to everyday activity after injury.
            </p>
            <p>
              He believes recovery is as much about education and trust as it is
              about procedure. By coordinating closely with physical therapy,
              nutrition, and primary care teams, he ensures each patient understands
              their path forward and feels supported at every milestone.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
            {/* <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-kinex-on-surface">
              <Activity
                className="h-5 w-5 shrink-0 text-kinex-primary"
                aria-hidden
              />
              <span>
                <span className="text-kinex-muted">SPECIALIZATION: </span>
                Sports Medicine
              </span>
            </div> */}
            <div className="flex items-center gap-3  text-sm font-semibold uppercase tracking-wide text-kinex-on-surface">
              <HeartPulse
                className="h-5 w-5 shrink-0 text-kinex-primary"
                aria-hidden
              />
              <span>
                <span className="text-kinex-muted">FOLLOW BY: </span>
                Patient First
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
