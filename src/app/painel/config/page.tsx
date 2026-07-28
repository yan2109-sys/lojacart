"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Copy, CheckCircle } from "lucide-react";

export default function PainelConfigPage() {
  const [settings, setSettings] = useState({
    storeName: "", slogan: "", serverName: "", discordUrl: "",
    pixKey: "", pixBeneficiary: "", apiSecret: "",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

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

  function copyToken() {
    navigator.clipboard.writeText(settings.apiSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const inputClass = "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Configurações</h1>
        <p className="text-zinc-500 text-sm mt-1">Personalize sua loja, PIX e integração FiveM</p>
      </div>
      <form onSubmit={save} className="max-w-lg space-y-5">
        {[
          { key: "storeName", label: "Nome da loja" },
          { key: "slogan", label: "Slogan" },
          { key: "serverName", label: "Nome do servidor FiveM" },
          { key: "discordUrl", label: "Link do Discord" },
          { key: "pixKey", label: "Chave PIX" },
          { key: "pixBeneficiary", label: "Nome do beneficiário PIX" },
        ].map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-zinc-300 mb-1">{f.label}</label>
            <input
              value={settings[f.key as keyof typeof settings] as string}
              onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
              className={inputClass}
            />
          </div>
        ))}

        <div className="rounded-xl border border-blue-900 bg-blue-950/50 p-4">
          <p className="text-sm font-medium text-blue-300 mb-2">Token API FiveM</p>
          <div className="flex items-center gap-2">
            <p className="text-xs font-mono text-blue-200 break-all flex-1">{settings.apiSecret}</p>
            <button type="button" onClick={copyToken} className="shrink-0 rounded-lg p-2 hover:bg-blue-900">
              {copied ? <CheckCircle className="h-4 w-4 text-blue-400" /> : <Copy className="h-4 w-4 text-blue-400" />}
            </button>
          </div>
          <p className="text-xs text-blue-400/70 mt-2">Cole este token no resource FiveM (config.lua) para entrega automática.</p>
        </div>

        <button type="submit" disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? "Salvo!" : "Salvar configurações"}
        </button>
      </form>
    </div>
  );
}
