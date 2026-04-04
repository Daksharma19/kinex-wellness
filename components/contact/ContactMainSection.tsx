"use client";

import { useState } from "react";
import { Asterisk, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { KINEX_LOCATION } from "@/lib/contact";

import { ContactMap } from "./ContactMap";
import { OpenMapsButton } from "./OpenMapsButton";

const fieldLabel =
  "text-xs font-bold uppercase tracking-wide text-kinex-on-surface-variant";

export function ContactMainSection() {
  const [department, setDepartment] = useState("general");

  return (
    <section className="bg-[#eef1f3] py-16 md:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)] lg:items-start lg:gap-12 lg:px-8">
        <div className="rounded-2xl bg-white p-8 shadow-card ring-1 ring-kinex-outline/10 md:p-10">
          <h2 className="text-2xl font-bold text-kinex-primary md:text-[26px]">
            Send a Message
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-kinex-on-surface-variant">
            Please fill out the form below. Our response time is typically under
            24 hours during business days.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            <div>
              <label htmlFor="contact-name" className={fieldLabel}>
                Full name
              </label>
              <Input
                id="contact-name"
                name="name"
                autoComplete="name"
                placeholder="Enter your name"
                className="mt-2 h-11 rounded-lg border-kinex-outline/25 bg-kinex-surface-low"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className={fieldLabel}>
                Email address
              </label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className="mt-2 h-11 rounded-lg border-kinex-outline/25 bg-kinex-surface-low"
              />
            </div>
            <div>
              <span id="contact-dept-label" className={fieldLabel}>
                Department
              </span>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger
                  aria-labelledby="contact-dept-label"
                  className="mt-2 h-11 rounded-lg border-kinex-outline/25 bg-kinex-surface-low"
                >
                  <SelectValue placeholder="General Support" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Support</SelectItem>
                  <SelectItem value="billing">Billing &amp; Claims</SelectItem>
                  <SelectItem value="partnerships">Partnerships</SelectItem>
                  <SelectItem value="technical">Technical Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="contact-message" className={fieldLabel}>
                Your message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder="How can we help you today?"
                className={cn(
                  "mt-2 flex w-full resize-y rounded-lg border border-kinex-outline/25 bg-kinex-surface-low px-3 py-2.5 text-sm text-kinex-on-surface placeholder:text-kinex-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinex-primary focus-visible:ring-offset-0"
                )}
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-kinex-primary text-[15px] font-semibold text-white hover:bg-kinex-container"
            >
              <Send className="h-4 w-4" />
              Send Message
            </Button>
          </form>
        </div>

        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-kinex-outline/10">
            <div className="overflow-hidden rounded-t-2xl">
              <ContactMap lat={KINEX_LOCATION.lat} lng={KINEX_LOCATION.lng} />
            </div>
            <p className="px-5 pt-3 text-center text-[11px] tabular-nums text-kinex-muted">
              {Math.abs(KINEX_LOCATION.lat).toFixed(6)}°{" "}
              {KINEX_LOCATION.lat >= 0 ? "N" : "S"},{" "}
              {Math.abs(KINEX_LOCATION.lng).toFixed(6)}°{" "}
              {KINEX_LOCATION.lng >= 0 ? "E" : "W"}
            </p>
            <div className="flex flex-col gap-4 p-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-kinex-primary">
                  {KINEX_LOCATION.shortLabel}
                </p>
              </div>
              <OpenMapsButton
                lat={KINEX_LOCATION.lat}
                lng={KINEX_LOCATION.lng}
                label={KINEX_LOCATION.shortLabel}
                className="shrink-0 rounded-lg border border-kinex-outline/30 bg-kinex-surface-low px-4 py-2 text-sm font-semibold text-kinex-on-surface-variant transition-colors hover:border-kinex-outline/50 hover:bg-white"
              >
                Open Maps
              </OpenMapsButton>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-7 shadow-card ring-1 ring-kinex-outline/10 md:p-8">
            <h3 className="text-lg font-bold text-kinex-primary">
              Clinical Hours
            </h3>
            <ul className="mt-5 space-y-3 text-[15px] text-kinex-on-surface-variant">
              <li className="flex justify-between gap-4 border-b border-kinex-outline/15 pb-3">
                <span className="text-kinex-muted">Monday — Friday</span>
                <span className="font-medium text-kinex-on-surface">
                  08:00 — 20:00
                </span>
              </li>
              <li className="flex justify-between gap-4 border-b border-kinex-outline/15 pb-3">
                <span className="text-kinex-muted">Saturday</span>
                <span className="font-medium text-kinex-on-surface">
                  09:00 — 16:00
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-kinex-muted">Sunday</span>
                <span className="font-semibold text-red-600">
                  Emergency Only
                </span>
              </li>
            </ul>
            <div className="mt-6 flex gap-3 rounded-xl bg-kinex-badge/80 p-4 text-sm leading-relaxed text-kinex-on-surface-variant">
              <Asterisk
                className="mt-0.5 h-4 w-4 shrink-0 text-kinex-primary"
                strokeWidth={2.5}
              />
              <p>
                For medical emergencies after hours, please contact 911 or visit
                your nearest emergency room immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
