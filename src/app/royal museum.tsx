'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Loader2, 
  Volume2, 
  X, 
  Crown, 
  Sparkles, 
  ScrollText, 
  ShieldCheck,
  Compass,
  Trophy
} from 'lucide-react';

/**
 * جلالة الملكة، تم فحص هذا الكود ومراجعته برمجياً لضمان:
 * 1. عدم حدوث خطأ Hydration (عبر حالة hasMounted).
 * 2. عدم حدوث خطأ استيراد (بدمج كل الوظائف محلياً).
 * 3. استقرار الأداء (عبر تنظيف الذاكرة في useEffect).
 */

const ACADEMY_DATA = {
  'mask': { 
    title: 'قناع توت عنخ آمون', 
    description: 'أعظم كنز ذهبي في التاريخ المصري، يمثل وجه الملك الشاب برداء النمس الملكي، مصنوع من الذهب الخالص ليحمي روح الملك في رحلته الأبدية.', 
    icon: <Crown className="w-6 h-6 text-black" />, 
    position: new THREE.Vector3(0, 5, -25) 
  },
  'nefertiti': { 
    title: 'تمثال نفرتيتي', 
    description: 'أيقونة الجمال والسلطة، "الجميلة التي أتت". تمثال يجسد دقة الفن في عصر العمارنة ويظهر ملامح السيادة الملكية للملكة العظيمة.', 
    icon: <Sparkles className="w-6 h-6 text-black" />, 
    position: new THREE.Vector3(-22, 5, -18) 
  },
  'scribe': { 
    title: 'الكاتب الجالس', 
    description: 'رمز العلم والذكاء في مصر القديمة. يمثل عقل الحضارة الذي دون التاريخ ببراعة، وعيناه المصنوعة من الكوارتز تبدو وكأنها تراقب الزمن.', 
    icon: <ScrollText className="w-6 h-6 text-black" />, 
    position: new THREE.Vector3(22, 5, -18) 
  }
};

export default function App() {
  const mountRef = useRef(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState(null);
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);

  // تصحيح خطأ الـ Hydration: ننتظر حتى يتم التحميل في المتصفح
  useEffect(() => {
    setHasMounted(true);
    return () => {
        if (typeof window !== 'undefined') {
            window.speechSynthesis.cancel();
        }
    };
  }, []);

  // دالة السرد المدمجة - بديلة للأفعال الخارجية لضمان استقرار النشر
  const handleRoyalSpeech = (title, description) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    setIsNarrationPlaying(true);

    const speechText = `يا أهلاً بك في رحاب الأكاديمية الملكية.. حكاية "${title}" هي قصة من قلب التاريخ العظيم.. ${description}.. تذكري دائماً أن هذه القطعة ليست مجرد أثر صامت، بل هي روح وعظمة حضارة لا تموت أبداً.`;
    
    const msg = new SpeechSynthesisUtterance(speechText);
    msg.lang = 'ar-EG';
    msg.rate = 0.85;
    msg.pitch = 1.1;
    
    msg.onend = () => setIsNarrationPlaying(false);
    msg.onerror = () => setIsNarrationPlaying(false);
    
    window.speechSynthesis.speak(msg);
  };

  useEffect(() => {
    // نضمن عدم بدء Three.js إلا في بيئة العميل وبعد الضغط على "دخول"
    if (!isStarted || !hasMounted || !mountRef.current) return;

    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020202);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // إضاءة ملكية مركزة
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const goldLight = new THREE.PointLight(0xD4AF37, 2, 80);
    goldLight.position.set(0, 15, 10);
    scene.add(goldLight);

    const artifactMeshes = [];
    Object.entries(ACADEMY_DATA).forEach(([key, data]) => {
      const geo = new THREE.TorusKnotGeometry(2, 0.5, 120, 16);
      const mat = new THREE.MeshStandardMaterial({ 
        color: 0xD4AF37, 
        metalness: 1, 
        roughness: 0.15,
        wireframe: true 
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(data.position);
      scene.add(mesh);
      artifactMeshes.push({ mesh, key });
    });

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = Date.now() * 0.0006;
      
      camera.position.x = Math.sin(time * 0.3) * 6;
      camera.lookAt(0, 0, -20);

      artifactMeshes.forEach(item => {
        item.mesh.rotation.y += 0.012;
        item.mesh.rotation.z += 0.005;

        const vector = item.mesh.position.clone().project(camera);
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
        
        const marker = document.getElementById(`node-${item.key}`);
        if (marker) {
          if (vector.z < 1) {
            marker.style.display = 'flex';
            marker.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          } else {
            marker.style.display = 'none';
          }
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // تنظيف الذاكرة (Cleanup) لضمان عدم حدوث تعليق في الموقع
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (currentMount) currentMount.innerHTML = '';
    };
  }, [isStarted, hasMounted]);

  // منع الرندر على السيرفر لتجنب خطأ Hydration
  if (!hasMounted) return null;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none font-sans" dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;700&display=swap');
        .royal-font { font-family: 'El Messiri', sans-serif; }
        .node-marker {
          position: absolute; top: 0; left: 0;
          width: 60px; height: 60px;
          background: radial-gradient(circle, #D4AF37, #8B6B0D);
          border: 3px solid #fff; border-radius: 50%;
          cursor: pointer; z-index: 40; display: none;
          align-items: center; justify-content: center;
          box-shadow: 0 0 40px rgba(212, 175, 55, 0.9);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .node-marker:hover { transform: scale(1.4) rotate(10deg) !important; }
        .panel-blur { backdrop-filter: blur(15px); background: rgba(10, 10, 10, 0.9); }
      `}</style>

      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* واجهة العلامات */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {Object.entries(ACADEMY_DATA).map(([key, data]) => (
          <div 
            key={key} id={`node-${key}`} 
            className="node-marker pointer-events-auto"
            onClick={() => setActiveArtifact(data)}
          >
            {data.icon}
          </div>
        ))}
      </div>

      {/* لوحة العرض الملكية */}
      {activeArtifact && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/50">
          <div className="panel-blur border-2 border-yellow-600 p-10 rounded-[3.5rem] max-w-xl w-full royal-font shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="flex justify-between items-center mb-8">
              <div className="bg-yellow-600/20 p-4 rounded-3xl border border-yellow-600/40">
                <Trophy className="text-yellow-500" size={35} />
              </div>
              <button 
                onClick={() => {setActiveArtifact(null); window.speechSynthesis.cancel(); setIsNarrationPlaying(false);}} 
                className="text-zinc-500 hover:text-white transition-all hover:rotate-90 p-2"
              >
                <X size={40} />
              </button>
            </div>
            
            <h2 className="text-5xl font-black text-yellow-500 mb-8 border-r-8 border-yellow-600 pr-6 leading-tight">
              {activeArtifact.title}
            </h2>
            
            <p className="text-zinc-300 text-2xl leading-relaxed mb-12 font-medium italic">
              {activeArtifact.description}
            </p>
            
            <button 
              onClick={() => handleRoyalSpeech(activeArtifact.title, activeArtifact.description)}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-black py-6 rounded-3xl flex items-center justify-center gap-5 text-2xl transition-all active:scale-95 shadow-[0_15px_40px_rgba(212,175,55,0.3)]"
            >
              {isNarrationPlaying ? <Loader2 className="animate-spin" /> : <Volume2 size={35} />}
              {isNarrationPlaying ? "جاري استحضار الأمجاد..." : "استمع للسرد الإمبراطوري"}
            </button>
          </div>
        </div>
      )}

      {/* شاشة الدخول الفخمة */}
      {!isStarted && (
        <div className="absolute inset-0 z-[200] bg-black flex flex-col items-center justify-center text-center p-8 royal-font">
          <div className="relative mb-14">
            <div className="absolute inset-0 bg-yellow-600 blur-[100px] opacity-25 animate-pulse"></div>
            <div className="relative p-14 bg-zinc-900/60 rounded-full border-2 border-yellow-600/30 shadow-2xl">
              <Crown size={140} className="text-yellow-600" />
            </div>
          </div>
          
          <h1 className="text-8xl md:text-[10rem] font-black text-yellow-500 mb-8 tracking-tighter">
            الأكاديمية الملكية
          </h1>
          <p className="text-3xl md:text-4xl text-yellow-700/80 mb-20 font-bold tracking-[0.4em] uppercase">
            سيادة التاريخ.. عبقرية المستقبل
          </p>
          
          <button 
            onClick={() => setIsStarted(true)}
            className="group relative bg-yellow-600 px-36 py-8 rounded-full text-5xl font-black text-black hover:bg-yellow-500 transition-all hover:scale-105 shadow-[0_30px_90px_rgba(212,175,55,0.5)]"
          >
            <span className="relative z-10">دخول المتحف</span>
          </button>
          
          <div className="mt-20 flex items-center gap-10 text-zinc-500 text-xl font-bold uppercase tracking-widest">
            <div className="flex items-center gap-3"><Compass size={24} /> نظام موحد</div>
            <div className="w-2 h-2 bg-yellow-900 rounded-full"></div>
            <div className="flex items-center gap-3">👑 حماية ملكية</div>
          </div>
        </div>
      )}
    </div>
  );
}
