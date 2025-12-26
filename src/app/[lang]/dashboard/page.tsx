// Keep the original dashboard page but move it to the new route
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
            const initialPoints = userData.nilePoints;
            setNilePoints(initialPoints);
            localStorage.setItem('nilePoints', initialPoints.toString());

            const handleStorageChange = (event: StorageEvent) => {
                if (event.key === 'nilePoints' && event.newValue) {
                    const updatedPoints = parseInt(event.newValue, 10);
                    setNilePoints(updatedPoints);
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
                <h1 className="text-3xl font-bold font-headline text-primary">Welcome to Yalla Masry Academy</h1>
                <p className="text-muted-foreground mt-2">Please sign in to begin your journey in learning Egyptian Arabic.</p>
                 <Button asChild className="mt-6">
                    <Link href="/login">Sign In</Link>
                </Button>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="p-6 rounded-lg bg-card border border-border">
                <h1 className="text-3xl font-bold font-headline text-primary">Welcome back, {userData.name}!</h1>
                <p className="text-lg text-muted-foreground">Your Pharaonic alias is: <span className="font-semibold text-accent-foreground">{userData.alias}</span></p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nile Points</CardTitle>
                        <Gem className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{nilePoints ?? '...'}</div>
                        <p className="text-xs text-muted-foreground">Keep it up to earn more!</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Level</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{userData.level}</div>
                        <p className="text-xs text-muted-foreground">Your Goal: {userData.goal}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Earned Badges</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         <div className="flex space-x-2">
                            {userData.badges?.map((badge: string) => (
                                <Badge key={badge} variant="secondary" className="capitalize">{badge.replace('_', ' ')}</Badge>
                            ))}
                        </div>
                         <p className="text-xs text-muted-foreground mt-2">A new badge is about to be unlocked!</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Pick up where you left off</CardTitle>
                    <CardDescription className="text-primary-foreground/80">You are about to master greetings. Complete the lesson to unlock a new challenge!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span>Lesson 1: Basic Greetings</span>
                            <span>75%</span>
                        </div>
                        <Progress value={75} className="h-2 [&>div]:bg-primary-foreground" />
                    </div>
                    <Button variant="secondary" size="lg" className="w-full md:w-auto">
                        Go to Next Lesson <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
