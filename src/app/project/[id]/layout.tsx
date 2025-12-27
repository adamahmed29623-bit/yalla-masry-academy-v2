import { ReactNode } from "react";

// تعريف الأنواع الجديد المتوافق مع Next.js 15
interface LayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>; // تحويلها إلى Promise هو المفتاح
}

export default async function ProjectLayout({ children, params }: LayoutProps) {
  // يجب فك الـ Promise قبل الاستخدام
  const { id } = await params; 

  return (
    <section>
      {/* يمكنك استخدام الـ id هنا إذا كنتِ تحتاجين تمييز المشروع */}
      {children}
    </section>
  );
}
