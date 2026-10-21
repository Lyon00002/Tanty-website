"use client";

import { Wifi, WifiOff } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

const subscribe = (notify: () => void) => {
  window.addEventListener("online", notify);
  window.addEventListener("offline", notify);
  return () => {
    window.removeEventListener("online", notify);
    window.removeEventListener("offline", notify);
  };
};

/**
 * The connection, said plainly: while the visitor is offline a note stays at
 * the bottom of the screen (the pages already open stay readable); when the
 * connection comes back, "Connexion rétablie" for a few seconds. A page that
 * cannot load at all gets the offline page (public/offline.html, served by
 * the service worker).
 */
export function ConnectionStatus() {
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  const [back, setBack] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    const onBack = () => {
      setBack(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setBack(false), 3500);
    };
    window.addEventListener("online", onBack);
    return () => {
      window.removeEventListener("online", onBack);
      window.clearTimeout(timer);
    };
  }, []);

  const show = !online || back;
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[95] flex justify-center sm:bottom-6">
      {show && (
        <p className="nid-connection pointer-events-auto flex max-w-md items-center gap-3 rounded-[0_1.25rem] bg-[var(--nid-green-deep)] px-5 py-3.5 text-sm text-white shadow-[0_18px_40px_-20px_rgb(9_34_18/0.7)]">
          {online ? (
            <>
              <Wifi aria-hidden="true" className="size-5 shrink-0 text-[var(--nid-yellow)]" />
              Connexion rétablie.
            </>
          ) : (
            <>
              <WifiOff aria-hidden="true" className="size-5 shrink-0 text-[var(--nid-yellow)]" />
              <span>
                <strong className="font-semibold">Vous êtes hors connexion.</strong> Les pages déjà ouvertes restent consultables.
              </span>
            </>
          )}
        </p>
      )}
    </div>
  );
}
