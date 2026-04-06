export const dynamic = 'force-dynamic'

import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif'
})

export const metadata: Metadata = {
  title: "Zensync",
  description: "Zensync: Modern Banking Platform for everyone.",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable} min-h-screen bg-[#050511] font-sans antialiased`}>
        {/* Glow Effects / Blobs */}
        <div className="pointer-events-none fixed inset-0 flex place-content-center justify-center overflow-hidden h-screen z-[-1]">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/30 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-900/40 blur-[130px]"></div>
          <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-teal-900/20 blur-[100px]"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
