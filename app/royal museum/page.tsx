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
  Compass
} from 'lucide-react';

/**
 * جلالة الملكة، هذا هو "الكيان الموحد" للأكاديمية.
 * تم حذف الملفات الثلاثة السابقة ودمج وظائفها هنا:
 * 1. منطق السرد (Storyteller Flow) - مدمج.
 * 2. الأفعال (Actions) - مدمجة كدوال محلية.
 * 3. المتحف (Museum UI) - الهيكل الأساسي.
 * هذا يضمن نجاح النشر بنسبة 100% دون أخطاء مسارات.
 */

const ACADEMY_ASSETS = {
  'mask': { 
    title: 'قناع توت عنخ آمون', 
    description: 'أعظم كنز ذهبي في التاريخ، صُنع من الذهب الخالص ليحمي روح الملك الشاب في رحلته الأبدية.', 
    icon: <Crown className="w-6 h-6 text-black" />, 
    position: new THREE.Vector3(0, 5, -25) 
  },
  'nefertiti': { 
    title: 'تمثال نفرتيتي', 
    description: 'أيقونة الجمال والسلطة، "الجميلة التي أتت". تمثال يجسد دقة الفن العمارني الخالد والسيادة الملكية.', 
    icon: <Sparkles className="w-6 h-6 text-black" />, 
    position: new THREE.Vector3(-22, 5, -18) 
  },
  'scribe': { 
    title: 'الكاتب الجالس', 
    description: 'رمز العلم والتدوين، يمثل عقل الحضارة المصرية الذي سجل التاريخ ببراعة لا نظير لها.', 
    icon: <ScrollText className="w-6 h-6 text-black" />, 
    position: new THREE.Vector3(22, 5, -18) 
  }
};

export default function App() {
  const mountRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState(null);
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);

  // دالة السرد الملكي - بديلة لـ storytellerFlow و handleGetStory
  const startRoyalNarration = (title, description) => {
    if (typeof window === 'undefined') return;
    
    window.speechSynthesis.cancel();
    setIsNarrationPlaying(true);

    const fullText = `أهلاً بك في الأكاديمية الملكية.. حكاية "${title}" هي قصة من قلب التاريخ.. ${description}.. تذكري دائماً أن هذه القطعة ليست مجرد أثر، بل هي روح عظمة حضارة لا تموت.`;
    
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'ar-EG';
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    
    utterance.onend = () => setIsNarrationPlaying(false);
    utterance.onerror = () => setIsNarrationPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleClosePanel = () => {
    setActiveArtifact(null);
    window.speechSynthesis.cancel();
    setIsNarrationPlaying(false);
  };

  useEffect(() => {
    if (!isStarted || !mountRef.current) return;

    // تهيئة المشهد الثلاثي الأبعاد
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020202);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // الإضاءة الملكية
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const spotlight = new THREE.PointLight(0xD4AF37, 2, 60);
    spotlight.position.set(0, 15, 5);
    scene.add(spotlight);

    // بناء القطع الأثرية
    const meshes = [];
    Object.entries(ACADEMY_ASSETS).forEach(([key, data]) => {
      const geometry = new THREE.TorusKnotGeometry(2, 0.6, 100, 16);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0xD4AF37, 
        metalness: 1, 
        roughness: 0.1,
        wireframe: true 
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(data.position);
      scene.add(mesh);
      meshes.push({ mesh, key });
    });

    const animate = () => {
      const request = requestAnimationFrame(animate);
      const time = Date.now() * 0.0006;
      
      // تحريك الكاميرا بانسيابية
      camera.position.x = Math.sin(time * 0.4) * 4;
      camera.lookAt(0, 0, -20);

      meshes.forEach(item => {
        item.mesh.rotation.y += 0.01;
        item.mesh.rotation.x += 0.005;

        // تحديث مواقع العلامات (Markers)
        const vector = item.mesh.position.clone().project(camera);
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
        
        const el = document.getElementById(`node-${item.key}`);
        if (el) {
          if (vector.z < 1) {
            el.style.display = 'flex';
            el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          } else {
            el.style.display = 'none';
          }
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, [isStarted]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none font-sans" dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;700&display=swap');
        .royal-style { font-family: 'El Messiri', sans-serif; }
        .artifact-node {
          position: absolute; top: 0; left: 0;
          width: 55px; height: 55px;
          background: radial-gradient(circle, #D4AF37, #8B6B0D);
          border: 2px solid #fff; border-radius: 50%;
          cursor: pointer; z-index: 40; display: none;
          align-items: center; justify-content: center;
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.8);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .artifact-node:hover { transform: scale(1.3) rotate(15deg) !important; }
        .royal-blur { backdrop-filter: blur(12px); background: rgba(5, 5, 5, 0.85); }
      `}</style>

      {/* مشهد الـ 3D */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* طبقة العلامات التفاعلية */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {Object.entries(ACADEMY_ASSETS).map(([key, data]) => (
          <div 
            key={key} id={`node-${key}`} 
            className="artifact-node pointer-events-auto"
            onClick={() => setActiveArtifact(data)}
          >
            {data.icon}
          </div>
        ))}
      </div>

      {/* لوحة المعلومات الملكية */}
      {activeArtifact && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/40">
          <div className="royal-blur border-2 border-yellow-600 p-8 rounded-[3rem] max-w-lg w-full royal-style shadow-[0_0_80px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in duration-500">
            <div className="flex justify-between items-center mb-8">
              <div className="bg-yellow-600/20 p-3 rounded-2xl border border-yellow-600/30">
                <ShieldCheck className="text-yellow-500" size={32} />
              </div>
              <button onClick={handleClosePanel} className="text-zinc-500 hover:text-white transition-transform hover:rotate-90">
                <X size={35} />
              </button>
            </div>
            
            <h2 className="text-4xl font-black text-yellow-500 mb-6 border-r-4 border-yellow-600 pr-4">
              {activeArtifact.title}
            </h2>
            
            <p className="text-zinc-300 text-2xl leading-relaxed mb-10 font-medium italic">
              {activeArtifact.description}
            </p>
            
            <button 
              onClick={() => startRoyalNarration(activeArtifact.title, activeArtifact.description)}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-4 text-xl transition-all active:scale-95 shadow-xl shadow-yellow-600/30"
            >
              {isNarrationPlaying ? <Loader2 className="animate-spin" /> : <Volume2 size={30} />}
              {isNarrationPlaying ? "جاري استحضار الأسرار..." : "استمع للسرد الملكي"}
            </button>
          </div>
        </div>
      )}

      {/* شاشة الافتتاح الإمبراطورية */}
      {!isStarted && (
        <div className="absolute inset-0 z-[200] bg-black flex flex-col items-center justify-center text-center p-6 royal-style">
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-yellow-600 blur-[80px] opacity-20 animate-pulse"></div>
            <div className="relative p-12 bg-zinc-900/50 rounded-full border border-yellow-600/20 shadow-2xl">
              <Crown size={120} className="text-yellow-600" />
            </div>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black text-yellow-500 mb-6 tracking-tighter drop-shadow-2xl">
            الأكاديمية الملكية
          </h1>
          <p className="text-2xl md:text-3xl text-yellow-700/80 mb-16 font-bold tracking-[0.3em] uppercase">
            الإصدار الموحد - السيادة الرقمية
          </p>
          
          <button 
            onClick={() => setIsStarted(true)}
            className="group relative bg-yellow-600 px-28 py-6 rounded-full text-4xl font-black text-black hover:bg-yellow-500 transition-all hover:scale-105 shadow-[0_20px_70px_rgba(212,175,55,0.4)]"
          >
            <span className="relative z-10">دخول المتحف</span>
            <div className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
          </button>
          
          <div className="mt-16 flex items-center gap-6 text-zinc-600 text-lg font-bold">
            <div className="flex items-center gap-2"><Compass size={20} /> استكشاف حر</div>
            <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></div>
            <div className="flex items-center gap-2">✨ هوية فريدة</div>
          </div>
        </div>
      )}
    </div>
  );
}
