import { redirect } from 'next/navigation'

// The root page will redirect to the dashboard, which will handle authentication checks.
export default function Home() {
  redirect('/dashboard')
}
