import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const services = [
  {
    title: "Pain Relief & Signal Interception",
    description:
      "Using carefully calibrated electrical frequencies, our electrotherapy sessions gently intercept pain signals before they reach the brain—delivering immediate, drug-free relief for chronic and acute conditions without invasive procedures.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
    alt: "Electrotherapy electrode pads applied to a patient's back for pain relief",
  },
  {
    title: "Muscle Recovery & Re-education",
    description:
      "Targeted electrical stimulation re-educates inactive muscles, reduces painful spasms, and actively prevents muscle loss during rehabilitation—restoring natural movement patterns and accelerating your return to full function.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    alt: "Physiotherapist administering muscle stimulation therapy on a patient's leg",
  },
  {
    title: "Cellular Healing & Inflammation Reduction",
    description:
      "By boosting localised blood circulation and calming inflammatory responses, our electrotherapy protocols speak your body's native electrical language—accelerating tissue repair at the cellular level so you heal faster, naturally.",
    image:
      "/assets/images/leg-therapy.jpg",
    alt: "Advanced electrotherapy device delivering treatment to a patient's knee",
  },
];
export function Services() {
  return (
    <section
      id="solutions"
      className="bg-white px-6 py-20 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-[-0.02em] text-kinex-on-surface md:text-[2.25rem] md:leading-tight">
              Comprehensive Care Built Around You.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-kinex-on-surface-variant">
              Our clinical departments are led by world-class practitioners using
              the latest medical technologies to deliver precise, coordinated care
              at every step of your journey.
            </p>
          </div>
          
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {services.map((s) => (
            <article
              key={s.title}
              className="group overflow-hidden rounded-2xl bg-white shadow-ambient ring-1 ring-kinex-outline/10 transition-shadow hover:shadow-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-6 pt-5">
                <h3 className="text-lg font-bold text-kinex-on-surface">
                  {s.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-kinex-on-surface-variant">
                  {s.description}
                </p>
                <Link
                  href="#service"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-kinex-primary hover:text-kinex-container"
                >
                  Learn more
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
