'use client';
import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { Loader2, ArrowRight, Star, Gem, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function DashboardPage() {
    const { user, firestore, isUserLoading } = useFirebase();

    const userRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userRef);

    const [nilePoints, setNilePoints] = useState<number | null>(null);

    useEffect(() => {
        if (userData) {
            // Initialize points from Firestore
            const initialPoints = userData.nilePoints;
            setNilePoints(initialPoints);
            // Also set it in localStorage for the store to use
            localStorage.setItem('nilePoints', initialPoints.toString());

            // Listen for changes from other tabs (e.g., the store)
            const handleStorageChange = (event: StorageEvent) => {
                if (event.key === 'nilePoints' && event.newValue) {
                    const updatedPoints = parseInt(event.newValue, 10);
                    setNilePoints(updatedPoints);
                    // Optional: Persist this change back to Firestore if needed
                    // This can be wrapped in a function that debounces writes to avoid too many updates.
                }
            };
            window.addEventListener('storage', handleStorageChange);
            return () => {
                window.removeEventListener('storage', handleStorageChange);
            };
        }
    }, [userData]);


    if (isUserLoading || (user && !userData) || isUserDataLoading) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!user) {
        return (
             <div className="container mx-auto py-10 text-center">
                <h1 className="text-3xl font-bold font-headline text-primary">أهلاً بك في أكاديمية يلا مصري</h1>
                <p className="text-muted-foreground mt-2">من فضلك، قم بتسجيل الدخول لبدء رحلتك في تعلم العامية المصرية.</p>
                 <Button asChild className="mt-6">
                    <Link href="/login">تسجيل الدخول</Link>
                </Button>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-10 space-y-8" dir='rtl'>
            {/* Welcome Header */}
            <div className="p-6 rounded-lg bg-card border border-border">
                <h1 className="text-3xl font-bold font-headline text-primary">أهلاً بعودتك، {userData.name}!</h1>
                <p className="text-lg text-muted-foreground">لقبك الفرعوني هو: <span className="font-semibold text-accent-foreground">{userData.alias}</span></p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">نقاط النيل</CardTitle>
                        <Gem className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{nilePoints ?? '...'}</div>
                        <p className="text-xs text-muted-foreground">واصل التقدم لجمع المزيد!</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">المستوى الحالي</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{userData.level}</div>
                        <p className="text-xs text-muted-foreground">هدفك: {userData.goal}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الشارات المكتسبة</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         <div className="flex space-x-2 rtl:space-x-reverse">
                            {userData.badges?.map((badge: string) => (
                                <Badge key={badge} variant="secondary" className="capitalize">{badge.replace('_', ' ')}</Badge>
                            ))}
                        </div>
                         <p className="text-xs text-muted-foreground mt-2">شارة جديدة على وشك الفتح!</p>
                    </CardContent>
                </Card>
            </div>

            {/* Continue Learning Section */}
            <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">أكمل من حيث توقفت</CardTitle>
                    <CardDescription className="text-primary-foreground/80">أنت على وشك إتقان التحيات والمجاملات. أكمل الدرس لفتح تحدٍ جديد!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span>الدرس 1: التحيات الأساسية</span>
                            <span>75%</span>
                        </div>
                        <Progress value={75} className="h-2 [&>div]:bg-primary-foreground" />
                    </div>
                    <Button variant="secondary" size="lg" className="w-full md:w-auto">
                        إلى الدرس التالي <ArrowRight className="mr-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>

        </div>
    );
}
