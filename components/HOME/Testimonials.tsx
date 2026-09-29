"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Star,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { testimonials } from "@/data/products";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback((next: number) => {
    setDirection(next > 0 ? 1 : -1);

    setIndex(
      (currentIndex) =>
        (currentIndex +
          next +
          testimonials.length) %
        testimonials.length,
    );
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(
      () => go(1),
      7000,
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [go]);

  if (testimonials.length === 0) {
    return null;
  }

  const testimonial =
    testimonials[index] ?? testimonials[0];

  return (
    <section className="bg-silk/40">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-8 lg:py-28">
        <p className="eyebrow">Client Stories</p>

        <div className="relative mt-10 min-h-[240px] sm:min-h-[210px]">
          <AnimatePresence
            mode="wait"
            custom={direction}
          >
            <motion.figure
              key={testimonial.id}
              initial={{
                opacity: 0,
                y: 18,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -12,
                filter: "blur(8px)",
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className="flex justify-center gap-1"
                aria-label={`${testimonial.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map(
                  (_, starIndex) => (
                    <Star
                      key={starIndex}
                      className={
                        starIndex <
                        testimonial.rating
                          ? "size-3.5 fill-gold text-gold"
                          : "size-3.5 text-border"
                      }
                      strokeWidth={1}
                    />
                  ),
                )}
              </div>

              <blockquote className="mt-7 font-display text-[clamp(1.4rem,3vw,2.15rem)] leading-snug">
                “{testimonial.quote}”
              </blockquote>

              <figcaption className="mt-7 flex flex-wrap items-center justify-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>{testimonial.name}</span>

                <span aria-hidden="true">·</span>

                <span>{testimonial.location}</span>

                {testimonial.verified && (
                  <span className="flex items-center gap-1.5 text-gold-deep">
                    <BadgeCheck
                      className="size-3.5"
                      strokeWidth={1.4}
                    />

                    Verified buyer
                  </span>
                )}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {testimonials.length > 1 && (
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => go(-1)}
              className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-gold-deep"
            >
              <ArrowLeft
                className="size-4"
                strokeWidth={1.2}
              />
            </button>

            <div className="flex gap-2">
              {testimonials.map(
                (item, itemIndex) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Go to testimonial ${itemIndex + 1}`}
                    aria-current={
                      itemIndex === index
                        ? "true"
                        : undefined
                    }
                    onClick={() => {
                      setDirection(
                        itemIndex > index ? 1 : -1,
                      );
                      setIndex(itemIndex);
                    }}
                    className={
                      itemIndex === index
                        ? "h-px w-8 bg-gold-deep transition-all"
                        : "h-px w-8 bg-border transition-all"
                    }
                  />
                ),
              )}
            </div>

            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => go(1)}
              className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-gold-deep"
            >
              <ArrowRight
                className="size-4"
                strokeWidth={1.2}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}