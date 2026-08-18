import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getPrivateKey(): string {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  if (!key) {
    throw new Error("FIREBASE_PRIVATE_KEY is missing");
  }
  return key.replace(/\\n/g, "\n");
}

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !clientEmail) {
    throw new Error("Firebase admin credentials are incomplete");
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: getPrivateKey(),
    }),
  });
}

export function getFirebaseAdminAuth() {
  return getAuth(getAdminApp());
}

export function getFirebaseAdminDb() {
  return getFirestore(getAdminApp());
}
