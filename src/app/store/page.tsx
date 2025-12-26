'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Gem, CheckCircle } from 'lucide-react';

export default function RoyalStore() {
  const [points, setPoints] = useState(0);
  const [myItems, setMyItems] = useState<string[]>([]);

  useEffect(() => {
    // We need to ensure localStorage is accessed only on the client
    setPoints(parseInt(localStorage.getItem('nilePoints') || '0'));
    const savedItems = JSON.parse(localStorage.getItem('userItems') || '[]');
    setMyItems(savedItems);
  }, []);

  const shopItems = [
    { id: 'crown_gold', name: 'التاج الذهبي', price: 500, icon: '👑', desc: 'يظهر بجانب اسمك في لوحة الصدارة' },
    { id: 'cat_pet', name: 'القط "بسبس" المرافق', price: 1000, icon: '🐱', desc: 'يصحبك في كل التحديات' },
    { id: 'voice_effect', name: 'مغير الصوت السحري', price: 1500, icon: '🪄', desc: 'يغير صوتك لصوت فرعوني قوي' },
  ];

  const buyItem = (id: string, price: number) => {
    if (points >= price) {
      const newPoints = points - price;
      setPoints(newPoints);
      const newItems = [...myItems, id];
      setMyItems(newItems);
      
      localStorage.setItem('nilePoints', newPoints.toString());
      localStorage.setItem('userItems', JSON.stringify(newItems));
      alert("🎉 تم الشراء بنجاح! مبروك غرضك الملكي الجديد.");
    } else {
      alert("❌ عذراً يا بطلة، نقاطك لا تكفي.. استمري في التحديات!");
    }
  };

  return (
    <div className="min-h-screen bg-[#051124] text-white p-8" dir="rtl">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-amber-400 flex items-center gap-3">
          <ShoppingBag size={40} /> المتجر الملكي
        </h1>
        <div className="bg-blue-900 border-2 border-amber-400 px-6 py-2 rounded-2xl flex items-center gap-3 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
          <Gem className="text-amber-400 animate-pulse" />
          <span className="text-2xl font-black">{points}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {shopItems.map((item) => {
          const isOwned = myItems.includes(item.id);
          return (
            <div key={item.id} className="bg-white/5 border border-white/10 p-8 rounded-[3rem] text-center relative group hover:bg-white/10 transition-all">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <p className="text-xs text-blue-200 mb-6">{item.desc}</p>
              
              <button
                disabled={isOwned || points < item.price}
                onClick={() => buyItem(item.id, item.price)}
                className={`w-full py-3 rounded-2xl font-black transition-all ${
                  isOwned ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' :
                  points >= item.price ? 'bg-amber-400 text-blue-900 shadow-lg shadow-amber-400/20' : 
                  'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
              >
                {isOwned ? (
                  <span className="flex items-center justify-center gap-2"><CheckCircle size={18}/> تمتلكينه</span>
                ) : (
                  `شراء بـ ${item.price} 💎`
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
