import { cn } from "@/lib/utils";

export function Wordmark({ className }) {
  return (
    <span
      className={cn(
        "font-display text-2xl leading-none tracking-[0.32em] uppercase select-none",
        className,
      )}
    >
      Flāmorá
    </span>
  );
}