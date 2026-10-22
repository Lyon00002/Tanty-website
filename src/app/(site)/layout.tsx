import type { ReactNode } from "react";
import { Archivo, Libre_Franklin } from "next/font/google";
import { SiteAudio } from "@/site/audio/SiteAudio";
import { NavigationProgress } from "@/site/motion/NavigationProgress";
import { RevealRoot } from "@/site/motion/RevealRoot";
import { ConnectionStatus } from "@/site/ui/ConnectionStatus";
import { OfflineSupport } from "@/site/ui/OfflineSupport";
import "@/site/tokens.css";
import "@/site/world.css";

// Libre Franklin: the Franklin Gothic family, for the text.
const franklin = Libre_Franklin({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  variable: "--font-nid-display",
  display: "swap",
});

// Archivo, narrow (width axis): the titles, in the lettering of the TANTY logo
// (closest free match to the wordmark's letter widths and stroke, measured 2026-10-22).
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-nid-title",
  display: "swap",
});

/** The TANTY site, in the woven world of the weaver bird (direction "Le Nid"). */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`w-nid ${franklin.variable} ${archivo.variable}`}>
      <NavigationProgress />
      <SiteAudio>{children}</SiteAudio>
      <RevealRoot />
      <ConnectionStatus />
      <OfflineSupport />
    </div>
  );
}
