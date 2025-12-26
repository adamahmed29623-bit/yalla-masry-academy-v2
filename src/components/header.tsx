import Link from 'next/link'
import { FirebaseLogo } from '@/components/icons'
import { UserNav } from '@/components/user-nav'
import { Button } from '@/components/ui/button'
import { getDictionary } from '@/dictionaries'
import { type Locale } from '@/i18n-config'

export async function Header({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href={`/${lang}`} className="mr-6 flex items-center space-x-2">
            <FirebaseLogo className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">
              Yalla Masry Academy
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
             <Link
              href={`/${lang}/dashboard`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {dict.header.dashboard}
            </Link>
            <Link
              href={`/${lang}/egyptian-school`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {dict.header.school}
            </Link>
            <Link
              href={`/${lang}/teachers`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {dict.header.teachers}
            </Link>
            <Link
              href={`/${lang}/quran`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {dict.header.quran}
            </Link>
             <Link
              href={`/${lang}/sunnah`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {dict.header.sunnah}
            </Link>
            <Link
              href={`/${lang}/museum`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {dict.header.museum}
            </Link>
             <Link
              href={`/${lang}/challenge`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {dict.header.challenge}
            </Link>
             <Link
              href={`/${lang}/smart-adventure`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {dict.header.smart_adventure}
            </Link>
            <Link
              href={`/${lang}/store`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {dict.header.store}
            </Link>
            <Link
              href={`/${lang}/gulf`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {dict.header.gulf_council}
            </Link>
             <Link
              href={`/${lang}/teacher-dashboard`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {dict.header.teacher_dashboard}
            </Link>
            <Link
              href={`/${lang}/animal-sounds`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {dict.header.animal_sounds}
            </Link>
            <Link
              href={`/${lang}/coloring`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {dict.header.coloring_game}
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav lang={lang} dict={dict.user_nav} />
        </div>
      </div>
    </header>
  )
}
