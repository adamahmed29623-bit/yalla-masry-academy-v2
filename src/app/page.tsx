import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the default English landing page.
  // The middleware will handle locale detection for first-time visitors.
  redirect('/en');
}
