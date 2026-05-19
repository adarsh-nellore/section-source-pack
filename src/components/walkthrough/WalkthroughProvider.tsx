"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Cluster } from "@/components/layout/Cluster";
import { Stack } from "@/components/layout/Stack";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Heading } from "@/components/typography/Heading";
import { Body } from "@/components/typography/Body";
import { MetaText } from "@/components/ui/MetaText";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { Glyph } from "@/components/ui/Glyph";
import {
  WALKTHROUGH_STEPS,
  WALKTHROUGH_STORAGE_KEY,
  clearTourSession,
  currentTourPath,
  isSameTourLocation,
  readTourSession,
  resolveTourStepIndex,
  writeTourSession,
  type WalkthroughStep,
} from "@/lib/walkthrough-steps";

type WalkthroughContextValue = {
  active: boolean;
  stepIndex: number;
  startTour: () => void;
  endTour: () => void;
};

const WalkthroughContext = createContext<WalkthroughContextValue | null>(null);

export function useWalkthrough() {
  const ctx = useContext(WalkthroughContext);
  if (!ctx) throw new Error("useWalkthrough must be used within WalkthroughProvider");
  return ctx;
}

function TourCard({
  step,
  index,
  total,
  onPrev,
  onNext,
  onSkip,
}: {
  step: WalkthroughStep;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const isLast = index === total - 1;
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      key={step.id}
      role="dialog"
      aria-label={`Tour: ${step.title}`}
      aria-expanded={expanded}
      className="walkthrough-card fixed bottom-6 right-6 z-[90] w-[min(300px,calc(100vw-1.5rem))] rounded-lg border border-hairline-strong bg-paper shadow-walkthrough overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <Stack gap="tight" className="p-3">
        <Cluster gap="cozy" align="center" justify="between" wrap={false}>
          <Cluster gap="tight" align="center" wrap={false} className="min-w-0 flex-1">
            <Glyph name="sparkle" size={14} className="text-coral shrink-0" />
            <MetaText size="sm" tone="faint" className="shrink-0">
              {index + 1}/{total}
            </MetaText>
            {!expanded && (
              <Heading size="h4" className="text-[14px] truncate min-w-0">
                {step.title}
              </Heading>
            )}
          </Cluster>
          <Cluster gap="tight" align="center" wrap={false}>
            {expanded && (
              <ProgressDots total={total} current={index + 1} connector={false} />
            )}
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              aria-label={expanded ? "Collapse tour" : "Expand tour"}
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              <Glyph name={expanded ? "chev" : "chev-up"} size={14} />
            </IconButton>
          </Cluster>
        </Cluster>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <Stack gap="cozy" className="pt-1">
                <Heading size="h4">{step.title}</Heading>
                <Body size="small" tone="muted">
                  {step.body}
                </Body>
                <Cluster gap="cozy" justify="between" align="center">
                  <button
                    type="button"
                    className="text-[12px] text-muted hover:text-ink transition-colors"
                    onClick={onSkip}
                  >
                    Skip tour
                  </button>
                  <Cluster gap="tight" wrap={false}>
                    <Button variant="ghost" size="sm" disabled={index === 0} onClick={onPrev}>
                      Back
                    </Button>
                    <Button variant="primary" size="sm" onClick={onNext}>
                      {isLast ? "Done" : "Next"}
                    </Button>
                  </Cluster>
                </Cluster>
              </Stack>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <Cluster gap="tight" justify="end" wrap={false} className="pt-0.5">
                <Button variant="ghost" size="sm" disabled={index === 0} onClick={onPrev}>
                  Back
                </Button>
                <Button variant="primary" size="sm" onClick={onNext}>
                  {isLast ? "Done" : "Next"}
                </Button>
              </Cluster>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
    </motion.div>
  );
}

export function WalkthroughProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [pillVisible, setPillVisible] = useState(false);
  const hydrated = useRef(false);

  const step = WALKTHROUGH_STEPS[stepIndex];

  const beginTour = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), WALKTHROUGH_STEPS.length - 1);
      setPillVisible(false);
      setStepIndex(clamped);
      setActive(true);
      writeTourSession(clamped);
    },
    []
  );

  // Bootstrap pill / resume in-progress tour (once, then respect session).
  useEffect(() => {
    const session = readTourSession();
    if (session) {
      setActive(true);
      setStepIndex(session.stepIndex);
      setPillVisible(false);
      hydrated.current = true;
      return;
    }

    if (hydrated.current && active) return;

    const dismissed =
      typeof window !== "undefined" && window.localStorage.getItem(WALKTHROUGH_STORAGE_KEY);
    const tourParam = searchParams.get("tour");

    if (tourParam === "1") {
      beginTour(resolveTourStepIndex(pathname));
      hydrated.current = true;
      return;
    }

    if (!dismissed) setPillVisible(true);
    hydrated.current = true;
  }, [searchParams, pathname, active, beginTour]);

  useEffect(() => {
    if (active) writeTourSession(stepIndex);
  }, [active, stepIndex]);

  useEffect(() => {
    if (!active || !step) return;
    const current = currentTourPath(pathname, searchParams.toString());
    if (isSameTourLocation(current, step.href)) return;

    const t = window.setTimeout(() => {
      router.push(step.href, { scroll: false });
    }, 80);
    return () => window.clearTimeout(t);
  }, [active, stepIndex, step, pathname, searchParams, router]);

  useEffect(() => {
    if (!active || !step?.target) return;
    const el = document.querySelector(`[data-wt="${step.target}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth", inline: "nearest" });
    el?.classList.add("walkthrough-spotlight");
    return () => el?.classList.remove("walkthrough-spotlight");
  }, [active, step?.target, stepIndex]);

  const startTour = useCallback(() => {
    beginTour(resolveTourStepIndex(pathname));
  }, [beginTour, pathname]);

  const endTour = useCallback(() => {
    setActive(false);
    clearTourSession();
    if (typeof window !== "undefined") {
      window.localStorage.setItem(WALKTHROUGH_STORAGE_KEY, "1");
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tour");
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    setPillVisible(false);
  }, [pathname, router, searchParams]);

  const go = useCallback(
    (next: number) => {
      if (next >= WALKTHROUGH_STEPS.length) {
        endTour();
        return;
      }
      if (next < 0) return;
      setStepIndex(next);
    },
    [endTour]
  );

  const value = useMemo(
    () => ({ active, stepIndex, startTour, endTour }),
    [active, stepIndex, startTour, endTour]
  );

  return (
    <WalkthroughContext.Provider value={value}>
      {children}

      {!active && pillVisible && (
        <motion.button
          type="button"
          className="fixed bottom-6 right-6 z-[80] flex items-center gap-2 rounded-pill border border-hairline-strong bg-paper px-3.5 py-2 shadow-walkthrough text-[13px] font-medium text-ink"
          onClick={startTour}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.35 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Glyph name="sparkle" size={16} className="text-coral" />
          Take the tour
        </motion.button>
      )}

      <AnimatePresence>
        {active && step && (
          <TourCard
            step={step}
            index={stepIndex}
            total={WALKTHROUGH_STEPS.length}
            onPrev={() => go(stepIndex - 1)}
            onNext={() => go(stepIndex + 1)}
            onSkip={endTour}
          />
        )}
      </AnimatePresence>
    </WalkthroughContext.Provider>
  );
}
