"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreditCard, LogOut, Settings, User, LogIn, Loader2 } from "lucide-react"
import { useFirebase } from "@/firebase"
import { signOut } from "firebase/auth"
import Link from "next/link"
import React from "react"
import { type getDictionary } from "@/dictionaries"

type UserNavDict = Awaited<ReturnType<typeof getDictionary>>['user_nav'];

interface UserNavProps {
  lang: string;
  dict: UserNavDict;
}

function getInitials(name?: string | null) {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length > 1) {
    return parts[0][0] + parts[parts.length - 1][0];
  }
  return name.substring(0, 2);
}

export function UserNav({ lang, dict }: UserNavProps) {
  const { user, isUserLoading, auth } = useFirebase();

  const handleLogout = () => {
    if (!auth) return;
    signOut(auth).catch(error => {
      console.error("Logout failed:", error);
    });
  };

  if (isUserLoading) {
    return <Loader2 className="h-6 w-6 animate-spin" />
  }

  if (!user) {
    return (
      <Button asChild>
        <Link href={`/${lang}/login`}>
            <LogIn className="mr-2 h-4 w-4" />
            {dict.sign_in}
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8" data-ai-hint="person portrait">
            <AvatarImage src={user.photoURL || undefined} alt="User avatar" />
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || "No email"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>{dict.profile}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>{dict.billing}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>{dict.settings}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{dict.log_out}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
