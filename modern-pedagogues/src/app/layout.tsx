import type { Metadata } from "next";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "The Modern Pedagogues - Excellence in Education",
  description: "Ghana's leading educational platform offering multi-curriculum learning solutions including GES, Cambridge, STEM, IGCSE, and A-Level programs.",
  keywords: ["education", "Ghana", "GES", "Cambridge", "STEM", "IGCSE", "A-Level", "online learning", "tutoring"],
  authors: [{ name: "The Modern Pedagogues" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "The Modern Pedagogues - Excellence in Education",
    description: "Ghana's leading educational platform offering multi-curriculum learning solutions",
    type: "website",
    url: "https://modernpedagogues.edu.gh",
    siteName: "The Modern Pedagogues",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Modern Pedagogues - Excellence in Education",
    description: "Ghana's leading educational platform offering multi-curriculum learning solutions",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
