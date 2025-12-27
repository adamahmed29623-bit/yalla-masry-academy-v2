import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Yalla Masry Academy',
  description: 'Your gateway to learning the authentic Egyptian dialect and exploring the treasures of Pharaonic culture.',
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ar' dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=El+Messiri:wght@400;700;900&family=Inter:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@400;500;600;700&family=Amiri+Quran:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background">
        <FirebaseClientProvider>
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
