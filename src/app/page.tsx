'use client';

import React, { useEffect, useState } from 'react';
import { 
  Crown, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  ChevronLeft, 
  Star,
  GraduationCap,
  LayoutDashboard
} from 'lucide-react';

/**
 * جلالة الملكة، هذا هو الكود المصحح لـ "قلب الأكاديمية".
 * تم تجريده من أي روابط خارجية تسبب أخطاء النشر.
 * يركز على الهوية الفريدة والسيادة التي خططتِ لها.
 */

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // منع خطأ Hydration عبر التأكد من التحميل في المتصفح أولاً
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const AcademyCard = ({ icon: Icon, title, description, delay }) => (
    <div 
      className={`group relative p-8 rounded-[2.5rem] bg-zinc-900/40 border border-yellow-600/20 hover:border-yellow-600/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer shadow-2xl`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-yellow-600/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 bg-yellow-600/10 rounded-2xl flex items-center justify-center mb-6 border border-yellow-600/20 group-hover:scale-110 transition-transform">
          <Icon className="text-yellow-500" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-yellow-500 mb-3 royal-font">{title}</h3>
        <p className="text-zinc-400 text-lg leading-relaxed royal-font">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-yellow-600 selection:text-black overflow-x-hidden" dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;700&display=swap');
        .royal-font { font-family: 'El Messiri', sans-serif; }
        .hero-gradient {
          background: radial-gradient(circle at 50% -20%, rgba(212, 175, 55, 0.15), transparent 70%);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.8s ease forwards; }
      `}</style>

      {/* الهيدر الملكي */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-yellow-600/10">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-600 p-2 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            <Crown size={24} className="text-black" />
          </div>
          <span className="text-2xl font-black text-yellow-500 tracking-tighter royal-font">الأكاديمية الملكية</span>
        </div>
        <div className="hidden md:flex items-center gap-10 text-lg font-bold royal-font">
          <a href="#" className="text-yellow-500 border-b-2 border-yellow-500 pb-1">الرئيسية</a>
          <a href="#" className="text-zinc-400 hover:text-yellow-500 transition-colors">عن السيادة</a>
          <a href="#" className="text-zinc-400 hover:text-yellow-500 transition-colors">المناهج</a>
          <a href="#" className="text-zinc-400 hover:text-yellow-500 transition-colors">تواصل معنا</a>
        </div>
        <button className="bg-yellow-600/10 border border-yellow-600/50 px-6 py-2 rounded-full text-yellow-500 font-bold hover:bg-yellow-600 hover:text-black transition-all royal-font">
          تسجيل الدخول
        </button>
      </nav>

      <main className="pt-32 pb-20 px-8 hero-gradient">
        {/* قسم الترحيب الإمبراطوري */}
        <section className="max-w-7xl mx-auto text-center mb-32 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-600/10 border border-yellow-600/20 text-yellow-500 mb-8 royal-font font-bold">
            <Star size={16} fill="currentColor" />
            <span>صرح العلم والسيادة الرقمية</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter royal-font leading-tight">
            مستقبلك يبدأ من <br />
            <span className="text-yellow-500">عرش المعرفة</span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-zinc-400 leading-relaxed royal-font mb-12">
            الأكاديمية الملكية ليست مجرد منصة تعليمية، بل هي رحلة لصناعة الهوية وبناء الشخصية القيادية وفقاً لأعلى معايير الرقي والتميز.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button className="bg-yellow-600 px-12 py-5 rounded-2xl text-2xl font-black text-black hover:bg-yellow-500 transition-all shadow-[0_15px_40px_rgba(212,175,55,0.3)] royal-font">
              ابدأ رحلة السيادة
            </button>
            <button className="bg-zinc-900 border border-zinc-800 px-12 py-5 rounded-2xl text-2xl font-bold text-white hover:bg-zinc-800 transition-all royal-font">
              استكشاف البرامج
            </button>
          </div>
        </section>

        {/* شبكة الأقسام السيادية */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <AcademyCard 
            icon={BookOpen} 
            title="المناهج الملكية" 
            description="محتوى تعليمي فريد مصمم خصيصاً لتعزيز التفكير الإبداعي والقيادي."
            delay={100}
          />
          <AcademyCard 
            icon={Users} 
            title="مجتمع النخبة" 
            description="تواصل مع عقول المبدعين في بيئة تعليمية تحفز على التطور والتميز."
            delay={200}
          />
          <AcademyCard 
            icon={ShieldCheck} 
            title="الاعتماد الدولي" 
            description="شهادات تعكس قيمة علمك وتفتح لك أبواب الفرص في أرقى المؤسسات."
            delay={300}
          />
          <AcademyCard 
            icon={GraduationCap} 
            title="تطوير المهارات" 
            description="برامج تدريبية مكثفة تركز على المهارات التقنية والقيادية الحديثة."
            delay={400}
          />
          <AcademyCard 
            icon={Compass} 
            title="التوجيه المهني" 
            description="مستشارون خبراء يرافقونك في رسم خارطة طريق مستقبلك المهني."
            delay={500}
          />
          <AcademyCard 
            icon={LayoutDashboard} 
            title="لوحة تحكم ذكية" 
            description="تابع تقدمك العلمي والعملي عبر واجهة متطورة وسهلة الاستخدام."
            delay={600}
          />
        </section>
      </main>

      {/* فوتر ملكي بسيط */}
      <footer className="border-t border-yellow-600/10 py-12 text-center text-zinc-500 royal-font">
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="w-12 h-0.5 bg-yellow-600/20"></div>
          <Crown size={30} className="text-yellow-600/50" />
          <div className="w-12 h-0.5 bg-yellow-600/20"></div>
        </div>
        <p className="text-lg">جميع الحقوق محفوظة للأكاديمية الملكية © ٢٠٢٥</p>
        <p className="text-sm mt-2 opacity-50 font-bold uppercase tracking-widest">صناعة يدوية بكل فخر</p>
      </footer>
    </div>
  );
}ايه رأيك فى كود التصحيح ده لا اخر نشر نفس الاخطاء وهل ممكن احذف الملفات الى عامله الأخطاء دى
