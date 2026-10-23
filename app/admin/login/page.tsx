"use client";

import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { btnCls, inputCls } from "@/components/admin/ui";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
      return;
    }
    const json = await res.json().catch(() => ({}));
    setError(json.error || "Ошибка входа");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6">
        <Lock className="h-5 w-5 text-tgu-brand" aria-hidden />
        <h1 className="mt-3 font-heading text-xl font-semibold text-slate-900">Вход в админку</h1>
        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${inputCls} mt-5`}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading || !password} className={`${btnCls.primary} mt-4 w-full`}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Войти
        </button>
      </form>
    </div>
  );
}
