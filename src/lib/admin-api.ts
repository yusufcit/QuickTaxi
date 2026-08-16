import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdminApiUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, authorized: false } as const;
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  return { supabase, user, authorized: Boolean(adminUser) } as const;
}
