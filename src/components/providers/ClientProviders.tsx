"use client";

import { Suspense, type ReactNode } from "react";
import { WalkthroughProvider } from "@/components/walkthrough/WalkthroughProvider";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <WalkthroughProvider>{children}</WalkthroughProvider>
    </Suspense>
  );
}
