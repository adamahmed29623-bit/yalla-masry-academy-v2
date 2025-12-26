'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page just acts as a redirect to the main dashboard page.
export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return null; // Or a loading spinner
}
