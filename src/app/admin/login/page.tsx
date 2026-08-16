"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

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

    const supabase = createSupabaseBrowserClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
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
