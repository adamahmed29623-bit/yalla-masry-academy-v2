"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Database, Folder, ServerCog, type LucideIcon } from "lucide-react"
import { type ComponentType } from "react"

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon | ComponentType<{className?: string}>;
}

const navLinks: NavLink[] = [
  { href: 'overview', label: 'Overview', icon: LayoutDashboard },
  { href: 'authentication', label: 'Authentication', icon: Users },
  { href: 'firestore', label: 'Firestore', icon: Database },
  { href: 'storage', label: 'Storage', icon: Folder },
  { href: 'functions', label: 'Functions', icon: ServerCog },
];


export function ProjectNav({ projectId }: { projectId: string }) {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-card">
      <div className="container flex items-center gap-x-1 overflow-x-auto">
        {navLinks.map((link) => {
          const Icon = link.icon
          const fullPath = `/project/${projectId}/${link.href}`
          const isActive = pathname === fullPath
          return (
            <Link
              key={link.href}
              href={fullPath}
              className={cn(
                "flex items-center gap-x-2 rounded-t-md px-3 py-3 text-sm font-medium transition-colors hover:text-primary",
                isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
