import { MainNav } from "@/components/admin/main-nav";
import TeamSwitcher from "@/components/admin/team-switcher";
import { UserNav } from "@/components/user-nav";
import { getDictionary } from "@/dictionaries";
import { Locale } from "@/i18n-config";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);

  return (
    <div className="hidden flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <TeamSwitcher />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav lang={params.lang} dict={dict.user_nav} />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
