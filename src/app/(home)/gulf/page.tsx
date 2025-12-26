'use client';
import React, { useState } from 'react';
import { 
  Sparkles, Map, Gift, Star, Lock, 
  MapPin, BrainCircuit, Trophy, Send, Mic, RefreshCw, CheckCircle, Coffee
} from 'lucide-react';
import Image from 'next/image';

export default function GulfSectionPage() {
  const [activeTab, setActiveTab] = useState('map'); 
  const [points, setPoints] = useState(250);

  // صورة نوف الافتراضية (طفلة بعباءة سمراء)
  const noufAvatar = "https://img.freepik.com/free-vector/cute-hijab-girl-wearing-black-abaya-cartoon-vector-icon-illustration_138676-3482.jpg";

  return (
    <div className="min-h-screen bg-[#061121] text-white font-body rtl" dir="rtl">
      
      {/* 1. قسم التعريف (مجلس الخليج) */}
      <div className="bg-amber-600/10 border-b border-amber-500/20 py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm font-bold text-amber-500">
          <div className="flex items-center gap-2">
            <Coffee size={18} /> مجلس الخليج لتعليم اللهجة المصرية
          </div>
          <div>أكاديمية يلا مصري 🇪🇬 ✨</div>
        </div>
      </div>

      {/* 2. هيدر الرحلة وصورة نوف */}
      <header className="bg-gradient-to-b from-[#0d284e] to-[#061121] pt-12 pb-24 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          
          {/* برواز صورة نوف الملكي */}
          <div className="relative mb-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.3)] overflow-hidden bg-white">
              <Image src={noufAvatar} alt="نوف" layout="fill" className="object-cover scale-110" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-full border-4 border-[#061121]">
                <CheckCircle size={20} className="text-white" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/10 mb-6 flex items-center gap-3">
             <Trophy className="text-amber-500" /> 
             <span className="font-black text-xl text-amber-500">رصيد نوف: {points} نقطة نيل</span>
          </div>
          
          <h1 className="text-5xl font-black mb-4 font-display">رحلة "نوف" الاستكشافية</h1>
          <p className="text-blue-200 text-xl max-w-2xl mx-auto leading-relaxed">
            أهلاً بكم في **مجلس الخليج**. انضموا إلى نوف في رحلتها من الخليج إلى قلب القاهرة لتعلم لغة "ابن البلد" وتجميع الهدايا الملكية!
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-10 pb-20">
        
        {/* أزرار التنقل */}
        <div className="flex justify-center gap-4 mb-12 relative z-20">
          <button 
            onClick={() => setActiveTab('map')} 
            className={`px-10 py-4 rounded-2xl font-black transition-all flex items-center gap-2 shadow-xl ${activeTab === 'map' ? 'bg-amber-500 text-black scale-105' : 'bg-white/10 border border-white/10'}`}
          >
            <Map size={20} /> خريطة المهمات
          </button>
          <button 
            onClick={() => setActiveTab('gifts')} 
            className={`px-10 py-4 rounded-2xl font-black transition-all flex items-center gap-2 shadow-xl ${activeTab === 'gifts' ? 'bg-emerald-500 text-white scale-105' : 'bg-white/10 border border-white/10'}`}
          >
            <Gift size={20} /> حقيبة الجوائز
          </button>
        </div>

        {activeTab === 'map' ? (
          <div className="space-y-8">
            <div className="bg-blue-600/20 p-6 rounded-3xl border border-blue-500/30 text-center mb-8 italic">
                📌 "نوف الآن في خان الخليلي.. ساعديها لكي تفتح صندوق الهدايا الأول!"
            </div>

            {/* مراحل الرحلة */}
            <JourneyStep 
                city="خان الخليلي - القاهرة" 
                task="تعلمي كيف تفاصلين في السعر بالمصري: 'آخرها كام يا عمو؟'"
                status="active" 
                points="+50 نقطة"
                avatar={noufAvatar}
            />
            
            <JourneyStep 
                city="أهرامات الجيزة" 
                task="تحدي Gemini: صفي الهرم الأكبر بـ 3 كلمات مصرية"
                status="locked" 
                points="+100 نقطة"
                avatar={noufAvatar}
            />
          </div>
        ) : (
          /* متجر الجوائز */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in zoom-in duration-500">
            <PrizeCard name="عباءة نوف الذهبية" icon="✨" price={500} />
            <PrizeCard name="خاتم توت عنخ آمون" icon="💍" price={300} />
            <PrizeCard name="صندوق حلويات مصرية" icon="🍯" price={150} />
          </div>
        )}
      </main>
    </div>
  );
}

// مكون المرحلة (Step Card)
function JourneyStep({ city, task, status, points, avatar }: any) {
  return (
    <div className={`p-8 rounded-[45px] border-2 transition-all ${status === 'active' ? 'bg-[#0f1c2e] border-amber-500 shadow-2xl scale-[1.02]' : 'bg-white/5 border-white/10 opacity-50'}`}>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 rounded-3xl bg-white border-2 border-amber-500 overflow-hidden flex-shrink-0 relative">
          <Image src={avatar} alt="Nouf" layout="fill" className="object-cover" />
        </div>
        <div className="flex-1 text-center md:text-right">
          <div className="text-amber-500 font-black mb-1 flex items-center justify-center md:justify-start gap-2">
            <MapPin size={18} /> {city}
          </div>
          <h3 className="text-2xl font-black mb-3">{task}</h3>
          <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-sm font-bold">{points} مكافأة</span>
        </div>
        <button 
          disabled={status === 'locked'}
          className={`px-10 py-4 rounded-2xl font-black transition-all ${status === 'active' ? 'bg-amber-500 text-black hover:bg-white shadow-lg' : 'bg-gray-700 text-gray-500'}`}
        >
          {status === 'active' ? 'انطلقي يا نوف! 🚀' : 'مغلق 🔒'}
        </button>
      </div>
    </div>
  );
}

// مكون الجائزة (Prize Card)
function PrizeCard({ name, icon, price }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-10 rounded-[50px] text-center hover:border-amber-500 transition-all group">
      <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-2xl font-black mb-2">{name}</h3>
      <p className="text-amber-500 font-bold mb-8 italic">{price} نقطة نيل</p>
      <button className="w-full py-4 bg-white/5 rounded-2xl font-black text-gray-500 border border-white/5">قيد الانتظار..</button>
    </div>
  );
}
