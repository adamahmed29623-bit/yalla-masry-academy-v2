'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import quranData from '@/lib/quran-data.json';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Define types for our data for better type safety
type Surah = (typeof quranData.surahs)[number];

export default function SurahDetailPage({ params }: { params: { id: string } }) {
    const surahId = parseInt(params.id, 10);

    const surah = quranData.surahs.find(s => s.id === surahId);

    if (!surah) {
        notFound();
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-8">
                <Link href="/quran" passHref>
                    <Button variant="outline">
                        <ArrowLeft className="mr-2" />
                        Back to All Surahs
                    </Button>
                </Link>
            </div>
            
            <Card className="shadow-lg mb-8">
                <CardHeader className="text-center bg-muted/30">
                    <p className="text-sm text-muted-foreground">{surah.revelationType} - {surah.numberOfAyahs} Ayahs</p>
                    <CardTitle className="text-4xl font-headline font-bold text-primary">{surah.name}</CardTitle>
                    <CardDescription className="text-lg">{surah.englishName}</CardDescription>
                </CardHeader>
            </Card>

            <Card>
                 <CardContent className="p-6 md:p-8" dir="rtl">
                    <div className="space-y-6 text-right">
                         {surah.id !== 1 && surah.id !== 9 && (
                            <p className="text-center text-2xl font-headline mb-6">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                        )}
                        {surah.ayahs.map((ayah) => (
                            <React.Fragment key={ayah.number}>
                                <p className="text-2xl md:text-3xl leading-relaxed font-serif text-foreground">
                                    {ayah.text} <span className="text-xl text-primary font-sans">({ayah.numberInSurah})</span>
                                </p>
                                {ayah.numberInSurah < surah.numberOfAyahs && <Separator />}
                            </React.Fragment>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
