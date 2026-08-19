'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/providers/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { LogOut, User, Settings, ChevronDown, Menu } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import VoiceCommandBar from '@/components/voice/VoiceCommandBar';

export function Header() {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : '?';

  const displayName = user?.email?.split('@')[0] ?? 'Account';

  // Logo click: refresh if already on /dashboard, else navigate to dashboard/landing
  const handleLogoClick = (e: React.MouseEvent) => {
    if (user) {
      e.preventDefault();
      if (pathname === '/dashboard') {
        router.refresh(); // just refresh data, no navigation
      } else {
        router.push('/dashboard');
      }
    }
    // if not logged in, let the default Link href="/" handle it
  };

  const triggerMobileNav = () => {
    window.dispatchEvent(new CustomEvent('toggle-mobile-nav'));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-4">

        {/* ─ Left: Mobile Menu Trigger + Logo ─ */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={triggerMobileNav}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card/80 text-foreground hover:bg-accent transition"
            aria-label="Open mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* ─ Logo ─ */}
          <Link
            href={user ? '/dashboard' : '/'}
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 sm:gap-3 group"
          >
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex-shrink-0"
            >
              <Image
                src="/lg.png"
                width={36}
                height={36}
                className="rounded-xl border border-white/10 shadow-md shadow-black/30 w-8 h-8 sm:w-10 sm:h-10"
                priority
                alt="Aptivate logo"
              />
              {/* Glow halo on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                  boxShadow: '0 0 16px oklch(0.58 0.22 264 / 0.5)',
                  background: 'oklch(0.58 0.22 264 / 0.08)',
                }}
              />
            </motion.div>

            {/* Brand text */}
            <div className="flex flex-col leading-none">
              <span
                className="font-display text-base sm:text-lg font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-display, var(--font-heading))' }}
              >
                Career{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.68 0.22 264), oklch(0.78 0.18 295))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 12px oklch(0.6 0.22 264 / 0.7))',
                  }}
                >
                  AI
                </span>
              </span>
              <span className="hidden xs:inline text-[9px] sm:text-[10px] font-medium text-muted-foreground tracking-wide">
                Career Navigation
              </span>
            </div>
          </Link>
        </div>

        {/* ─ Right side ─ */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Voice Command Bar in Header */}
          <div className="flex items-center">
            <VoiceCommandBar />
          </div>

          {!loading && (
            <>
              {user ? (
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/80 px-3 py-2 shadow-sm backdrop-blur-sm transition-all hover:border-primary/30"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-500 text-xs font-bold text-white shadow-inner">
                      {initials}
                    </div>
                    <span className="hidden max-w-[110px] truncate text-sm font-semibold text-foreground sm:block">
                      {displayName}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {menuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute right-0 top-[calc(100%+10px)] z-50 w-60 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl shadow-black/25 backdrop-blur-xl"
                        >
                          {/* Bio */}
                          <div className="border-b border-border/50 p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-base font-bold text-white shadow-md">
                                {initials}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-foreground capitalize">
                                  {displayName}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {user.email}
                                </p>
                                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                                  ✦ Student
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-2 space-y-0.5">
                            <Link href="/account" onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
                              <User className="h-4 w-4 text-primary" /> My Account
                            </Link>
                            <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
                              <Settings className="h-4 w-4 text-primary" /> Dashboard
                            </Link>
                          </div>

                          <div className="border-t border-border/50 p-2">
                            <button
                              onClick={() => { setMenuOpen(false); signOut(); }}
                              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
                            >
                              <LogOut className="h-4 w-4" /> Log Out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/auth">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition"
                  >
                    Sign In
                  </motion.button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;