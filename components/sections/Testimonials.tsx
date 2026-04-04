import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "From my first consult to follow-up, every clinician took time to explain my options. I felt heard, not rushed—and my recovery exceeded what I expected.",
    name: "Jonathan Reiss",
    role: "Cardiology Patient",
  },
  {
    quote:
      "Kinex coordinated imaging, surgery, and rehab in one calm, organized flow. The attention to detail made a stressful season feel manageable.",
    name: "Elena Marquez",
    role: "Orthopedic Patient",
  },
  {
    quote:
      "The team treated my daughter with patience and clarity. We always knew the next step, and the pediatric nurses were extraordinary.",
    name: "David Chen",
    role: "Pediatrics Family",
  },
];

function Stars() {
  return (
    <div className="flex gap-1" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 fill-kinex-primary text-kinex-primary"
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-kinex-surface-alt px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px flex-1 max-w-[120px] bg-kinex-outline/25" />
          <h2 className="text-center text-2xl font-bold tracking-[-0.02em] text-kinex-on-surface md:text-[1.75rem]">
            Trust from our Patients
          </h2>
          <span className="h-px flex-1 max-w-[120px] bg-kinex-outline/25" />
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-8">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="flex flex-col rounded-2xl bg-white p-8 shadow-ambient ring-1 ring-kinex-outline/10"
            >
              <Stars />
              <p className="mt-5 flex-1 text-[16px] italic leading-relaxed text-kinex-on-surface-variant">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div
                  className="h-11 w-11 shrink-0 rounded-full bg-kinex-surface-low ring-1 ring-kinex-outline/15"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-bold text-kinex-on-surface">
                    {t.name}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wide text-kinex-muted">
                    {t.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
