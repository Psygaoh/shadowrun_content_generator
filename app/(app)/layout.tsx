import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
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
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-cyber-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-14 h-64 w-64 rounded-full bg-cyan-400/20 blur-[100px]" />
        <div className="absolute -bottom-28 right-10 h-80 w-80 rounded-full bg-purple-500/15 blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b border-cyan-500/20 bg-slate-950/80 px-6 py-5 backdrop-blur md:px-10">
          <Link
            href="/home"
            className="text-xs font-semibold uppercase tracking-[0.5em] text-cyan-200/80 hover:text-cyan-200"
          >
            Shadowrun
          </Link>
          <div className="flex items-center gap-4 text-xs text-slate-300/80">
            <span className="hidden sm:inline text-slate-400">{user.email}</span>
            <LogoutButton />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12 md:px-12">
          {children}
        </main>

        <footer className="flex justify-center border-t border-white/5 px-6 py-6 text-xs text-slate-500 md:px-10">
          <p>Secure area - only those invited to the shadows can proceed.</p>
        </footer>
      </div>
    </div>
  );
}
