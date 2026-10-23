import { gsap } from "../../motion/gsap";

/**
 * The motion shared by the two paths of the sun (the arc of wide screens,
 * SunPath, and the folded ribbon of phones, SunTrail): a timeline played
 * with the scroll, both ways, so it plays at every visit.
 */
export function sunTimeline(trigger: Element, start: string, end: string) {
  return gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger, start, end, scrub: 0.6 } });
}

/** A step lights up where the path reaches it (`at`, 0 to 1): its sun swells in, rising by `rise` px, its words just after. */
export function lightStep(tl: ReturnType<typeof sunTimeline>, sun: Element | null, words: Element | NodeListOf<Element> | null, at: number, rise = 0) {
  tl.fromTo(sun, { y: rise, scale: 0.4, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.07, ease: "back.out(1.7)" }, at).fromTo(
    words,
    { y: 12, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.08, ease: "power2.out" },
    at + 0.02,
  );
}
