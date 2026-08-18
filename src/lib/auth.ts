import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getFirebaseAdminAuth, getFirebaseAdminDb } from "@/lib/firebase/admin";

export type AdminRole = "super_admin" | "admin" | "dispatcher";

export async function requireAdminUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("qt_admin_session")?.value;

  if (!session) {
    redirect("/admin/login");
  }

  let decoded: { uid: string; email?: string };
  try {
    decoded = (await getFirebaseAdminAuth().verifySessionCookie(session, true)) as {
      uid: string;
      email?: string;
    };
  } catch {
    redirect("/admin/login");
  }

  const db = getFirebaseAdminDb();
  const adminSnapshot = await db.collection("admin_users").doc(decoded.uid).get();
  const adminUser = adminSnapshot.exists
    ? (adminSnapshot.data() as { role?: AdminRole; active?: boolean })
    : null;

  if (!adminUser?.active || !adminUser.role) {
    redirect("/admin/login?error=unauthorized");
  }

  return {
    user: {
      uid: decoded.uid,
      email: decoded.email ?? null,
    },
    role: adminUser.role,
    db,
  };
}
