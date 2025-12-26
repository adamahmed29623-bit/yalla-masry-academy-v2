"use client"

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
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  )
}
