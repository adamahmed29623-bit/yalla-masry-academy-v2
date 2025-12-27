'use client';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router]);

  // Show a loading indicator while checking auth state
  return (
    <div className="flex items-center justify-center min-h-screen bg-nile-dark">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-gold-accent" />
        <p className="text-sand-ochre font-semibold">...جاري التحميل</p>
      </div>
    </div>
  );
}
