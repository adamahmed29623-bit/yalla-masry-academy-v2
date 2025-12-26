'use client';
import React, { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Sparkles, BrainCircuit, Trophy, Loader2 } from 'lucide-react';
import { handleSmartAdventure } from '@/app/actions';

function SubmitButton({ taskType }: { taskType: 'challenge' | 'correction' }) {
  const { pending } = useFormStatus();

  if (taskType === 'challenge') {
    return (
      <button 
        type="submit"
        name="taskType"
        value="challenge"
        disabled={pending}
        className="w-full py-4 bg-amber-500 text-black font-bold rounded-2xl hover:bg-white transition-all mb-6"
      >
        {pending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" /> جاري التفكير...
          </span>
        ) : "يا Gemini أعطني تحدي مصري!"}
      </button>
    );
  }

  return (
     <button 
      type="submit"
      name="taskType"
      value="correction"
      disabled={pending}
      className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-400 transition-all flex items-center justify-center gap-2"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" /> جاري التصحيح...
        </span>
      ) : (
        <>
          <Sparkles size={20} /> صحح لي يا معلمي الذكي
        </>
      )}
    </button>
  );
}


export default function SmartAdventure() {
  const [initialState, setInitialState] = useState({ message: "", text: ""});
  const [state, formAction] = useFormState(handleSmartAdventure, initialState);
  const [input, setInput] = useState("");
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    // When a challenge is received, clear the input field for the user's answer
    if (state.message === 'success' && state.text) {
        setFormKey(prev => prev + 1); // Reset form state by changing key
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-[#061121] text-white p-6 rtl" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* رأس الصفحة */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-amber-500/10 rounded-full mb-4">
            <BrainCircuit size={50} className="text-amber-500 animate-pulse" />
          </div>
          <h1 className="text-4xl font-black text-amber-500">مغامرة الذكاء الاصطناعي</h1>
          <p className="text-blue-200 mt-2 text-lg">Gemini هو معلمك الشخصي اليوم.. هل أنت مستعد؟</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* قسم التحدي الديناميكي */}
          <form key={formKey} action={formAction} className="bg-[#0f1c2e] p-8 rounded-[50px] border-2 border-white/5 shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Trophy className="text-amber-500" /> اطلب تحدياً أو تصحيحاً
                </h2>
                
                <SubmitButton taskType="challenge" />

                <textarea 
                  name="userInput"
                  className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 mb-4 outline-none focus:border-amber-500"
                  placeholder="اكتب جملتك هنا ليتم تصحيحها، أو اتركها فارغة لطلب تحدي..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />

                <SubmitButton taskType="correction" />
             </div>
          </form>

          {/* صندوق الرد الذكي */}
          {state.text && (
            <div className="bg-white/5 border border-amber-500/30 p-8 rounded-[40px] animate-in fade-in duration-700">
               <div className="flex items-center gap-2 text-amber-500 mb-4 font-black text-xl italic">
                  <Sparkles /> رد Gemini:
               </div>
               <p className="text-2xl leading-relaxed text-blue-50 font-medium whitespace-pre-wrap">
                  {state.text}
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
