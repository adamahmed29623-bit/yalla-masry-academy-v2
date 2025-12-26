'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Star, Wallet, Clock, BookOpen, Loader2, Video } from "lucide-react";
import { useDoc, useFirebase, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";


export default function TeacherProfilePage({ params }: { params: { id: string } }) {
  const { firestore } = useFirebase();
  const teacherRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'teachers', params.id);
  }, [firestore, params.id]);
  const { data: teacher, isLoading } = useDoc(teacherRef);
  
  const specialtiesMap: { [key: string]: string } = {
    colloquial: 'اللهجة العامية',
    quran: 'القرآن الكريم والتجويد',
    kids: 'تعليم الأطفال'
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">جاري تحميل ملف المعلمة...</p>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold">لم يتم العثور على المعلمة</h1>
        <p className="text-muted-foreground mt-2">قد يكون الرابط غير صحيح أو تمت إزالة الملف الشخصي.</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/40">
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Intro Video */}
            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Video className="text-primary"/>
                        فيديو تعريفي
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="aspect-video rounded-lg overflow-hidden">
                        <iframe
                        className="w-full h-full"
                        src={teacher.introVideoUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        ></iframe>
                    </div>
                </CardContent>
            </Card>

            {/* Bio Section */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">عن {teacher.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground prose prose-sm max-w-none dark:prose-invert">
                <p>{teacher.bio}</p>
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">الخبرة</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>{teacher.experience}</p>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">تقييمات الطلاب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {(teacher.reviews || []).map((review: any) => (
                  <div key={review.id} className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>{review.studentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">{review.studentName}</h4>
                        <div className="flex items-center text-amber-500">
                          <span className="font-bold mr-1">{review.rating}</span>
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-24 text-center">
              <CardContent className="p-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                        src={teacher.profilePictureUrl}
                        alt={`صورة المعلمة ${teacher.name}`}
                        fill
                        className="rounded-full object-cover border-4 border-primary"
                        data-ai-hint="teacher portrait"
                    />
                </div>
                <h1 className="text-2xl font-bold font-headline text-primary">{teacher.name}</h1>
                <p className="text-muted-foreground mt-1">{teacher.headline}</p>

                <div className="flex items-center justify-center mt-3 text-amber-500">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="mx-1 font-bold">{teacher.rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({teacher.totalReviews} تقييم)</span>
                </div>
                
                <Button size="lg" className="w-full mt-6">احجز درساً تجريبياً</Button>
              </CardContent>
              <div className="border-t p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><Wallet/>السعر للساعة</span>
                    <span className="font-semibold">${teacher.hourlyRate}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><Clock/>التوافر</span>
                    <span className="font-semibold">{teacher.availability}</span>
                </div>
                 <div className="flex flex-col items-start gap-2">
                    <span className="flex items-center gap-2 text-muted-foreground"><BookOpen/>التخصصات</span>
                    <div className="flex flex-wrap gap-2">
                        {teacher.specialties.map((specialty: string) => (
                            <Badge key={specialty} variant="outline">{specialtiesMap[specialty] || specialty}</Badge>
                        ))}
                    </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
