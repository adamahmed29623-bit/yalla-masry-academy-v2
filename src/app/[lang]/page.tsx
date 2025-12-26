import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/dictionaries';
import { Locale } from '@/i18n-config';

export default async function LandingPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Image
        src="https://picsum.photos/seed/pyramids/1920/1080"
        alt="A beautiful cinematic shot of the pyramids at sunset"
        fill
        className="object-cover"
        data-ai-hint="pyramids sunset"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
        <div className="bg-black/50 backdrop-blur-md p-8 rounded-lg border border-white/20">
          <h1 className="text-5xl md:text-7xl font-black text-amber-400 font-display leading-tight drop-shadow-lg" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {dict.landing.main_title}
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl text-gray-200" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {dict.landing.subtitle}
          </p>
          <Link href={`/${lang}/dashboard`}>
            <Button size="lg" className="mt-8 bg-amber-500 text-black font-bold hover:bg-amber-400 text-lg px-8 py-6">
              {dict.landing.dashboard_button}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
