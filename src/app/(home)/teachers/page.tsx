'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Star, Loader2 } from "lucide-react";
import { placeholderTeachers } from "@/lib/placeholder-data"; // Using placeholder data for now
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

function TeacherCard({ teacher }: { teacher: any }) {
  const specialtiesMap: { [key: string]: string } = {
    colloquial: 'لهجة عامية',
    quran: 'قرآن كريم',
    kids: 'أطفال'
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={teacher.profilePictureUrl}
            alt={`صورة المعلمة ${teacher.name}`}
            fill
            className="object-cover"
            data-ai-hint="teacher portrait"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-4">
        <CardTitle className="text-xl font-headline mb-2">{teacher.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground flex-grow">{teacher.headline}</CardDescription>
        <div className="flex flex-wrap gap-2 mt-4">
          {teacher.specialties.map((specialty: string) => (
            <Badge key={specialty} variant="secondary">{specialtiesMap[specialty] || specialty}</Badge>
          ))}
        </div>
        <div className="flex items-center mt-4 text-amber-500">
          <Star className="w-5 h-5 fill-current" />
          <span className="mr-1 font-bold">{teacher.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({teacher.totalReviews} تقييم)</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 dark:bg-gray-800">
        <Button asChild className="w-full">
          <Link href={`/teachers/${teacher.id}`}>عرض الملف الشخصي</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function TeachersPage() {
  const { firestore } = useFirebase();

  // In a real app, this is where you'd fetch the teacher data from Firestore.
  // For now, we'll use the placeholder data.
  // const teachersCollection = useMemoFirebase(() => {
  //   if (!firestore) return null;
  //   return collection(firestore, 'teachers');
  // }, [firestore]);
  // const { data: teachers, isLoading } = useCollection(teachersCollection);
  
  const teachers = placeholderTeachers;
  const isLoading = false;


  if (isLoading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">جاري تحميل قائمة المعلمات...</p>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline text-primary">اكتشف معلماتنا المتميزات</h1>
          <p className="text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
            ابحث عن المعلمة المثالية التي تناسب أهدافك التعليمية وأسلوبك في التعلم.
          </p>
        </div>

        {teachers && teachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teachers.map(teacher => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold">لا يوجد معلمات متاحات حالياً</h2>
            <p className="text-muted-foreground mt-2">يرجى التحقق مرة أخرى قريباً.</p>
          </div>
        )}
      </div>
    </div>
  );
}
