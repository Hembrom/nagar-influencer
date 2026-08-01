import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { upsertProfileFromAuthServer } from "@/lib/profile-server";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;

  if (getSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data.user;
      if (user) {
        try {
          await upsertProfileFromAuthServer(supabase, user);
        } catch {
          // profile table may not exist yet
        }
      }
    } catch {
      user = null;
    }
  }

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar user={user} />
      <main className="flex min-h-dvh min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
