'use client';

import React from 'react';
import { Volume2, Lightbulb } from 'lucide-react';

export default function LessonOnePage() {
  const dictionary = [
    { word: 'إزيك؟', meaning: 'How are you?', response: 'تمام / كلو تمام' },
    { word: 'عامل إيه؟', meaning: 'What are you doing? (to male)', response: 'الحمد لله' },
    { word: 'إيه الأخبار؟', meaning: "What's the news?", response: 'قشطة / زي الفل' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#061121] font-body rtl" dir="rtl">
      {/* منطقة الفيديو / الدرس */}
      <div className="bg-[#061121] p-8 md:p-12 text-white rounded-b-[60px] shadow-2xl">
        <div className="max-w-4xl mx-auto text-center">
           <h1 className="text-3xl font-black text-amber-500 mb-8 italic text-right flex items-center gap-2 font-display">
             <Lightbulb className="text-amber-500" /> الدرس الأول: السلام والتحية
           </h1>
           <div className="aspect-video bg-white/5 rounded-[40px] border-2 border-white/10 flex items-center justify-center relative overflow-hidden">
              <span className="text-gray-500">مشغل الفيديو التعليمي الملكي 📽️</span>
           </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-8">
        {/* قاموس الدرس التفاعلي */}
        <h2 className="text-2xl font-black mb-6 border-b-4 border-amber-500 inline-block font-display">قاموس "المصري الفصيح" 📜</h2>
        <div className="space-y-4 mb-12">
          {dictionary.map((item, index) => (
            <div key={index} className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <button className="bg-amber-100 p-3 rounded-full text-amber-600 hover:bg-amber-500 hover:text-white transition-colors">
                  <Volume2 size={24} />
                </button>
                <div>
                  <div className="text-2xl font-black text-[#0d284e]">{item.word}</div>
                  <div className="text-sm text-gray-500">{item.meaning}</div>
                </div>
              </div>
              <div className="text-left">
                <span className="text-xs text-blue-500 font-bold">الرد:</span>
                <div className="font-bold text-gray-700">{item.response}</div>
              </div>
            </div>
          ))}
        </div>

        {/* تحدي نهاية الدرس */}
        <div className="bg-emerald-500 text-white p-10 rounded-[40px] shadow-xl text-center">
           <h3 className="text-2xl font-black mb-4">اختبر نفسك!</h3>
           <p className="mb-8 font-bold">ما هو الرد المناسب على كلمة "إزيك"؟</p>
           <div className="flex flex-wrap justify-center gap-4">
             <button className="bg-white text-emerald-600 px-8 py-3 rounded-2xl font-black hover:scale-110 transition-transform">تمام</button>
             <button className="bg-white text-emerald-600 px-8 py-3 rounded-2xl font-black hover:scale-110 transition-transform">باي باي</button>
           </div>
        </div>
      </main>
    </div>
  );
}
