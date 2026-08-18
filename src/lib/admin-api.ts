import { cookies } from "next/headers";
import { getFirebaseAdminAuth, getFirebaseAdminDb } from "@/lib/firebase/admin";

export async function requireAdminApiUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("qt_admin_session")?.value;
  const db = getFirebaseAdminDb();

  if (!session) {
    return { db, user: null, authorized: false } as const;
  }

  try {
    const decoded = await getFirebaseAdminAuth().verifySessionCookie(session, true);
    const adminSnapshot = await db.collection("admin_users").doc(decoded.uid).get();
    const adminUser = adminSnapshot.exists
      ? (adminSnapshot.data() as { role?: string; active?: boolean })
      : null;

    return {
      db,
      user: { uid: decoded.uid, email: decoded.email ?? null },
      role: adminUser?.role ?? null,
      authorized: Boolean(adminUser?.active),
    } as const;
  } catch {
    return { db, user: null, role: null, authorized: false } as const;
  }
}
