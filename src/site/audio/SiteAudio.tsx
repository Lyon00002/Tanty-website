"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { WelcomeSound } from "./WelcomeSound";

/** The soundtrack of the hero film (public/brand/audio, extracted from the client's video). */
const SRC = "/brand/audio/tanty-ambiance.m4a";
const VOLUME = 0.6;
/** The visitor's choice ("off" once they mute), kept between visits (v2: earlier builds could store "off" by mistake). */
const PREF_KEY = "tanty-sound-v2";
/** Where the music was, so it resumes after a full page load. */
const TIME_KEY = "tanty-sound-time";
/** The welcome card is hidden until the client approves it (2026-10-21); true brings it back as it was. */
const WELCOME_ENABLED = false;
/** The welcome card has been shown to this visitor (once, ever). */
const WELCOME_KEY = "tanty-welcome-seen";
/** Let the visitor see the site before the welcome card comes up. */
const WELCOME_DELAY = 1400;

interface SiteSound {
  /** The music is playing. */
  on: boolean;
  toggle: () => void;
}

const SoundContext = createContext<SiteSound>({ on: false, toggle: () => {} });

/** Read and control the site's music from any component (e.g. the hero's sound button). */
export function useSiteSound() {
  return useContext(SoundContext);
}

const read = (storage: Storage | undefined, key: string) => {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
};
const write = (storage: Storage | undefined, key: string, value: string) => {
  try {
    storage?.setItem(key, value);
  } catch {
    /* private mode or blocked storage: the music still works, it just forgets */
  }
};

/**
 * Site-wide music. One audio element in the site layout, so the music goes on
 * without a cut from page to page. Browsers never let a page start sound on
 * its own: unless the visitor muted it before, the music starts at their
 * first click, tap or key press anywhere on the site (a scroll does not
 * count), and resumes where it was after a full page load. A welcome card
 * can invite that click, once ever per visitor (WELCOME_ENABLED, off for
 * now). The hero's sound button stops or restarts it; the visitor's choice
 * is remembered.
 */
export function SiteAudio({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);
  const [welcome, setWelcome] = useState(false);
  /** Removes the "first interaction" listeners once the music has started or the visitor decided. */
  const stopWaiting = useRef<() => void>(() => {});

  const pending = useRef(false);
  const play = useCallback(() => {
    const a = audio.current;
    if (!a || !a.paused || pending.current) return;
    a.volume = VOLUME;
    pending.current = true;
    a.play()
      .catch(() => {})
      .finally(() => {
        pending.current = false;
      });
  }, []);

  // Start at the first interaction, unless the visitor turned the music off.
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    const saved = Number(read(window.sessionStorage, TIME_KEY));
    if (saved > 0) a.currentTime = saved;
    if (read(window.localStorage, PREF_KEY) === "off") return;
    // Try on load, then at every scroll and interaction until it plays. Browsers refuse sound
    // started by a wheel or trackpad scroll alone (it is not a "user activation"); keyboard
    // scrolling, a click or a tap are accepted, and a browser that already allows sound on the
    // site (or the visitor's own setting) lets the scroll start it.
    const events = ["scroll", "wheel", "pointerdown", "keydown", "touchend"] as const;
    const off = () => {
      events.forEach((e) => window.removeEventListener(e, start, true));
      a.removeEventListener("play", off);
    };
    // A first interaction on a sound button is left to that button (it would otherwise start then stop the music).
    function start(e: Event) {
      if (e.target instanceof Element && e.target.closest("[data-sound-toggle]")) return off();
      play();
    }
    events.forEach((e) => window.addEventListener(e, start, { capture: true, passive: true }));
    a.addEventListener("play", off);
    stopWaiting.current = off;
    play();
    // The welcome card, if the music is still silent once the site has been seen.
    const timer =
      WELCOME_ENABLED && read(window.localStorage, WELCOME_KEY) === null
        ? window.setTimeout(() => {
            if (a.paused) setWelcome(true);
          }, WELCOME_DELAY)
        : undefined;
    return () => {
      off();
      window.clearTimeout(timer);
    };
  }, [play]);

  // Remember the position, every few seconds, for the next page load.
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    let last = 0;
    const save = () => {
      if (Math.abs(a.currentTime - last) < 3) return;
      last = a.currentTime;
      write(window.sessionStorage, TIME_KEY, String(a.currentTime));
    };
    a.addEventListener("timeupdate", save);
    return () => a.removeEventListener("timeupdate", save);
  }, []);

  const toggle = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    stopWaiting.current();
    if (a.paused) {
      write(window.localStorage, PREF_KEY, "on");
      play();
    } else {
      write(window.localStorage, PREF_KEY, "off");
      a.pause();
    }
  }, [play]);

  const closeWelcome = useCallback(() => {
    write(window.localStorage, WELCOME_KEY, "1");
    setWelcome(false);
  }, []);
  // The click that closes the card is the gesture that lets the browser play sound.
  const enter = useCallback(() => {
    closeWelcome();
    write(window.localStorage, PREF_KEY, "on");
    play();
  }, [closeWelcome, play]);
  const silent = useCallback(() => {
    closeWelcome();
    stopWaiting.current();
    write(window.localStorage, PREF_KEY, "off");
    audio.current?.pause();
  }, [closeWelcome]);

  const value = useMemo(() => ({ on, toggle }), [on, toggle]);

  return (
    <SoundContext.Provider value={value}>
      {children}
      <audio
        ref={audio}
        src={SRC}
        loop
        preload="none"
        onPlay={() => {
          setOn(true);
          setWelcome(false);
        }}
        onPause={() => setOn(false)}
      />
      {welcome && <WelcomeSound onEnter={enter} onSilent={silent} onDismiss={closeWelcome} />}
    </SoundContext.Provider>
  );
}
