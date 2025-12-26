'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FirebaseLogo } from '@/components/icons';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  Scroll,
  Pyramid,
  Sparkles,
  Swords,
  Store,
  Ship,
  UserCog,
  Palette,
  Mic2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserNav } from './user-nav';
import { User } from 'firebase/auth';
import { getDictionary } from '@/dictionaries';
import { Locale } from '@/i18n-config';
import { useEffect, useState } from 'react';

type NavDict = Awaited<ReturnType<typeof getDictionary>>['header'];
type UserNavDict = Awaited<ReturnType<typeof getDictionary>>['user_nav'];

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const lang = (pathname.split('/')[1] || 'en') as Locale;
  const [dict, setDict] = useState<NavDict | null>(null);
  const [userNavDict, setUserNavDict] = useState<UserNavDict | null>(null);

  useEffect(() => {
    getDictionary(lang).then(d => {
        setDict(d.header);
        setUserNavDict(d.user_nav);
    });
  }, [lang]);

  if (!dict || !userNavDict) {
    return <div className="hidden md:flex w-64 flex-col border-r bg-background p-4" />;
  }

  const navLinks = [
    { href: `/${lang}/dashboard`, label: dict.dashboard, icon: LayoutDashboard },
    { href: `/${lang}/egyptian-school`, label: dict.school, icon: GraduationCap },
    { href: `/${lang}/teachers`, label: dict.teachers, icon: Users },
    { href: `/${lang}/quran`, label: dict.quran, icon: BookOpen },
    { href: `/${lang}/sunnah`, label: dict.sunnah, icon: Scroll },
    { href: `/${lang}/museum`, label: dict.museum, icon: Pyramid },
    { href: `/${lang}/smart-adventure`, label: dict.smart_adventure, icon: Sparkles },
    { href: `/${lang}/challenge`, label: dict.challenge, icon: Swords },
    { href: `/${lang}/store`, label: dict.store, icon: Store },
    { href: `/${lang}/gulf`, label: dict.gulf_council, icon: Ship },
    { href: `/${lang}/animal-sounds`, label: dict.animal_sounds, icon: Mic2 },
    { href: `/${lang}/coloring`, label: dict.coloring_game, icon: Palette },
    { href: `/${lang}/teacher-dashboard`, label: dict.teacher_dashboard, icon: UserCog },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background">
      <div className="p-4 border-b">
        <Link href={`/${lang}`} className="flex items-center space-x-2">
          <FirebaseLogo className="h-8 w-8 text-primary" />
          <span className="font-bold sm:inline-block font-headline text-lg">
            Yalla Masry
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col space-y-1 p-4">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent',
                  isActive ? 'bg-accent text-primary' : 'text-foreground/70'
                )}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t mt-auto">
        <UserNav lang={lang} dict={userNavDict} />
      </div>
    </aside>
  );
}
