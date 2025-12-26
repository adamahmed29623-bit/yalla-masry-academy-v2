'use client';

import React, { useState, useMemo } from 'react';
import hadithData from '@/lib/hadith-data.json';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookHeart, Search } from 'lucide-react';
import Link from 'next/link';

const { hadiths } = hadithData;

const HadithCard = ({ hadith }: { hadith: typeof hadiths[0] }) => (
    <Link href={`/sunnah/${hadith.id}`} passHref>
        <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer h-full flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold font-headline leading-tight">{hadith.id}. {hadith.title}</CardTitle>
                    <BookHeart className="h-5 w-5 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{hadith.narrator}</p>
            </CardContent>
        </Card>
    </Link>
);

export default function SunnahPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHadiths = useMemo(() => {
        if (!searchTerm) {
            return hadiths;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return hadiths.filter(hadith =>
            hadith.title.toLowerCase().includes(lowercasedTerm) ||
            hadith.id.toString() === searchTerm
        );
    }, [searchTerm]);

    return (
        <div className="container mx-auto p-4 md:p-8" dir="rtl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-headline text-primary tracking-tight">ركن السنة النبوية</h1>
                <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
                    تصفح وتعلم من هدي النبي محمد صلى الله عليه وسلم.
                </p>
            </div>

            <div className="relative mb-8 max-w-lg mx-auto">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="ابحث عن حديث بالاسم أو الرقم..."
                    className="pr-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredHadiths.map(hadith => (
                    <HadithCard key={hadith.id} hadith={hadith} />
                ))}
            </div>

            {filteredHadiths.length === 0 && (
                <div className="text-center col-span-full py-16">
                    <p className="text-muted-foreground">لم يتم العثور على حديث يطابق بحثك.</p>
                </div>
            )}
        </div>
    );
}