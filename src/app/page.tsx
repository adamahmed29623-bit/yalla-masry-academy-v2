import { redirect } from 'next/navigation';

// This is a temporary redirect to the default locale.
// The middleware will handle the actual language detection and redirection.
export default function RootPage() {
  redirect('/en');
}
