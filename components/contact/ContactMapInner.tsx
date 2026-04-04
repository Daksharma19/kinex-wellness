"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const PIN_HTML = `
<div style="width:44px;height:56px;display:flex;align-items:flex-end;justify-content:center;pointer-events:none;">
  <svg width="44" height="56" viewBox="0 0 44 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M22 54C22 54 3 35.2 3 21C3 10.5 11.5 2 22 2C32.5 2 41 10.5 41 21C41 35.2 22 54 22 54Z" fill="#085F63"/>
    <rect x="19" y="13" width="6" height="16" rx="1" fill="white"/>
    <rect x="14" y="18.5" width="16" height="5" rx="1" fill="white"/>
  </svg>
</div>
`;

export function ContactMapInner({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const map = L.map(el, {
      scrollWheelZoom: false,
      attributionControl: true,
    }).setView([lat, lng], 15);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }
    ).addTo(map);

    const icon = L.divIcon({
      className: "kinex-leaflet-pin",
      html: PIN_HTML,
      iconSize: [44, 56],
      iconAnchor: [22, 56],
    });

    L.marker([lat, lng], { icon }).addTo(map);

    const resize = () => map.invalidateSize();
    requestAnimationFrame(resize);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      map.remove();
    };
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className="z-0 h-[min(320px,55vw)] w-full min-h-[240px] md:h-[300px]"
    />
  );
}
