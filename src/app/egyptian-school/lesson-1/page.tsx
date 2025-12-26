import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LessonOnePage() {
  return (
    <div className="container mx-auto py-10" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">الدرس الأول: التحيات الأساسية</CardTitle>
          <CardDescription>مرحباً بك في أولى خطواتك لتعلم العامية المصرية!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed">
            هذا هو محتوى الدرس الأول. هنا ستجد الفيديوهات، الشروحات، والأمثلة.
            (محتوى الدرس الفعلي سيتم إضافته لاحقاً).
          </p>
          <Button asChild>
            <Link href="/egyptian-school">
              <ArrowLeft className="ml-2" />
              العودة إلى قائمة الدروس
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
