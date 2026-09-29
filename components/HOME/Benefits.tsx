import {
  Award,
  CreditCard,
  RotateCcw,
  Truck,
} from "lucide-react";

import {
  Stagger,
  StaggerItem,
} from "@/components/motion/Reveal";

const benefits = [
  {
    icon: Truck,
    title: "Complimentary shipping",
    body: "Insured, tracked delivery on every Australian order.",
  },
  {
    icon: Award,
    title: "Certified materials",
    body: "GIA certification and full traceability on every stone.",
  },
  {
    icon: CreditCard,
    title: "Secure payments",
    body: "Encrypted checkout with Afterpay and Klarna available.",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    body: "Thirty days to change your mind, resizing included.",
  },
];

export function Benefits() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 lg:py-24">
      <Stagger className="grid gap-10 border-y border-border py-12 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(
          ({ icon: Icon, title, body }) => (
            <StaggerItem key={title}>
              <Icon
                className="size-6 text-gold-deep"
                strokeWidth={0.9}
                aria-hidden="true"
              />

              <h3 className="mt-5 font-display text-xl">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </StaggerItem>
          ),
        )}
      </Stagger>
    </section>
  );
}