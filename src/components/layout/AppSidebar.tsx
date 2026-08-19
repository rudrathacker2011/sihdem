"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Sliders,
  Gamepad2,
  Map,
  MessageSquare,
  Trophy,
} from "lucide-react";
import { storageService } from "@/services/storageService";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assessment", label: "Discovery Assessment", icon: Compass },
  { href: "/careers", label: "Career Explorer", icon: Sparkles },
  { href: "/what-if", label: "What-If Simulator", icon: Sliders },
  { href: "/simulations", label: "Career Simulations", icon: Gamepad2 },
  { href: "/roadmap", label: "GPS Roadmap", icon: Map },
  { href: "/chat", label: "AI Counsellor", icon: MessageSquare },
  { href: "/leaderboard", label: "Leaderboard & XP", icon: Trophy },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
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
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1.5 overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
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
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
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
      <div className="border-t border-border/60 p-3 flex items-center justify-center overflow-hidden">
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          {isHovered && (
            <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
              AI Connected
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
