'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirebase } from '@/firebase';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { auth } = useFirebase();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError('Firebase Auth is not initialized.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(`/${lang}/dashboard`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) {
      setError('Firebase Auth is not initialized.');
      return;
    }
    setGoogleLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push(`/${lang}/dashboard`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={googleLoading}>
               {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.1 512 0 401.9 0 265.8 0 129.7 110.1 20 244 20c66.5 0 123.9 24.5 166.9 65.8L354.4 139.9C323.2 111.4 286.1 96 244 96c-88.6 0-160.2 71.9-160.2 160.7s71.7 160.7 160.2 160.7c93.1 0 148.1-62.1 152.9-108.9H244v-64.8h243.2c1.3 12.6 2 25.4 2 38.9z"></path></svg>}
              Sign in with Google
            </Button>
            <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{' '}
                <Link href={`/${lang}/signup`} className="font-semibold text-primary hover:underline">
                    Sign up
                </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
