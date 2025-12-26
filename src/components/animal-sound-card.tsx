'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { getAnimalSound } from '@/app/actions';
import { Loader2, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


interface AnimalSoundCardProps {
  animalName: string;
  imageUrl: string;
  imageHint: string;
}

export default function AnimalSoundCard({
  animalName,
  imageUrl,
  imageHint,
}: AnimalSoundCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleCardClick = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await getAnimalSound({ animalName });
      if (response && response.audioDataUri) {
        if (audioRef.current) {
          audioRef.current.src = response.audioDataUri;
          audioRef.current.play();
        }
      } else {
        throw new Error('لم يتم استقبال بيانات صوتية.');
      }
    } catch (err: any) {
      console.error('Error generating animal sound:', err);
      toast({
        variant: 'destructive',
        title: 'حدث خطأ',
        description: err.message || 'حدث خطأ أثناء تشغيل الصوت.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        className="group w-full cursor-pointer overflow-hidden rounded-xl border-4 border-sand-ochre bg-nile-blue shadow-lg transition-all duration-300 hover:border-gold-accent hover:shadow-gold-accent/50 hover:scale-105"
        onClick={handleCardClick}
      >
        <CardContent className="relative p-0">
          <div className="aspect-square relative w-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={animalName}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              data-ai-hint={imageHint}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute bottom-2 right-2 flex items-center justify-center rounded-full bg-black/50 p-2">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                <Volume2 className="h-5 w-5 text-white" />
              )}
            </div>
          </div>
          <div className="p-3 bg-nile-blue">
            <h3 className="text-center text-lg font-bold text-sand-ochre">
              {animalName}
            </h3>
          </div>
        </CardContent>
      </Card>
      <audio ref={audioRef} className="hidden" />
    </>
  );
}
