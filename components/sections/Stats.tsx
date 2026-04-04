const items = [
  { value: "99%", label: "Patient Satisfaction" },
  { value: "15k+", label: "Staff Professionals" },
  { value: "24/7", label: "Available Assistant" },
  { value: "120+", label: "Medical Specialized" },
];

export function Stats() {
  return (
    <section className="bg-kinex-surface-alt px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-3xl font-bold tracking-tight text-kinex-on-surface md:text-[2rem]">
              {item.value}
            </p>
            <p className="mt-2 text-sm font-medium text-kinex-muted md:text-[15px]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
