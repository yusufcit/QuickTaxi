import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminAuth, getFirebaseAdminDb } from "@/lib/firebase/admin";

const sessionMaxAgeMs = 1000 * 60 * 60 * 24 * 5;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { idToken?: string };
    if (!body.idToken) {
      return NextResponse.json({ error: "Missing ID token." }, { status: 400 });
    }

    const auth = getFirebaseAdminAuth();
    const decoded = await auth.verifyIdToken(body.idToken, true);

    const adminSnapshot = await getFirebaseAdminDb().collection("admin_users").doc(decoded.uid).get();
    const adminUser = adminSnapshot.exists
      ? (adminSnapshot.data() as { active?: boolean })
      : null;

    if (!adminUser?.active) {
      return NextResponse.json({ error: "Unauthorized admin account." }, { status: 403 });
    }

    const sessionCookie = await auth.createSessionCookie(body.idToken, { expiresIn: sessionMaxAgeMs });
    const response = NextResponse.json({ ok: true });
    response.cookies.set("qt_admin_session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionMaxAgeMs / 1000,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Unable to create session." }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("qt_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
