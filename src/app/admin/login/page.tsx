"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseClientAuth } from "@/lib/firebase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const auth = getFirebaseClientAuth();
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setError(payload.error ?? "Admin account is not authorized.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : "Login failed.";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4">
      <h1 className="text-3xl font-black text-[#0f1d3a]">Quick Taxi Admin Login</h1>
      {params.get("error") === "unauthorized" && (
        <p className="mt-3 text-sm font-semibold text-red-700">Your account is not authorized for admin access.</p>
      )}
      <form onSubmit={onSubmit} className="mt-6 space-y-4 border border-[#c9d4f4] bg-white p-6">
        <label className="block text-sm font-semibold">
          Email
          <input type="email" className="input mt-2" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input type="password" className="input mt-2" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-[#0f1d3a] px-4 py-3 text-sm font-black text-white disabled:opacity-60">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
