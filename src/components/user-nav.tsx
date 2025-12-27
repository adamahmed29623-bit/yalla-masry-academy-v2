"use client"

import React from "react"
// استخدام أيقونات Lucide المتوفرة
import { 
  CreditCard, 
  LogOut, 
  Settings, 
  User, 
  LogIn, 
  Loader2, 
  Castle, 
  Crown,
  ChevronDown
} from "lucide-react"

/**
 * جلالة الملكة، تم تعديل المكون ليعمل بشكل مستقل عن المسارات الخارجية المفقودة
 * مع الحفاظ على التصميم الملكي والهوية البصرية الفاخرة.
 */

function getInitials(name) {
  if (!name) return "ع";
  const parts = name.split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// محاكاة حالة المستخدم لضمان عمل الواجهة في بيئة العرض
const mockUser = {
  displayName: "جلالة الملكة",
  email: "queen@yalla-masry.academy",
  photoURL: null
};

export default function App() {
  // استخدام حالة محلية للمحاكاة بدلاً من Firebase المفقود حالياً
  const [user, setUser] = React.useState(mockUser);
  const [isUserLoading, setIsUserLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    setIsUserLoading(true);
    setTimeout(() => {
      setUser(null);
      setIsUserLoading(false);
      setIsOpen(false);
    }, 1000);
  };

  const handleLogin = () => {
    setIsUserLoading(true);
    setTimeout(() => {
      setUser(mockUser);
      setIsUserLoading(false);
    }, 1000);
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-10 w-10">
        <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
      </div>
    )
  }

  if (!user) {
    return (
      <button 
        onClick={handleLogin}
        className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-2 rounded-xl shadow-md border-b-2 border-amber-900/20 transition-all font-bold"
      >
        <LogIn className="h-4 w-4" />
        تسجيل الدخول
      </button>
    )
  }

  return (
    <div className="relative inline-block text-right" dir="rtl">
      {/* زر التنبيه الملكي */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-12 w-12 rounded-full border-2 border-amber-500/30 hover:border-amber-500 transition-all p-0.5 shadow-inner bg-amber-50/50 flex items-center justify-center overflow-visible"
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-900 font-bold text-lg shadow-sm">
          {getInitials(user.displayName)}
        </div>
        {/* تاج السيادة */}
        <div className="absolute -top-2 -right-1 bg-amber-500 rounded-full p-1 border border-white shadow-sm">
          <Crown className="h-3 w-3 text-white" />
        </div>
      </button>

      {/* قائمة الخيارات الملكية */}
      {isOpen && (
        <div className="absolute left-0 mt-3 w-72 origin-top-left rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[100] border border-amber-100 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b border-amber-50 bg-amber-50/30">
            <p className="text-sm font-black text-amber-900 leading-none mb-1">
              {user.displayName}
            </p>
            <p className="text-xs text-amber-700/70 italic truncate">
              {user.email}
            </p>
          </div>

          <div className="p-2">
            {/* رابط المتحف العريق */}
            <a 
              href="https://royal-academy-yalla-masry.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-3 rounded-xl hover:bg-amber-50 transition-colors group"
            >
              <div className="bg-amber-100 p-2 rounded-lg mr-3 group-hover:bg-amber-200 transition-colors">
                <Castle className="h-5 w-5 text-amber-700" />
              </div>
              <div className="flex flex-col items-start text-right">
                <span className="font-bold text-amber-800 text-sm">زيارة المتحف الملكي</span>
                <span className="text-[10px] text-amber-600/70">تراثنا بين يديك</span>
              </div>
            </a>

            <div className="h-px bg-amber-100 my-2 mx-2"></div>

            <button className="w-full flex items-center p-2 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-700">
              <User className="h-4 w-4 ml-3 text-amber-600" />
              <span className="text-sm font-medium">الملف الشخصي</span>
            </button>
            
            <button className="w-full flex items-center p-2 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-700">
              <CreditCard className="h-4 w-4 ml-3 text-amber-600" />
              <span className="text-sm font-medium">الاشتراكات الملكية</span>
            </button>

            <button className="w-full flex items-center p-2 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-700">
              <Settings className="h-4 w-4 ml-3 text-amber-600" />
              <span className="text-sm font-medium">الإعدادات</span>
            </button>
          </div>

          <div className="p-2 border-t border-amber-50">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4 ml-3" />
              <span className="text-sm font-bold">مغادرة القصر</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
