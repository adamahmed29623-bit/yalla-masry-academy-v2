'use client';
import React, { useState, useEffect } from 'react';
import { Star, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Confetti from 'react-confetti';

export default function ChallengeGame() {
  const [solved, setSolved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  const handleCorrectAnswer = () => {
    if (solved) return; // Prevent multiple submissions

    setSolved(true);
    setShowConfetti(true);

    // Update Nile Points
    const currentPoints = parseInt(localStorage.getItem('nilePoints') || '0');
    const newPoints = currentPoints + 10;
    localStorage.setItem('nilePoints', newPoints.toString());

    // Manually trigger a storage event to notify other tabs/components (like the dashboard)
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'nilePoints',
        newValue: newPoints.toString(),
    }));

    toast({
        title: "🎉 أحسنت!",
        description: "لقد حصلت على 10 نقاط نيل جديدة.",
    });

    // Hide confetti after some time
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <div className="min-h-screen bg-[#061121] flex items-center justify-center p-6 text-white" dir="rtl">
        <div className="bg-[#0f1c2e] p-10 rounded-[50px] border-4 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.2)] max-w-2xl w-full text-center">
          <Zap className="mx-auto text-amber-500 mb-4 animate-pulse" size={48} />
          <h2 className="text-3xl font-black text-white mb-6 italic">ما معنى كلمة "ازيك"؟</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {['كيف حالك؟', 'أين تذهب؟', 'ما اسمك؟'].map((ans, i) => (
              <button 
                key={i}
                onClick={() => {
                  if (i === 0) {
                    handleCorrectAnswer();
                  } else if (!solved) {
                    toast({ variant: 'destructive', title: "حاول مرة أخرى!", description: "إجابة غير صحيحة." });
                  }
                }}
                disabled={solved}
                className={`p-5 rounded-2xl font-bold text-xl border-2 transition-all disabled:cursor-not-allowed ${
                  solved && i === 0 
                  ? 'bg-emerald-500 border-emerald-400 text-white' 
                  : 'bg-white/5 border-white/10 hover:border-amber-500'
                }`}
              >
                {ans}
              </button>
            ))}
          </div>

          {solved && (
            <div className="mt-8 animate-bounce text-amber-500 font-black flex items-center justify-center gap-2 text-lg">
              <Star fill="currentColor" /> إجابة صحيحة! تم إضافة 10 نقاط <Star fill="currentColor" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
