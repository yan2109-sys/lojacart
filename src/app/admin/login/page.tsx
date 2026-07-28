"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gamepad2, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.success) {
      router.push("/admin");
    } else {
      setError(data.error || "Senha incorreta");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-[var(--border)] p-8">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <Gamepad2 className="h-6 w-6 text-green-500" />
          <span className="font-bold">Painel Admin</span>
        </div>
        <label className="block text-sm text-zinc-400 mb-1">Senha de administrador</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 mb-4 focus:border-green-500 focus:outline-none"
          placeholder="admin123"
        />
        {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
        <button type="submit" disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 font-medium hover:bg-green-700 disabled:opacity-50">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Entrar
        </button>
        <p className="text-xs text-zinc-500 text-center mt-4">Senha padrão: admin123</p>
      </form>
    </div>
  );
}
