'use client';

import React from 'react';
import { Users, FilePlus, MessageCircle, BarChart3, GraduationCap } from 'lucide-react';

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-[#061121] text-white p-6" dir="rtl">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-10 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-amber-400" size={32} />
          <span className="text-xl font-black text-amber-400">منصة المعلمة الملكية</span>
        </div>
        <button className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">تسجيل خروج</button>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* إحصائيات الفصول */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-6 rounded-[30px] text-[#061121]">
            <h3 className="font-bold mb-1">إجمالي الطلاب</h3>
            <div className="text-4xl font-black">158</div>
          </div>
          <div className="bg-white/5 p-6 rounded-[30px] border border-white/10">
            <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
              <Users size={20} /> طلاب يحتاجون تشجيعاً
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                <span>أحمد محمد</span>
                <button className="text-amber-400 text-xs">إرسال وسام ✨</button>
              </li>
              <li className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                <span>ليلى يوسف</span>
                <button className="text-amber-400 text-xs">إرسال وسام ✨</button>
              </li>
            </ul>
          </div>
        </div>

        {/* منطقة العمل الرئيسية */}
        <div className="lg:col-span-2 bg-white/5 p-8 rounded-[40px] border border-white/10">
          <h2 className="text-2xl font-black text-amber-400 mb-6 flex items-center gap-2">
            <FilePlus /> إضافة محتوى تعليمي جديد
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button className="p-8 bg-blue-600/20 border-2 border-blue-500/30 rounded-3xl hover:bg-blue-600/40 transition-all text-center">
              <span className="block text-3xl mb-2">📽️</span>
              رفع فيديو تعليمي
            </button>
            <button className="p-8 bg-emerald-600/20 border-2 border-emerald-500/30 rounded-3xl hover:bg-emerald-600/40 transition-all text-center">
              <span className="block text-3xl mb-2">📝</span>
              إنشاء اختبار ذكاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
