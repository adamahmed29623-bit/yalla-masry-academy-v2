'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import hadithData from '@/lib/hadith-data.json';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, BookCopy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const { hadiths } = hadithData;

export default function HadithDetailPage({ params }: { params: { id: string } }) {
    const hadithId = parseInt(params.id, 10);
    const hadith = hadiths.find(h => h.id === hadithId);

    if (!hadith) {
        notFound();
    }

    return (
        <div className="container mx-auto p-4 md:p-8" dir="rtl">
            <div className="mb-8">
                <Link href="/sunnah" passHref>
                    <Button variant="outline">
                        <ArrowRight className="ml-2" />
                        العودة إلى قائمة الأحاديث
                    </Button>
                </Link>
            </div>
            
            <Card className="shadow-lg mb-8 bg-muted/20">
                <CardHeader className="text-center">
                    <p className="text-sm text-muted-foreground">الحديث رقم {hadith.id}</p>
                    <CardTitle className="text-3xl font-headline font-bold text-primary">{hadith.title}</CardTitle>
                    <CardDescription className="text-md">عن {hadith.narrator}</CardDescription>
                </CardHeader>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <BookCopy className="text-primary"/>
                        نص الحديث
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 md:p-8 text-right space-y-6">
                    <p className="text-xl md:text-2xl leading-relaxed font-serif text-foreground whitespace-pre-wrap">
                        {hadith.hadith}
                    </p>
                    <Separator />
                    <div>
                        <h3 className="font-bold text-lg text-primary mb-2">شرح الحديث:</h3>
                        <p className="text-md leading-relaxed text-muted-foreground whitespace-pre-wrap">
                            {hadith.explanation}
                        </p>
                    </div>
                 </CardContent>
            </Card>
        </div>
    );
}