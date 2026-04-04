/**
 * Opens coordinates in the user's default maps experience where possible:
 * Apple Maps on iOS, geo: intent on Android, Google Maps in a new tab elsewhere.
 */
export function openInNativeMapsApp(
  lat: number,
  lng: number,
  label: string
): void {
  const encoded = encodeURIComponent(label);
  const ua =
    typeof navigator !== "undefined" ? navigator.userAgent || "" : "";

  if (/iPhone|iPad|iPod/i.test(ua)) {
    window.open(
      `https://maps.apple.com/?ll=${lat},${lng}&q=${encoded}`,
      "_blank",
      "noopener,noreferrer"
    );
    return;
  }

  if (/Android/i.test(ua)) {
    window.location.href = `geo:${lat},${lng}?q=${lat},${lng}(${encoded})`;
    return;
  }

  window.open(
    `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    "_blank",
    "noopener,noreferrer"
  );
}
