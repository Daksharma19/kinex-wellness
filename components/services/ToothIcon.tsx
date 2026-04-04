/** Simple tooth icon for dental service card (Lucide has no tooth). */
export function ToothIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 2C9.5 2 8 3.8 8 6.2V8c0 .8-.3 1.5-.8 2.1L6 12.5c-.4.7-.6 1.5-.6 2.3V19c0 1.7 1.3 3 3 3h1.2c.8 0 1.5-.5 1.8-1.2l.5-1.2c.3-.8 1.3-.8 1.6 0l.5 1.2c.3.7 1 1.2 1.8 1.2H17c1.7 0 3-1.3 3-3v-4.2c0-.8-.2-1.6-.6-2.3L16.8 10c-.5-.6-.8-1.3-.8-2.1V6.2C16 3.8 14.5 2 12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
