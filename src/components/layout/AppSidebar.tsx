"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Sliders,
  Gamepad2,
  Map,
  MessageSquare,
  Trophy,
  Dna,
  Swords,
  User,
  X,
  Menu,
  ChevronRight,
  Zap,
} from "lucide-react";
import { storageService } from "@/services/storageService";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, category: "Core" },
  { href: "/assessment", label: "Discovery Assessment", icon: Compass, category: "Core" },
  { href: "/careers", label: "Career Explorer", icon: Sparkles, category: "Core" },
  { href: "/roadmap", label: "GPS Roadmap", icon: Map, category: "Core" },
  { href: "/simulations", label: "Career Simulations", icon: Gamepad2, category: "Interactive" },
  { href: "/what-if", label: "What-If Simulator", icon: Sliders, category: "Interactive" },
  { href: "/career-battle", label: "1v1 Career Battle", icon: Swords, category: "Interactive" },
  { href: "/career-dna", label: "Career DNA Helix", icon: Dna, category: "Interactive" },
  { href: "/chat", label: "AI Counsellor", icon: MessageSquare, category: "AI & Support" },
  { href: "/leaderboard", label: "Leaderboard & XP", icon: Trophy, category: "Progress" },
  { href: "/account", label: "My Account", icon: User, category: "Progress" },
];

export const MOBILE_PRIMARY_TABS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/careers", label: "Explore", icon: Sparkles },
  { href: "/simulations", label: "Simulate", icon: Gamepad2 },
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [xp, setXp] = useState<number>(0);

  useEffect(() => {
    try {
      setXp(storageService.getXP());
    } catch {
      // fallback
    }
  }, []);

  // Listen to custom event from Header hamburger if triggered
  useEffect(() => {
    const handleToggle = () => setMobileMenuOpen((prev) => !prev);
    window.addEventListener("toggle-mobile-nav", handleToggle);
    return () => window.removeEventListener("toggle-mobile-nav", handleToggle);
  }, []);

  // Close drawer on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ─── Desktop Collapsible Sidebar ─── */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden lg:flex flex-col border-r border-border/80 bg-card/80 backdrop-blur-xl shrink-0 transition-all duration-300 ease-in-out z-40 ${
          isHovered ? "w-60 shadow-xl shadow-black/10" : "w-[68px]"
        }`}
      >
        {/* Brand Icon */}
        <div className="flex h-14 items-center border-b border-border/60 px-3.5 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-4 w-4" />
          </div>
          {isHovered && (
            <span className="ml-3 text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              Navigation
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1.5 overflow-x-hidden custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <motion.div
                key={item.href}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  href={item.href}
                  title={!isHovered ? item.label : undefined}
                  className={`group flex items-center h-10 rounded-xl px-3 text-xs font-semibold transition-all whitespace-nowrap overflow-hidden ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                    <Icon
                      className={`h-4.5 w-4.5 ${
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />
                  </div>

                  <span
                    className={`ml-3 transition-opacity duration-200 ${
                      isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Collapsed Indicator */}
        <div className="border-t border-border/60 p-3 flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            {isHovered && (
              <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
                AI Engine Active
              </span>
            )}
          </div>
          {isHovered && xp > 0 && (
            <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {xp} XP
            </span>
          )}
        </div>
      </aside>

      {/* ─── Mobile Bottom Navigation Dock (Fixed) ─── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-2xl border-t border-border/70 px-2 py-1.5 shadow-2xl safe-area-pb"
        aria-label="Mobile Navigation"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {MOBILE_PRIMARY_TABS.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href !== "/dashboard" && pathname.startsWith(tab.href));
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center py-1 px-3 relative group"
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary border border-primary/30 shadow-sm"
                        : "bg-transparent text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {isActive && (
                      <motion.div
                        layoutId="mobileActiveDot"
                        className="absolute -top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary"
                      />
                    )}
                  </div>
                  <span className="text-[10px] tracking-tight leading-none">{tab.label}</span>
                </motion.div>
              </Link>
            );
          })}

          {/* More / Menu Drawer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 text-muted-foreground hover:text-foreground group"
            aria-label="All features menu"
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/80 text-foreground border border-border/70">
                <Menu className="h-4 w-4" />
              </div>
              <span className="text-[10px] tracking-tight leading-none font-medium">All</span>
            </motion.div>
          </button>
        </div>
      </nav>

      {/* ─── Full Mobile Navigation Drawer / Modal ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-over sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="lg:hidden fixed inset-x-0 bottom-0 z-50 max-h-[85vh] rounded-t-3xl border-t border-border/80 bg-card/98 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col safe-area-pb"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 bg-muted/20">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Career Navigation Suite</h3>
                    <p className="text-[11px] text-muted-foreground">All tools & simulated environments</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/60 bg-card/80 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Tools List */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {/* Categories */}
                {(["Core", "Interactive", "AI & Support", "Progress"] as const).map((cat) => {
                  const items = NAV_ITEMS.filter((item) => item.category === cat);
                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                        {cat}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {items.map((item) => {
                          const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));
                          const Icon = item.icon;

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                                isActive
                                  ? "bg-primary text-primary-foreground border-primary shadow-md font-bold"
                                  : "bg-background/60 border-border/60 text-foreground hover:bg-accent hover:border-primary/30"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                    isActive
                                      ? "bg-white/20 text-white"
                                      : "bg-primary/10 text-primary border border-primary/20"
                                  }`}
                                >
                                  <Icon className="h-4.5 w-4.5" />
                                </div>
                                <span className="text-xs font-semibold">{item.label}</span>
                              </div>
                              <ChevronRight
                                className={`h-4 w-4 ${
                                  isActive ? "text-white" : "text-muted-foreground"
                                }`}
                              />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Bar */}
              <div className="border-t border-border/60 p-4 bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                  <span className="text-xs font-semibold text-muted-foreground">Online & Synced</span>
                </div>
                {xp > 0 && (
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    <Zap className="h-3.5 w-3.5 fill-amber-500" />
                    <span>{xp} XP Earned</span>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
