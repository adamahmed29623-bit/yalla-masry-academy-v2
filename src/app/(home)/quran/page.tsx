'use client';

import React, { useState, useMemo } from 'react';
import quranData from '@/lib/quran-data.json';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen, Search } from 'lucide-react';
import Link from 'next/link';

const { surahs } = quranData;

const SurahCard = ({ surah }: { surah: typeof surahs[0] }) => (
    <Link href={`/quran/${surah.id}`} passHref>
        <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{surah.id}. {surah.name}</CardTitle>
                <BookOpen className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{surah.englishName}</p>
                <div className="text-xs text-muted-foreground mt-2">
                    {surah.revelationType} - {surah.numberOfAyahs} Ayahs
                </div>
            </CardContent>
        </Card>
    </Link>
);

export default function QuranPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSurahs = useMemo(() => {
        if (!searchTerm) {
            return surahs;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return surahs.filter(surah =>
            surah.name.toLowerCase().includes(lowercasedTerm) ||
            surah.englishName.toLowerCase().includes(lowercasedTerm) ||
            surah.id.toString() === searchTerm
        );
    }, [searchTerm]);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-headline text-primary tracking-tight">The Holy Quran</h1>
                <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
                    Browse, read, and listen to the chapters of the Holy Quran.
                </p>
            </div>

            <div className="relative mb-8 max-w-lg mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search by Surah name or number..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredSurahs.map(surah => (
                    <SurahCard key={surah.id} surah={surah} />
                ))}
            </div>

            {filteredSurahs.length === 0 && (
                <div className="text-center col-span-full py-16">
                    <p className="text-muted-foreground">No Surahs found for your search.</p>
                </div>
            )}
        </div>
    );
}
