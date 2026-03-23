import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { PublicShell } from "@/components/layout/public-shell";
import { Footer } from "@/components/layout/footer";
import { getContactInfo } from "@/actions/settings";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contactInfo = await getContactInfo();

  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <PublicShell
          footer={<Footer />}
          whatsappNumber={contactInfo.whatsapp_number}
        >
          <main className="flex-1">{children}</main>
        </PublicShell>
      </body>
    </html>
  );
}
