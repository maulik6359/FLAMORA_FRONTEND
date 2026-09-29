import { PackageCheck, ShieldCheck, RotateCcw } from "lucide-react";

const items = [
  { icon: PackageCheck, label: "Complimentary insured shipping Australia-wide" },
  { icon: ShieldCheck, label: "Secure checkout · Certified stones" },
  { icon: RotateCcw, label: "30-day easy returns" },
];

export function AnnouncementBar() {
  return (
    <div className="relative z-50 bg-ink text-ivory">
      <div className="mx-auto flex max-w-[1600px] items-center justify-center gap-8 px-4 py-2.5 text-[10px] tracking-[0.22em] uppercase sm:text-[11px]">
        {items.map(({ icon: Icon, label }, i) => (
          <span
            key={label}
            className={
              i === 0
                ? "flex items-center gap-2"
                : "hidden items-center gap-2 md:flex"
            }
          >
            <Icon className="size-3.5 text-gold" strokeWidth={1.4} aria-hidden />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}