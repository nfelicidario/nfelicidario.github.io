"use client";

import { useRef, useState, type MouseEvent, type PointerEvent } from "react";

/**
 * Mouse drag-to-scroll for a horizontal row (chips, a card carousel). Touch and pen scroll
 * natively, so only the mouse is handled. Spread the returned `handlers` onto the scrolling
 * element; `dragging` is true while the mouse is pulling the row.
 *
 * Why the click handling looks the way it does (a plain click must still tap a button):
 *
 * An earlier version called `setPointerCapture` on pointerdown, before any movement. Under
 * Pointer Events Level 3 (Chrome and Firefox), the `click` that follows a captured pointerup
 * is dispatched to the capturing element, the scroller, not to the button under the mouse,
 * so the button's onClick never ran and every click on an overflowing row was lost. Capture is
 * now taken only once the pointer has moved past DRAG_THRESHOLD; until then the pointer
 * events flow to the button untouched and the click lands on it. After a real drag, the click
 * that follows the release is swallowed in the capture phase, once. The swallow flag is reset
 * on every new press and by a zero-delay timer, so it can never stay set and eat a later tap.
 */

/** a mouse drag longer than this (CSS px) scrolls instead of tapping */
export const DRAG_THRESHOLD = 4;

type Drag = { pointerId: number; startX: number; startScroll: number; scale: number; moved: boolean };

export function useDragScroll<T extends HTMLElement>() {
  const drag = useRef<Drag | null>(null);
  /** set after a drag so the click that follows the pointerup does not tap a button */
  const swallowClick = useRef(false);
  const [dragging, setDragging] = useState(false);

  function onPointerDown(e: PointerEvent<T>) {
    // a fresh press always starts clean; nothing from an earlier gesture may eat this tap
    swallowClick.current = false;
    // touch and pen scroll natively; only the mouse needs drag-to-scroll
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.currentTarget;
    if (el.scrollWidth <= el.clientWidth) return;
    // the phone is zoomed, so pointer deltas (screen px) must be scaled to scroll units
    const scale = el.offsetWidth ? el.getBoundingClientRect().width / el.offsetWidth : 1;
    drag.current = { pointerId: e.pointerId, startX: e.clientX, startScroll: el.scrollLeft, scale: scale || 1, moved: false };
    // no pointer capture here: a plain click has to reach the button (see the note above)
  }

  function onPointerMove(e: PointerEvent<T>) {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointerId) return;
    if (!(e.buttons & 1)) {
      // the button was released somewhere we did not see (outside the row, before capture)
      drag.current = null;
      return;
    }
    const dx = e.clientX - d.startX;
    if (!d.moved) {
      if (Math.abs(dx) <= DRAG_THRESHOLD) return;
      d.moved = true;
      setDragging(true);
      // only now does the row own the pointer; the click after release will be swallowed
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    e.preventDefault();
    e.currentTarget.scrollLeft = d.startScroll - dx / d.scale;
  }

  function endDrag(e: PointerEvent<T>) {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointerId) return;
    drag.current = null;
    if (!d.moved) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
    swallowClick.current = true;
    // a click follows pointerup synchronously; clear the flag if none arrives
    setTimeout(() => {
      swallowClick.current = false;
    }, 0);
  }

  function onPointerLeave() {
    // the pointer left before a drag began (no capture yet), so forget the press
    if (drag.current && !drag.current.moved) drag.current = null;
  }

  function onClickCapture(e: MouseEvent<T>) {
    if (!swallowClick.current) return;
    swallowClick.current = false;
    e.preventDefault();
    e.stopPropagation();
  }

  return {
    dragging,
    handlers: { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag, onPointerLeave, onClickCapture },
  };
}
