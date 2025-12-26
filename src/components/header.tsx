import Link from 'next/link'
import { FirebaseLogo } from '@/components/icons'
import { UserNav } from '@/components/user-nav'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <FirebaseLogo className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">
              Yalla Masry Academy
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
             <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
            <Link
              href="/egyptian-school"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              المدرسة
            </Link>
            <Link
              href="/teachers"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Teachers
            </Link>
            <Link
              href="/museum"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Museum
            </Link>
             <Link
              href="/challenge"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Challenge
            </Link>
             <Link
              href="/smart-adventure"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Smart Adventure
            </Link>
            <Link
              href="/store"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Store
            </Link>
            <Link
              href="/gulf"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Gulf Council
            </Link>
             <Link
              href="/teacher-dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Teacher Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  )
}
