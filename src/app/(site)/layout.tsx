import type { ReactNode } from "react";
import { Libre_Franklin } from "next/font/google";
import { SiteAudio } from "@/site/audio/SiteAudio";
import { RevealRoot } from "@/site/motion/RevealRoot";
import "@/site/tokens.css";
import "@/site/world.css";

// Libre Franklin: the Franklin Gothic family of the TANTY logo lettering,
// one corporate typeface for titles (heavy) and text (regular).
const franklin = Libre_Franklin({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  variable: "--font-nid-display",
  display: "swap",
});

/** The TANTY site, in the woven world of the weaver bird (direction "Le Nid"). */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`w-nid ${franklin.variable}`}>
      <SiteAudio>{children}</SiteAudio>
      <RevealRoot />
    </div>
  );
}
