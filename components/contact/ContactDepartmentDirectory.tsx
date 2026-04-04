import Link from "next/link";
import { ExternalLink } from "lucide-react";

const departments = [
  {
    n: "01",
    title: "Appointments",
    body: "Schedule, reschedule, or cancel your consultations.",
  },
  {
    n: "02",
    title: "Billing & Claims",
    body: "Inquiries regarding insurance coverage and payments.",
  },
  {
    n: "03",
    title: "Media Relations",
    body: "Press kits, interview requests, and brand assets.",
  },
  {
    n: "04",
    title: "Tech Support",
    body: "Help with the patient portal or mobile application.",
  },
];

export function ContactDepartmentDirectory() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-kinex-primary">
              Specialized Assistance
            </p>
            <h2 className="mt-2 text-3xl font-bold text-kinex-primary md:text-4xl">
              Department Directory
            </h2>
          </div>
          <p className="max-w-xl text-[15px] leading-relaxed text-kinex-on-surface-variant lg:text-right">
            Find the right department to ensure your inquiry is handled by the
            appropriate clinical specialist.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((d) => (
            <article
              key={d.n}
              className="relative flex flex-col rounded-2xl border border-kinex-outline/15 bg-kinex-surface-alt p-7 shadow-sm transition-shadow hover:shadow-card"
            >
              <span
                className="text-5xl font-bold leading-none text-kinex-outline/25"
                aria-hidden
              >
                {d.n}
              </span>
              <h3 className="mt-4 text-lg font-bold text-kinex-primary">
                {d.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-kinex-on-surface-variant">
                {d.body}
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-kinex-primary transition-colors hover:text-kinex-container"
              >
                Contact Dept
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
