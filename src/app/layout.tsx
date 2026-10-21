import type { Metadata, Viewport } from "next";
import "./globals.css";
import { company } from "@/data/company";

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: {
    default: "TANTY · Bouillies, en-cas et saveurs du Cameroun depuis 2000",
    template: "%s · TANTY",
  },
  description:
    "TANTY, marque de NTFoods à Yaoundé depuis 2000 : bouillies de soja, en-cas à grignoter, chapelure, piment de table et chocolat à tartiner.",
  applicationName: "TANTY",
  openGraph: {
    type: "website",
    locale: "fr_CM",
    siteName: "TANTY",
  },
};

export const viewport: Viewport = {
  themeColor: "#FECC00",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
