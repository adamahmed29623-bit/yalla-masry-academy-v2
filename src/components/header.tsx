import Link from 'next/link'
import { FirebaseLogo } from '@/components/icons'
import { UserNav } from '@/components/user-nav'
import { Button } from '@/components/ui/button'
import { getDictionary } from '@/dictionaries'
import { type Locale } from '@/i18n-config'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

export async function Header({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);

  const navLinks = [
    { href: `/${lang}/dashboard`, label: dict.header.dashboard },
    { href: `/${lang}/egyptian-school`, label: dict.header.school },
    { href: `/${lang}/teachers`, label: dict.header.teachers },
    { href: `/${lang}/quran`, label: dict.header.quran },
    { href: `/${lang}/sunnah`, label: dict.header.sunnah },
    { href: `/${lang}/museum`, label: dict.header.museum },
    { href: `/${lang}/challenge`, label: dict.header.challenge },
    { href: `/${lang}/smart-adventure`, label: dict.header.smart_adventure },
    { href: `/${lang}/store`, label: dict.header.store },
    { href: `/${lang}/gulf`, label: dict.header.gulf_council },
    { href: `/${lang}/teacher-dashboard`, label: dict.header.teacher_dashboard },
    { href: `/${lang}/animal-sounds`, label: dict.header.animal_sounds },
    { href: `/${lang}/coloring`, label: dict.header.coloring_game },
    { href: `/${lang}/admin/dashboard`, label: 'Admin' },
  ];

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
            {navLinks.slice(0, 5).map(link => (
               <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="md:hidden">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href={`/${lang}`} className="mr-6 flex items-center space-x-2 mb-6">
                <FirebaseLogo className="h-6 w-6 text-primary" />
                <span className="font-bold sm:inline-block font-headline">
                  Yalla Masry Academy
                </span>
              </Link>
              <nav className="flex flex-col space-y-4">
                 {navLinks.map(link => (
                   <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-foreground/80 text-foreground/80"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>


        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav lang={lang} dict={dict.user_nav} />
        </div>
      </div>
    </header>
  )
}
