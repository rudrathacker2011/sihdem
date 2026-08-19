import type { Metadata } from "next";
import "@/styles/globals.css";
import { Raleway, Outfit, Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toast"
import Header from "@/components/ui/header";
import { AuthProvider } from "@/providers/AuthProvider";
import CursorAura from "@/components/cursor/CursorAura";

const outfitHeading = Outfit({ subsets: ["latin"], variable: "--font-heading" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Aptivate — AI Career Counsellor for Indian Students",
  description: "AI-powered career counselling for Indian students. Get personalized roadmaps, exam guidance, college matches, and mentor pairing. Powered by Gemini AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", raleway.variable, outfitHeading.variable, spaceGrotesk.variable)}>
      <body className="min-h-full flex flex-col">
        <CursorAura />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
