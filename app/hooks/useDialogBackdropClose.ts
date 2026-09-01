"use client";

import { useEffect, type RefObject } from "react";

/**
 * Closes a native dialog when its backdrop is clicked. Native dialog content
 * remains interactive because only clicks whose target is the dialog itself
 * are treated as backdrop clicks.
 */
export function useDialogBackdropClose(
  dialogRef: RefObject<HTMLDialogElement | null>,
  onDismiss?: () => void,
  active = true,
) {
  useEffect(() => {
    if (!active) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    function closeFromBackdrop(event: MouseEvent) {
      if (event.target !== dialog) return;

      if (onDismiss) onDismiss();
      else dialog.close();
    }

    dialog.addEventListener("click", closeFromBackdrop);
    return () => dialog.removeEventListener("click", closeFromBackdrop);
  }, [active, dialogRef, onDismiss]);
}
