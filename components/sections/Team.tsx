import Image from "next/image";
import { Activity, HeartPulse } from "lucide-react";
import drMaheshwar from "@/assets/images/dr-maheshwar.jpg";
export function Team() {
  return (
    <section className="bg-kinex-surface px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative mx-auto w-full max-w-[520px] lg:mx-0">
          <div className="overflow-hidden rounded-3xl shadow-card ring-1 ring-kinex-outline/10">
            <Image
              src={drMaheshwar}
              alt="Dr. Maheshvar Prajapati, senior consultant in white coat"
              width={560}
              height={560}
              className="h-auto w-full object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="absolute -bottom-4 left-6 rounded-xl bg-kinex-primary px-5 py-3 shadow-ambient">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/90">
              EXPERIENCE
            </p>
            <p className="text-lg font-bold text-white">15+ Years</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-kinex-muted">
            Senior Consultant
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-kinex-on-surface md:text-[2.35rem] md:leading-tight">
            Dr. Maheshvar Prajapati
          </h2>
          {/* <p className="mt-6 text-lg italic leading-relaxed text-kinex-on-surface-variant md:text-xl">
            &ldquo;Movement is medicine. Our goal is to restore not just function,
            but the confidence to live fully without limits.&rdquo;
          </p> */}
          <div className="mt-8 space-y-5 text-[16px] leading-relaxed text-kinex-on-surface-variant">
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
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-10">
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
