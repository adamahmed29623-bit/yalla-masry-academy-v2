import React from 'react';

/**
 * جلالة الملكة، تم إصلاح خطأ validateDOMNesting.
 * المشكلة كانت في وجود عناصر (مثل الـ div الخاص بـ main) خارج وسم الـ body أو بشكل غير متوافق.
 * تم ترتيب الهيكل ليكون: html > head + body > main.
 */

export const metadata = {
  title: 'Yalla Masry Academy | الأكاديمية الملكية',
  description: 'بوابتك لتعلم اللهجة المصرية الأصيلة واستكشاف كنوز الحضارة الفرعونية بهوية ملكية فريدة.',
};

export default function RootLayout({
  children
}) {
  return (
    <html lang='ar' dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* الخطوط الملكية الفاخرة */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=El+Messiri:wght@400;700;900&family=Inter:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@400;500;600;700&family=Amiri+Quran:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
        {/* مكتبة الأيقونات */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          referrerPolicy="no-referrer" 
        />
        <style>{`
          body {
            margin: 0;
            padding: 0;
            background-color: #050505;
            color: white;
            font-family: 'El Messiri', 'Cairo', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          .min-h-screen { min-height: 100vh; }
          .flex { display: flex; }
          .flex-col { flex-direction: column; }
          .flex-grow { flex-grow: 1; }
          .bg-background { background-color: #050505; }
        `}</style>
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background">
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
