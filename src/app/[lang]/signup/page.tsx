'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
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
  const params = useParams();
  const lang = params.lang as string;
  const { toast } = useToast();
  const { auth, firestore } = useFirebase();

  useEffect(() => {
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
      
      await updateProfile(user, { displayName: name });

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
        badges: ['first_login'], 
      });
      
      toast({
        title: "Account Created!",
        description: `Welcome, ${name}! Your Pharaonic alias is ${randomAlias}.`,
      });

      router.push(`/${lang}/dashboard`);

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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl border-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Create Your Account</CardTitle>
          <CardDescription className="text-muted-foreground">Embark on your Egyptian adventure!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="e.g., John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                <Label>I am a...</Label>
                <RadioGroup defaultValue="student" value={role} onValueChange={(value) => setRole(value as any)} className="flex gap-4 pt-2">
                  <Label htmlFor="role-student" className="flex flex-col items-center gap-2 cursor-pointer rounded-lg border-2 p-3 transition-colors hover:bg-accent has-[input:checked]:border-primary has-[input:checked]:bg-accent/50">
                    <User className="h-6 w-6" />
                    <span>Student</span>
                    <RadioGroupItem value="student" id="role-student" className="sr-only" />
                  </Label>
                  <Label htmlFor="role-teacher" className="flex flex-col items-center gap-2 cursor-pointer rounded-lg border-2 p-3 transition-colors hover:bg-accent has-[input:checked]:border-primary has-[input:checked]:bg-accent/50">
                     <BookUser className="h-6 w-6" />
                     <span>Teacher</span>
                     <RadioGroupItem value="teacher" id="role-teacher" className="sr-only" />
                  </Label>
                  <Label htmlFor="role-parent" className="flex flex-col items-center gap-2 cursor-pointer rounded-lg border-2 p-3 transition-colors hover:bg-accent has-[input:checked]:border-primary has-[input:checked]:bg-accent/50">
                     <HeartHandshake className="h-6 w-6" />
                     <span>Parent</span>
                     <RadioGroupItem value="parent" id="role-parent" className="sr-only" />
                  </Label>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goal">Primary Goal</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger id="goal">
                    <SelectValue placeholder="What do you want to learn?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">Social & Daily Conversation</SelectItem>
                    <SelectItem value="business">Business & Professional</SelectItem>
                    <SelectItem value="media">Understanding Media (Movies, Songs)</SelectItem>
                    <SelectItem value="travel">Traveling to Egypt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Skill Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="How would you rate your skills?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Absolute Beginner (Just starting)</SelectItem>
                    <SelectItem value="novice">Novice (Know a few words)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (Can form sentences)</SelectItem>
                    <SelectItem value="advanced">Advanced (Comfortable conversing)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Account...</> : 'Sign Up'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Already have an account?{' '}
              <Link href={`/${lang}/login`} className="font-semibold text-primary hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
