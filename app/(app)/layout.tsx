import { redirect } from "next/navigation";

import { PageHeader } from "@/components/chrome/page-header";
import { PageFooter } from "@/components/chrome/page-footer";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { NeonBackdrop } from "@/components/chrome/neon-backdrop";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { AppNavigation } from "@/components/chrome/app-navigation";
import { CampaignSidebar } from "@/components/chrome/campaign-sidebar";
import { listCampaigns, type Campaign } from "@/lib/campaigns";
import { CampaignNotesDrawer } from "@/components/campaigns/campaign-notes-drawer";
import { CampaignsProvider } from "@/components/campaigns/campaign-context";

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

  let campaigns: Campaign[] = [];

  try {
    campaigns = await listCampaigns(supabase);
  } catch (campaignLoadError) {
    console.error(campaignLoadError);
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

      <AppNavigation />

      <CampaignsProvider campaigns={campaigns}>
        <main className="flex w-full flex-1 flex-col gap-6 px-6 py-10 md:px-10 lg:flex-row lg:gap-10">
          <CampaignSidebar />
          <div className="flex-1 min-w-0">
            {children}
          </div>
          <CampaignNotesDrawer />
        </main>
      </CampaignsProvider>

      <PageFooter variant="app" />
    </NeonBackdrop>
  );
}
