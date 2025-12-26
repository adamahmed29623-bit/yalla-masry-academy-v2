'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, BookUser, HeartHandshake, Loader2 } from 'lucide-react';

const PHARAONIC_ALIASES = ["Akhenaten", "Nefertiti", "Hatshepsut", "Ramesses", "Cleopatra", "Tutankhamun", "Imhotep", "Sobekneferu", "Thutmose", "Ankhesenamun"];

const getRandomAlias = () => PHARAONIC_ALIASES[Math.floor(Math.random() * PHARAONIC_ALIASES.length)];

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'parent'>('student');
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [randomAlias, setRandomAlias] = useState('');

  const router = useRouter();
  const { toast } = useToast();
  const { auth, firestore } = useFirebase();

  useEffect(() => {
    // Set random alias on the client side to avoid hydration mismatch
    setRandomAlias(getRandomAlias());
  }, []);


  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!goal || !level) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please select your learning goal and skill level.",
        });
        return;
    }
    if (!firestore || !auth) {
        toast({
            variant: "destructive",
            title: "Initialization Error",
            description: "Could not connect to services. Please try again later.",
        });
        return;
    }
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update Firebase Auth profile
      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        id: user.uid,
        email: user.email,
        name: name,
        alias: randomAlias,
        role: role,
        registrationDate: new Date().toISOString(),
        nilePoints: 100, // Welcome gift!
        goal: goal,
        level: level,
        badges: ['first_login'], // First badge upon signup
      });
      
      toast({
        title: "Account Created!",
        description: `Welcome, ${name}! Your Pharaonic alias is ${randomAlias}.`,
      });

      router.push('/dashboard');

    } catch (error: any) {
      console.error("Signup Error: ", error);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "An unknown error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-nile-dark p-4">
      <Card className="w-full max-w-2xl bg-nile-blue border-gold-accent/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gold-accent font-headline">أنشئ حسابك الملكي</CardTitle>
          <CardDescription className="text-sand-ochre">انضم للأكاديمية وابدأ مغامرتك المصرية!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
            
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input id="name" placeholder="مثال: خالد المصري" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
               <div className="space-y-2">
                <Label>أنا...</Label>
                <RadioGroup defaultValue="student" value={role} onValueChange={(value) => setRole(value as any)} className="flex gap-4 pt-2">
                  <Label htmlFor="role-student" className="flex flex-col items-center gap-2 cursor-pointer rounded-lg border-2 p-3 transition-colors hover:bg-gold-accent/20 has-[input:checked]:border-gold-accent has-[input:checked]:bg-gold-accent/10">
                    <User className="h-6 w-6" />
                    <span>طالب</span>
                    <RadioGroupItem value="student" id="role-student" className="sr-only" />
                  </Label>
                  <Label htmlFor="role-teacher" className="flex flex-col items-center gap-2 cursor-pointer rounded-lg border-2 p-3 transition-colors hover:bg-gold-accent/20 has-[input:checked]:border-gold-accent has-[input:checked]:bg-gold-accent/10">
                     <BookUser className="h-6 w-6" />
                     <span>معلم</span>
                     <RadioGroupItem value="teacher" id="role-teacher" className="sr-only" />
                  </Label>
                  <Label htmlFor="role-parent" className="flex flex-col items-center gap-2 cursor-pointer rounded-lg border-2 p-3 transition-colors hover:bg-gold-accent/20 has-[input:checked]:border-gold-accent has-[input:checked]:bg-gold-accent/10">
                     <HeartHandshake className="h-6 w-6" />
                     <span>ولي أمر</span>
                     <RadioGroupItem value="parent" id="role-parent" className="sr-only" />
                  </Label>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goal">هدفي الأساسي</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger id="goal">
                    <SelectValue placeholder="ماذا تريد أن تتعلم؟" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">محادثات يومية واجتماعية</SelectItem>
                    <SelectItem value="business">لهجة الأعمال</SelectItem>
                    <SelectItem value="media">فهم الإعلام (أفلام وأغاني)</SelectItem>
                    <SelectItem value="travel">السفر إلى مصر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">مستواي الحالي</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="كيف تقيم مستواك؟" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">مبتدئ تماماً (أول خطوة)</SelectItem>
                    <SelectItem value="novice">هاوٍ (أعرف بضع كلمات)</SelectItem>
                    <SelectItem value="intermediate">متوسط (أكون جُملاً بسيطة)</SelectItem>
                    <SelectItem value="advanced">متقدم (أتحدث بثقة)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="md:col-span-2">
              <Button type="submit" className="w-full bg-gold-accent text-nile-dark font-bold hover:bg-sand-ochre" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />جاري إنشاء الحساب...</> : 'أنشئ حسابي'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="font-semibold text-gold-accent hover:underline">
                سجل الدخول
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
