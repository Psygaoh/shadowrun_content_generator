import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import { PageHeader } from "@/components/chrome/page-header";
import { PageFooter } from "@/components/chrome/page-footer";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { NeonBackdrop } from "@/components/chrome/neon-backdrop";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return (
    <NeonBackdrop variant="app" contentClassName="min-h-screen">
      <PageHeader
        variant="app"
        brandHref="/home"
        rightSlot={
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <ThemeSwitcher compact />
            <span className="hidden text-muted-foreground/80 sm:inline">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        }
      />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12 md:px-12">
        {children}
      </main>

      <PageFooter variant="app" />
    </NeonBackdrop>
  );
}
