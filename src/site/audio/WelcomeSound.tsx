"use client";

import { Volume2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";

/**
 * Welcome card, shown over the site once it is visible: browsers only allow
 * sound after a click, so this invites one. A click on "Entrer en musique"
 * or anywhere around the card closes it and starts the music (the click is
 * the gesture the browser waits for, see SiteAudio); "Continuer sans le son"
 * closes it and keeps silence. Escape just closes it (the music can still
 * start at the next click).
 */
export function WelcomeSound({ onEnter, onSilent, onDismiss }: { onEnter: () => void; onSilent: () => void; onDismiss: () => void }) {
  const primary = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    primary.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  return (
    <div className="nid-welcome fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center" onClick={onEnter}>
      <div aria-hidden="true" className="nid-welcome-veil absolute inset-0 bg-[rgb(9_34_18/0.45)] backdrop-blur-[2px]" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="nid-welcome-title"
        aria-describedby="nid-welcome-text"
        onClick={(e) => e.stopPropagation()}
        className="nid-welcome-card relative w-full max-w-[26rem] rounded-[0_2rem] bg-white px-7 pb-7 pt-8 shadow-[0_30px_60px_-30px_rgb(9_34_18/0.6)] sm:px-9 sm:pb-9 sm:pt-10"
      >
        <BrandLogo className="h-12 w-auto" title="TANTY" sizes="8rem" />
        <h2 id="nid-welcome-title" className="nid-display mt-6 text-[1.75rem] leading-tight text-[var(--nid-ink)]">
          Bienvenue chez <span className="text-[var(--nid-green)]">TANTY</span>
          <span className="nid-dot">.</span>
        </h2>
        <p id="nid-welcome-text" className="mt-3 leading-relaxed text-[var(--nid-ink-soft)]">
          Découvrez nos gammes en musique, au rythme de nos ateliers de Yaoundé.
        </p>
        <button ref={primary} type="button" onClick={onEnter} className="nid-btn nid-btn-yellow mt-7 w-full">
          <Volume2 aria-hidden="true" className="size-5" />
          Entrer en musique
        </button>
        <button
          type="button"
          data-sound-toggle=""
          onClick={onSilent}
          className="mx-auto mt-4 block text-sm font-semibold text-[var(--nid-ink-soft)] underline decoration-[var(--nid-ink)]/25 underline-offset-4 transition-colors hover:text-[var(--nid-ink)]"
        >
          Continuer sans le son
        </button>
      </div>
    </div>
  );
}
