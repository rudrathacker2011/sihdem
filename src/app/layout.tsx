import type { Metadata } from "next";
import "@/styles/globals.css";
import { Raleway, Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toast"
import Header from "@/components/ui/header";
import { AuthProvider } from "@/providers/AuthProvider";

const outfitHeading = Outfit({subsets:['latin'],variable:'--font-heading'});

const raleway = Raleway({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "AI Career Counsellor — Find Your Perfect Career Path",
  description: "AI-powered career counselling for Indian students. Get personalized roadmaps, exam guidance, college matches, and mentor pairing. Powered by Gemini AI.",
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", raleway.variable, outfitHeading.variable)}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <Header/>
              {children}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
          </body>
    </html>
  );
}
