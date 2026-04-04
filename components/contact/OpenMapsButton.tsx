"use client";

import type { ReactNode } from "react";

import { openInNativeMapsApp } from "@/lib/open-native-maps";

type OpenMapsButtonProps = {
  lat: number;
  lng: number;
  label: string;
  className?: string;
  children: ReactNode;
};

export function OpenMapsButton({
  lat,
  lng,
  label,
  className,
  children,
}: OpenMapsButtonProps) {
  return (
    <button
      type="button"
      onClick={() => openInNativeMapsApp(lat, lng, label)}
      className={className}
    >
      {children}
    </button>
  );
}
