import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Scrolls so a pinned (sticky) section shows the given point of its scroll range, 0–1.
export function scrollToSectionProgress(section: HTMLElement | null, progress: number) {
  if (!section) return
  const top = section.getBoundingClientRect().top + window.scrollY
  const range = section.offsetHeight - window.innerHeight
  window.scrollTo({ top: top + range * progress, behavior: 'smooth' })
}
