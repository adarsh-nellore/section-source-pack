"use client";

import type { RepoPath } from "@/lib/types";
import { Cluster } from "@/components/layout/Cluster";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Body } from "@/components/typography/Body";

export function WorkspaceModals({
  modal,
  docVersionLabel,
  canLockPack,
  lockDisabledReason,
  staleSourceTitles,
  pendingReparent,
  onCloseModal,
  onConfirmLock,
  onConfirmInherit,
  onConfirmMove,
  onCancelMove,
}: {
  modal: string | null;
  docVersionLabel?: string;
  canLockPack: boolean;
  lockDisabledReason: string | null;
  staleSourceTitles?: string[];
  pendingReparent: { sourceId: string; repo: RepoPath } | null;
  onCloseModal: () => void;
  onConfirmLock: () => void;
  onConfirmInherit: () => void;
  onConfirmMove: () => void;
  onCancelMove: () => void;
}) {
  return (
    <>
      <Modal
        open={modal === "mark-curated"}
        size="sm"
        title="Lock source pack?"
        description={
          <>
            Tells collaborators this section&apos;s sources were reviewed and approved for{" "}
            {docVersionLabel}. You can unlock later if tables change.
          </>
        }
        onClose={onCloseModal}
        footer={
          <Cluster gap="cozy" justify="end">
            <Button variant="secondary" size="sm" onClick={onCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" disabled={!canLockPack} onClick={onConfirmLock}>
              Lock pack
            </Button>
          </Cluster>
        }
      >
        {!canLockPack && lockDisabledReason ? (
          <Alert tone="warning" title={lockDisabledReason} compact />
        ) : null}
        {staleSourceTitles && staleSourceTitles.length > 0 ? (
          <Alert
            tone="danger"
            title="Stale sources must be resolved"
            body={staleSourceTitles.join("; ")}
            compact
          />
        ) : null}
      </Modal>

      <Modal
        open={modal === "inherit-pack"}
        size="md"
        title="Inherit source pack?"
        description="Copy the curated pack from Module 2.5 v3.2 into this document version. Study ID matches (RIV-301-KEY-01). Stale items will be flagged after inherit."
        onClose={onCloseModal}
        footer={
          <Cluster gap="cozy" justify="end">
            <Button variant="secondary" size="sm" onClick={onCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={onConfirmInherit}>
              Inherit pack
            </Button>
          </Cluster>
        }
      />

      <Modal
        open={modal === "move-source" && Boolean(pendingReparent)}
        size="sm"
        title="Move source?"
        onClose={onCancelMove}
        footer={
          <Cluster gap="cozy" justify="end">
            <Button variant="secondary" size="sm" onClick={onCancelMove}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={onConfirmMove}>
              Move
            </Button>
          </Cluster>
        }
      >
        {pendingReparent ? (
          <Body size="small" tone="muted">
            Move this source to {pendingReparent.repo.replace("_", " ")} folder in the pack.
          </Body>
        ) : null}
      </Modal>
    </>
  );
}
