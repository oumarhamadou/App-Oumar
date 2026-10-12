import { cn } from "@/lib/cn";

/** Prism mark: one beam in, three domains out (IA, économie, finance). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("h-7 w-7", className)}>
      <rect width="32" height="32" rx="9" className="fill-ink" />
      <path d="M5 16.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-page/70" />
      <path d="M13 9.5 20.5 23h-15z" className="fill-page" />
      <path d="m17.6 13.2 9.4-3.2" strokeWidth="1.8" strokeLinecap="round" className="stroke-domain-ia" />
      <path d="M18.6 15.6h8.6" strokeWidth="1.8" strokeLinecap="round" className="stroke-domain-eco" />
      <path d="m19.6 18 7.6 3.4" strokeWidth="1.8" strokeLinecap="round" className="stroke-domain-fin" />
    </svg>
  );
}
