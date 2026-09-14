#!/usr/bin/env node
/**
 * Create (or link) an admin user for Quick Taxi.
 *
 * Usage:
 *   npm run create-admin -- <email> <password> [role]
 *
 * Examples:
 *   npm run create-admin -- admin@quicktaxi.ie 'StrongPass123!'
 *   npm run create-admin -- yusuf.mdsyl@gmail.com 'StrongPass123!' super_admin
 *
 * Role options: "super_admin" | "admin" | "dispatcher"  (default: super_admin)
 *
 * What it does:
 *   1. Creates the user in Firebase Authentication (email/password) if missing.
 *   2. ALWAYS resets the password to the one provided, so the credentials
 *      always work — even if the account already existed before.
 *   3. Writes/merges the document in Firestore `admin_users`
 *      using the user's UID as the document ID, with active: true.
 */
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const [email, password, role = "super_admin"] = process.argv.slice(2);

if (!email || !password) {
  console.error(
    "Missing arguments.\n\nUsage: npm run create-admin -- <email> <password> [role]",
  );
  process.exit(1);
}

const validRoles = new Set(["super_admin", "admin", "dispatcher"]);
if (!validRoles.has(role)) {
  console.error(
    `Invalid role "${role}". Allowed: ${[...validRoles].join(", ")}`,
  );
  process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error(
    "Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY.\n" +
      "Make sure .env.local exists and is loaded (the npm script uses --env-file=.env.local).",
  );
  process.exit(1);
}

initializeApp({
  credential: cert({ projectId, clientEmail, privateKey }),
});

const auth = getAuth();
const db = getFirestore();

try {
  // Reuse existing user if present, otherwise create one.
  let user;
  let created = false;
  try {
    user = await auth.getUserByEmail(email);
    console.log(`User already exists for ${email}, reusing its UID.`);
  } catch {
    user = await auth.createUser({ email, password, emailVerified: true });
    created = true;
    console.log(`Created auth user for ${email}.`);
  }

  // ALWAYS set/update the password so the one passed on the CLI is
  // guaranteed to work — even if the account already existed before.
  await auth.updateUser(user.uid, { password, emailVerified: true, disabled: false });
  if (!created) {
    console.log(`Updated password for ${email}.`);
  }

  const fresh = await auth.getUser(user.uid);
  const providers = (fresh.providerData ?? []).map((p) => p.providerId);
  console.log("Sign-in providers:", providers.join(", ") || "(none)");
  console.log("Account disabled :", fresh.disabled ? "true" : "false");
  console.log("Email verified   :", fresh.emailVerified ? "true" : "false");

  await db
    .collection("admin_users")
    .doc(user.uid)
    .set(
      {
        email,
        role,
        active: true,
        updated_at: new Date().toISOString(),
      },
      { merge: true },
    );

  console.log("\n✅ Admin account is ready — sign in at /admin/login\n");
  console.log("---------------------------------------------------");
  console.log("  email   :", email);
  console.log("  password:", "••••••••  (the one you provided)");
  console.log("  role    :", role);
  console.log("  active  : true");
  console.log("  UID     :", user.uid);
  console.log("---------------------------------------------------");
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error("\n❌ Failed to create admin account:", message);
  process.exit(1);
}