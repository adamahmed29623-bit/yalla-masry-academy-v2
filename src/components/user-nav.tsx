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
// أضفنا أيقونة Castle لترمز للمتحف الملكي
import { CreditCard, LogOut, Settings, User, LogIn, Loader2, Castle } from "lucide-react"
import { useFirebase } from "@/firebase"
import { signOut } from "firebase/auth"
import Link from "next/link"

function getInitials(name?: string | null) {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function UserNav() {
  const { user, isUserLoading, auth } = useFirebase();

  const handleLogout = () => {
    if (!auth) return;
    signOut(auth).catch(error => {
      console.error("Logout failed:", error);
    });
  };

  if (isUserLoading) {
    return <Loader2 className="h-6 w-6 animate-spin text-primary" />
  }

  if (!user) {
    return (
      <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
        <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            تسجيل الدخول
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-amber-500/50">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL || undefined} alt="User avatar" />
            <AvatarFallback className="bg-amber-100 text-amber-900 font-bold">
                {getInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 border-amber-500/20" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2 py-1">
            <p className="text-sm font-bold leading-none text-amber-900">
                {user.displayName || "عضو ملكي"}
            </p>
            <p className="text-xs leading-none text-muted-foreground italic">
              {user.email || "No email"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* البوابة الملكية للمتحف */}
          <DropdownMenuItem asChild className="cursor-pointer focus:bg-amber-50">
             <a href="https://royal-academy-yalla-masry.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                <Castle className="mr-2 h-4 w-4 text-amber-600" />
                <span className="font-semibold text-amber-700">زيارة المتحف الملكي</span>
             </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
             <Link href="/dashboard" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>الملف الشخصي</span>
             </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>الاشتراكات الملكية</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>الإعدادات</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
