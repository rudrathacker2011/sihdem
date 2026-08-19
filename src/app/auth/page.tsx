'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui/toast';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.add({
        title: 'Error',
        description: 'Please fill in all fields',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.add({
          title: 'Success!',
          description: 'Account created. You can now sign in.',
          type: 'success',
        });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.add({
          title: 'Welcome Back!',
          description: 'Successfully signed in.',
          type: 'success',
        });
        router.push(email === 'admin@test.com' ? '/admin' : '/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      toast.add({
        title: 'Authentication Error',
        description: err.message || 'Something went wrong.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (quickEmail: string) => {
    setEmail(quickEmail);
    setPassword('password123');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: quickEmail,
        password: 'password123',
      });
      if (error) throw error;

      toast.add({
        title: 'Welcome!',
        description: `Logged in as ${quickEmail}`,
        type: 'success',
      });
      router.push(quickEmail === 'admin@test.com' ? '/admin' : '/dashboard');
      router.refresh();
    } catch (err: any) {
      toast.add({
        title: 'Sign In Error',
        description: err.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md shadow-lg border border-border bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            {isSignUp ? 'Create an Account' : 'Sign In'}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {isSignUp
              ? 'Enter your details below to register'
              : 'Enter your email and password to access your account'}
          </CardDescription>
        </CardHeader>

        {/* 1-Click Demo Logins */}
        <div className="px-6 pb-2">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-center">
            <p className="text-xs font-semibold text-primary mb-2">⚡ 1-Click Quick Demo Login</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => quickLogin('student@test.com')}
                disabled={loading}
              >
                🎓 Student
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => quickLogin('admin@test.com')}
                disabled={loading}
              >
                🛡️ Admin
              </Button>
            </div>
          </div>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or sign in with email</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleAuth}>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2 pb-6">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              </span>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-semibold bg-transparent border-0 cursor-pointer p-0"
                disabled={loading}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
