import type { Transition } from "framer-motion";

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.22, ease: "easeOut" } satisfies Transition,
};

export const slideUp = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: 6 },
  transition: { duration: 0.28, ease: "easeOut" } satisfies Transition,
};

export const stagger = (index: number, base = 0.06) => ({
  ...fadeIn,
  transition: { ...fadeIn.transition, delay: index * base },
});

export const pulse = {
  animate: { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] },
  transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } satisfies Transition,
};
