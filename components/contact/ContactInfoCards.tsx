"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, AtSign, Phone, PhoneCall } from "lucide-react";

import { KINEX_CONTACT, KINEX_LOCATION } from "@/lib/contact";
import { cn } from "@/lib/utils";

import { OpenMapsButton } from "./OpenMapsButton";

function IconTile({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ContactInfoCards() {
  return (
    <div className="mx-auto grid max-w-[1200px] gap-6 px-6 md:grid-cols-3 lg:px-8">
      <article className="flex flex-col rounded-2xl bg-white p-7 shadow-card ring-1 ring-kinex-outline/10 md:p-8">
        <IconTile className="bg-kinex-primary text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="10" y="4" width="4" height="16" rx="0.5" fill="currentColor" />
            <rect x="4" y="10" width="16" height="4" rx="0.5" fill="currentColor" />
          </svg>
        </IconTile>
        <h3 className="mt-5 text-lg font-bold text-kinex-primary">Our Clinic</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-kinex-on-surface-variant">
          {KINEX_LOCATION.street}, {KINEX_LOCATION.city}
        </p>
        <OpenMapsButton
          lat={KINEX_LOCATION.lat}
          lng={KINEX_LOCATION.lng}
          label={KINEX_LOCATION.shortLabel}
          className="mt-5 inline-flex items-center gap-2 self-start text-sm font-semibold text-kinex-primary transition-colors hover:text-kinex-container"
        >
          Get Directions
          <ArrowRight className="h-4 w-4" />
        </OpenMapsButton>
      </article>

      <article className="flex flex-col rounded-2xl bg-white p-7 shadow-card ring-1 ring-kinex-outline/10 md:p-8">
        <IconTile className="bg-kinex-badge text-kinex-primary">
          <Phone className="h-6 w-6" strokeWidth={2} />
        </IconTile>
        <h3 className="mt-5 text-lg font-bold text-kinex-primary">
          Phone Support
        </h3>
        <p className="mt-3 space-y-1 text-[15px] leading-relaxed text-kinex-on-surface-variant">
          <span className="block">
            General Inquiries:{" "}
            <Link
              href={`tel:${KINEX_CONTACT.phones.generalTel}`}
              className="font-medium text-kinex-on-surface hover:text-kinex-primary"
            >
              {KINEX_CONTACT.phones.general}
            </Link>
          </span>
          <span className="block">
            Patient Care:{" "}
            <Link
              href={`tel:${KINEX_CONTACT.phones.patientTel}`}
              className="font-medium text-kinex-on-surface hover:text-kinex-primary"
            >
              {KINEX_CONTACT.phones.patient}
            </Link>
          </span>
        </p>
        <Link
          href={`tel:${KINEX_CONTACT.phones.generalTel}`}
          className="mt-5 inline-flex items-center gap-2 self-start text-sm font-semibold text-kinex-primary transition-colors hover:text-kinex-container"
        >
          Call Now
          <PhoneCall className="h-4 w-4" />
        </Link>
      </article>

      <article className="flex flex-col rounded-2xl bg-white p-7 shadow-card ring-1 ring-kinex-outline/10 md:p-8">
        <IconTile className="bg-kinex-badge text-kinex-primary">
          <AtSign className="h-6 w-6" strokeWidth={2} />
        </IconTile>
        <h3 className="mt-5 text-lg font-bold text-kinex-primary">Email Us</h3>
        <p className="mt-3 space-y-1 text-[15px] leading-relaxed text-kinex-on-surface-variant">
          <span className="block">
            Support:{" "}
            <Link
              href={`mailto:${KINEX_CONTACT.emails.support}`}
              className="font-medium text-kinex-on-surface hover:text-kinex-primary"
            >
              {KINEX_CONTACT.emails.support}
            </Link>
          </span>
          <span className="block">
            Business:{" "}
            <Link
              href={`mailto:${KINEX_CONTACT.emails.business}`}
              className="font-medium text-kinex-on-surface hover:text-kinex-primary"
            >
              {KINEX_CONTACT.emails.business}
            </Link>
          </span>
        </p>
        <Link
          href={`mailto:${KINEX_CONTACT.emails.support}`}
          className="mt-5 inline-flex items-center gap-2 self-start text-sm font-semibold text-kinex-primary transition-colors hover:text-kinex-container"
        >
          Send Email
          <SendPlaneIcon />
        </Link>
      </article>
    </div>
  );
}

function SendPlaneIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}
