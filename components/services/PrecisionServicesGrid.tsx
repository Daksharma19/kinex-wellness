import type { ReactNode } from "react";
import Link from "next/link";
import {
  Baby,
  Bone,
  Brain,
  Dumbbell,
  Flower2,
  Heart,
  Microscope,
  Stethoscope,
} from "lucide-react";

import { ToothIcon } from "./ToothIcon";

type ServiceItem = {
  title: string;
  description: string;
  icon: ReactNode;
  iconWrap: string;
};

const services: ServiceItem[] = [
  {
    title: "Advanced Cardiology",
    description:
      "Comprehensive heart health assessments and interventional pathways.",
    icon: <Heart className="h-6 w-6" strokeWidth={2} />,
    iconWrap: "bg-red-500/15 text-red-600",
  },
  {
    title: "Precision Physiotherapy",
    description:
      "Evidence-based movement therapy tailored to your recovery timeline.",
    icon: <Dumbbell className="h-6 w-6" strokeWidth={2} />,
    iconWrap: "bg-teal-100 text-teal-700",
  },
  {
    title: "Dental & Oral Health",
    description:
      "Preventive and restorative dentistry with a gentle, patient-first ethos.",
    icon: <ToothIcon className="h-6 w-6" />,
    iconWrap: "bg-sky-100 text-sky-600",
  },
  {
    title: "General Surgery",
    description:
      "Minimally invasive options and clear pre- and post-operative guidance.",
    icon: <Stethoscope className="h-6 w-6" strokeWidth={2} />,
    iconWrap: "bg-cyan-100 text-cyan-800",
  },
  {
    title: "Pediatrics Care",
    description:
      "Dedicated pathways for growing patients in a calm, reassuring setting.",
    icon: <Baby className="h-6 w-6" strokeWidth={2} />,
    iconWrap: "bg-orange-100 text-orange-600",
  },
  {
    title: "Neurology Services",
    description:
      "Specialist evaluation and long-term support for neurological conditions.",
    icon: <Brain className="h-6 w-6" strokeWidth={2} />,
    iconWrap: "bg-indigo-100 text-indigo-800",
  },
  {
    title: "Diagnostics & Imaging",
    description:
      "High-resolution imaging and rapid reporting integrated with your care team.",
    icon: <Microscope className="h-6 w-6" strokeWidth={2} />,
    iconWrap: "bg-slate-200 text-slate-600",
  },
  {
    title: "Orthopedic Rehabilitation",
    description:
      "Joint, spine, and mobility programs designed to restore strength safely.",
    icon: <Bone className="h-6 w-6" strokeWidth={2} />,
    iconWrap: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Mental Health Support",
    description:
      "Confidential counseling and resilience-focused therapeutic support.",
    icon: <Flower2 className="h-6 w-6" strokeWidth={2} />,
    iconWrap: "bg-rose-100 text-rose-800",
  },
];

export function PrecisionServicesGrid() {
  return (
    <section className="bg-[#f7f7f8] px-6 py-16 md:py-20 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[#0a4d4d] md:text-[2.125rem]">
            Precision-Led Healthcare Services
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-14 rounded-full bg-[#0a4d4d]"
            aria-hidden
          />
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.title}
              className="flex flex-col rounded-2xl border border-black/[0.04] bg-white p-7 shadow-sm transition-shadow hover:shadow-card md:rounded-[20px] md:p-8"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${s.iconWrap}`}
              >
                {s.icon}
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-[#0a4d4d]">
                {s.title}
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#5c6570]">
                {s.description}
              </p>
              <Link
                href="#learn-more"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#0a4d4d] transition-colors hover:text-[#083838]"
              >
                Learn More
                <span aria-hidden className="text-base leading-none">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
