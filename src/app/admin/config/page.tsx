"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";

export default function AdminConfigPage() {
  const [settings, setSettings] = useState({
    storeName: "", slogan: "", serverName: "", discordUrl: "",
    primaryColor: "#16a34a", pixKey: "", pixBeneficiary: "", apiSecret: "",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => d.success && setSettings(d.data));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Configurações</h1>
      <form onSubmit={save} className="max-w-lg space-y-4">
        {[
          { key: "storeName", label: "Nome da loja" },
          { key: "slogan", label: "Slogan" },
          { key: "serverName", label: "Nome do servidor FiveM" },
          { key: "discordUrl", label: "Link do Discord" },
          { key: "pixKey", label: "Chave PIX" },
          { key: "pixBeneficiary", label: "Nome do beneficiário PIX" },
        ].map((f) => (
          <div key={f.key}>
            <label className="block text-sm text-zinc-400 mb-1">{f.label}</label>
            <input
              value={settings[f.key as keyof typeof settings] as string}
              onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>
        ))}

        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
          <p className="text-sm font-medium text-yellow-400 mb-1">Token API FiveM</p>
          <p className="text-xs font-mono text-zinc-400 break-all">{settings.apiSecret}</p>
          <p className="text-xs text-zinc-500 mt-2">Use este token no resource FiveM (config.lua)</p>
        </div>

        <button type="submit" disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 font-medium hover:bg-green-700 disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? "Salvo!" : "Salvar configurações"}
        </button>
      </form>
    </div>
  );
}
