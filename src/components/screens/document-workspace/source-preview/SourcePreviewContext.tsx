"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { SourcePreviewCard } from "./SourcePreviewCard";

const SHOW_MS = 380;
const HIDE_MS = 140;
const CARD_W = 400;
const CARD_H = 440;

type AnchorRect = { left: number; top: number; width: number; height: number };

type PreviewState = {
  sourceId: string;
  anchor: AnchorRect;
};

type HoverHandlers = {
  onPointerEnter: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
};

type SourcePreviewContextValue = {
  bindSource: (sourceId: string) => HoverHandlers;
};

const SourcePreviewContext = createContext<SourcePreviewContextValue | null>(null);

export function useSourcePreview() {
  const ctx = useContext(SourcePreviewContext);
  if (!ctx) throw new Error("useSourcePreview must be used within SourcePreviewProvider");
  return ctx;
}

export function useSourceHoverHandlers(sourceId: string): HoverHandlers {
  return useSourcePreview().bindSource(sourceId);
}

function computePosition(anchor: AnchorRect) {
  const pad = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = anchor.left + anchor.width + pad;
  let top = anchor.top + anchor.height / 2 - CARD_H / 2;

  if (left + CARD_W > vw - pad) left = anchor.left - CARD_W - pad;
  if (left < pad) left = pad;
  if (top + CARD_H > vh - pad) top = vh - CARD_H - pad;
  if (top < pad) top = pad;

  return { left, top };
}

function SourcePreviewPortal({
  preview,
  onEnter,
  onLeave,
  onJumpToNarrativeForSource,
  onOpenSourceInWorkspace,
}: {
  preview: PreviewState | null;
  onEnter: () => void;
  onLeave: () => void;
  onJumpToNarrativeForSource?: (sourceId: string) => void;
  onOpenSourceInWorkspace?: (sourceId: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !preview) return null;

  const pos = computePosition(preview.anchor);

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none" aria-live="polite">
      <div
        role="dialog"
        aria-label="Source preview"
        className="source-preview-popover pointer-events-auto absolute anim-fade-in"
        style={{ left: pos.left, top: pos.top, width: CARD_W }}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
      >
        <SourcePreviewCard
          sourceId={preview.sourceId}
          onJumpToNarrative={
            onJumpToNarrativeForSource
              ? () => onJumpToNarrativeForSource(preview.sourceId)
              : undefined
          }
          onOpenInWorkspace={
            onOpenSourceInWorkspace
              ? () => onOpenSourceInWorkspace(preview.sourceId)
              : undefined
          }
        />
      </div>
    </div>,
    document.body
  );
}

export function SourcePreviewProvider({
  children,
  onJumpToNarrativeForSource,
  onOpenSourceInWorkspace,
}: {
  children: ReactNode;
  onJumpToNarrativeForSource?: (sourceId: string) => void;
  onOpenSourceInWorkspace?: (sourceId: string) => void;
}) {
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clearTimers = () => {
    clearTimeout(showTimer.current);
    clearTimeout(hideTimer.current);
  };

  useEffect(() => () => clearTimers(), []);

  const hide = useCallback(() => {
    clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(() => setPreview(null), HIDE_MS);
  }, []);

  const cancelHide = useCallback(() => {
    clearTimeout(hideTimer.current);
  }, []);

  const show = useCallback((sourceId: string, el: HTMLElement) => {
    clearTimeout(hideTimer.current);
    clearTimeout(showTimer.current);
    showTimer.current = setTimeout(() => {
      const r = el.getBoundingClientRect();
      setPreview({
        sourceId,
        anchor: { left: r.left, top: r.top, width: r.width, height: r.height },
      });
    }, SHOW_MS);
  }, []);

  const bindSource = useCallback(
    (sourceId: string): HoverHandlers => ({
      onPointerEnter: (e) => {
        cancelHide();
        show(sourceId, e.currentTarget);
      },
      onPointerLeave: () => hide(),
    }),
    [show, hide, cancelHide]
  );

  const handleOpenInWorkspace = useCallback(
    (sourceId: string) => {
      setPreview(null);
      clearTimers();
      onOpenSourceInWorkspace?.(sourceId);
    },
    [onOpenSourceInWorkspace]
  );

  return (
    <SourcePreviewContext.Provider value={{ bindSource }}>
      {children}
      <SourcePreviewPortal
        preview={preview}
        onEnter={cancelHide}
        onLeave={hide}
        onJumpToNarrativeForSource={onJumpToNarrativeForSource}
        onOpenSourceInWorkspace={onOpenSourceInWorkspace ? handleOpenInWorkspace : undefined}
      />
    </SourcePreviewContext.Provider>
  );
}
