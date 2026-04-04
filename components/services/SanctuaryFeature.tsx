import Image from "next/image";
import { Check } from "lucide-react";

const ROOM_IMG =
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=960&q=85";

const bullets = [
  "Reduced Wait Times Through Smart Scheduling",
  "Private, Sound-Proof Consultation Suites",
  "Direct Digital Access to Your Medical Reports",
];

export function SanctuaryFeature() {
  return (
    <section className="bg-white px-6 py-16 md:py-20 lg:px-8">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] shadow-card md:aspect-[5/4] md:rounded-[32px] lg:aspect-auto lg:min-h-[420px]">
          <Image
            src={ROOM_IMG}
            alt="Modern Kinex consultation suite"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        </div>

        <div>
          <h2 className="font-display text-[1.85rem] font-semibold leading-tight tracking-tight text-[#0a4d4d] md:text-4xl">
            A Sanctuary Designed For Your Healing.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-[#5c6570] md:text-[17px]">
            We believe that the environment is just as important as the medicine.
            Our clinics are designed as retreats, minimizing stress to maximize
            recovery.
          </p>
          <ul className="mt-8 space-y-4">
            {bullets.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0a4d4d] text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-[15px] font-medium leading-snug text-[#3d454d] md:text-[16px]">
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
