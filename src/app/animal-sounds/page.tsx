'use client';

import React from 'react';
import AnimalSoundCard from '@/components/animal-sound-card';
import { Cat, Dog, Bird, Sheep, Horse, Bug } from 'lucide-react';

const animals = [
  { name: 'قطة', imageUrl: 'https://picsum.photos/seed/cat/400/400', imageHint: 'cat' },
  { name: 'كلب', imageUrl: 'https://picsum.photos/seed/dog/400/400', imageHint: 'dog' },
  { name: 'عصفور', imageUrl: 'https://picsum.photos/seed/bird/400/400', imageHint: 'bird' },
  { name: 'خروف', imageUrl: 'https://picsum.photos/seed/sheep/400/400', imageHint: 'sheep' },
  { name: 'حصان', imageUrl: 'https://picsum.photos/seed/horse/400/400', imageHint: 'horse' },
  { name: 'صرصور', imageUrl: 'https://picsum.photos/seed/cricket/400/400', imageHint: 'cricket bug' },
];

export default function AnimalSoundsPage() {
  return (
    <div className="min-h-screen bg-nile-blue p-6 md:p-12" dir="rtl">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gold-accent font-display mb-3">
          لعبة أصوات الحيوانات
        </h1>
        <p className="text-lg text-sand-ochre max-w-2xl mx-auto">
          اضغط على صورة الحيوان لتستمع إلى صوته! تجربة تعليمية ممتعة للأطفال مقدمة من Gemini.
        </p>
      </header>

      <main>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {animals.map((animal) => (
            <AnimalSoundCard
              key={animal.name}
              animalName={animal.name}
              imageUrl={animal.imageUrl}
              imageHint={animal.imageHint}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
