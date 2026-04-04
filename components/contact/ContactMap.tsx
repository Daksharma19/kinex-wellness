"use client";

import dynamic from "next/dynamic";

const ContactMapInner = dynamic(
  () =>
    import("./ContactMapInner").then((m) => ({ default: m.ContactMapInner })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(320px,55vw)] min-h-[240px] w-full items-center justify-center rounded-xl bg-kinex-surface-low md:h-[300px]">
        <p className="text-sm text-kinex-muted">Loading map…</p>
      </div>
    ),
  }
);

export function ContactMap({ lat, lng }: { lat: number; lng: number }) {
  return <ContactMapInner lat={lat} lng={lng} />;
}
