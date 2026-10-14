"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import type { PopupItem } from "@/lib/types";

/** The date this popup was last seen, per frequency rule. */
function storageKey(popup: PopupItem) {
  return `nx_popup_${popup.id}_${popup.updated_at}`;
}

function alreadySeen(popup: PopupItem): boolean {
  if (popup.frequency === "always") return false;
  try {
    if (popup.frequency === "session") return sessionStorage.getItem(storageKey(popup)) === "1";
    const last = localStorage.getItem(storageKey(popup));
    return last === new Date().toDateString();
  } catch {
    return false;
  }
}

function markSeen(popup: PopupItem) {
  try {
    if (popup.frequency === "session") sessionStorage.setItem(storageKey(popup), "1");
    else if (popup.frequency === "daily") {
      localStorage.setItem(storageKey(popup), new Date().toDateString());
    }
  } catch {
    /* storage blocked: the popup simply may show again */
  }
}

/**
 * Square promotional popup managed from the admin panel. Same square on phones
 * and desktops; the whole image is the link.
 */
export function PromoPopup({ popup }: { popup: PopupItem | null }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  const eligible = !!popup && (popup.show_on === "all" || pathname === "/");

  useEffect(() => {
    if (!popup || !eligible || alreadySeen(popup)) return;
    const timer = window.setTimeout(() => {
      const dialog = dialogRef.current;
      // Never stack on top of another dialog or interrupt someone typing.
      if (!dialog || document.querySelector("dialog[open]")) return;
      const active = document.activeElement;
      if (active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName)) return;
      dialog.showModal();
      document.body.style.overflow = "hidden";
      markSeen(popup);
    }, Math.max(0, popup.delay_seconds) * 1000);
    return () => window.clearTimeout(timer);
  }, [popup, eligible, pathname]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const restore = () => {
      document.body.style.overflow = "";
    };
    dialog.addEventListener("close", restore);
    return () => dialog.removeEventListener("close", restore);
  }, []);

  if (!popup) return null;

  const close = () => dialogRef.current?.close();
  const external = /^https?:\/\//i.test(popup.link_url);
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={popup.image} alt={popup.title} className="size-full object-cover" />
  );

  return (
    <dialog
      ref={dialogRef}
      aria-label={popup.title}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
      className="m-auto size-[min(90vw,90vh,34rem)] overflow-visible bg-transparent p-0 backdrop:bg-ink/60 backdrop:backdrop-blur-[2px]"
    >
      <div className="relative size-full bg-white shadow-2xl">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute -right-3 -top-3 z-10 flex size-9 items-center justify-center bg-white text-ink shadow-float transition-colors hover:text-violet-deep"
        >
          <X className="size-5" />
        </button>
        {popup.link_url ? (
          external || popup.open_in_new_tab ? (
            <a
              href={popup.link_url}
              target={popup.open_in_new_tab ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={close}
              className="block size-full"
            >
              {image}
            </a>
          ) : (
            <Link href={popup.link_url} onClick={close} className="block size-full">
              {image}
            </Link>
          )
        ) : (
          image
        )}
      </div>
    </dialog>
  );
}
