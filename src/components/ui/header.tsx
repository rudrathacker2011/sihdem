'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/lg.png" width={48} height={48} className="rounded-full border border-border" priority alt="logo" />
          <span className="font-heading font-bold text-lg hidden sm:inline-block">AI Career Counsellor</span>
        </Link>

        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground hidden md:inline-block">
                    {user.email}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={signOut}
                  >
                    Log Out
                  </Button>
                </div>
              ) : (
                <Link href="/auth">
                  <Button size="sm">Sign In</Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}