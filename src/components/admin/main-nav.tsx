import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/admin/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Overview
      </Link>
      <Link
        href="/admin/student-analytics"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Students
      </Link>
       <Link
        href="/admin/challenge-analytics"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Challenges
      </Link>
      <Link
        href="/admin/tutor-analytics"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Tutors
      </Link>
      <Link
        href="/admin/store-management"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Store
      </Link>
    </nav>
  )
}
