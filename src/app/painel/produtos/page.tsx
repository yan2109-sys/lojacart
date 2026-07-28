"use client";

import { useEffect, useState, useRef } from "react";
import { formatCurrency } from "@/lib/utils";
import { DELIVERY_TYPES, parseDeliveryFromProduct, type DeliveryType } from "@/lib/product-delivery";
import { ProductImage } from "@/components/product-image";
import { Trash2, Plus, Loader2, Pencil, X, Upload, Car } from "lucide-react";

interface Category { id: string; name: string; }
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  enabled: boolean;
  featured: boolean;
  command: string;
  commandArgs: string;
  categoryId: string;
  imageUrl: string | null;
  spawnModel: string | null;
  deliveryType: string;
  category: { name: string };
}

const emptyForm = {
  name: "", description: "", price: "", categoryId: "",
  deliveryType: "spawn" as DeliveryType,
  spawnModel: "",
  vipTier: "bronze",
  vipDays: "30",
  moneyAmount: "100000",
  command: "notify", commandArgs: '["{client_identifier}"]',
  featured: false, enabled: true,
  imageUrl: "" as string | null,
};

export default function PainelProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);

  function load() {
    fetch("/api/admin/products").then((r) => r.json()).then((d) => d.success && setProducts(d.data));
    fetch("/api/store").then((r) => r.json()).then((d) => {
      if (d.success) setCategories(d.data.categories.map((c: Category) => ({ id: c.id, name: c.name })));
    });
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
    setShowForm(true);
  }

  function openEdit(p: Product) {
    const parsed = parseDeliveryFromProduct(p);
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      categoryId: p.categoryId,
      deliveryType: parsed.type,
      spawnModel: p.spawnModel || parsed.spawnModel || "",
      vipTier: parsed.vipTier,
      vipDays: parsed.vipDays,
      moneyAmount: parsed.moneyAmount,
      command: p.command,
      commandArgs: p.commandArgs,
      featured: p.featured,
      enabled: p.enabled,
      imageUrl: p.imageUrl,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.success) setForm((f) => ({ ...f, imageUrl: data.data.url }));
    else alert(data.error || "Erro ao enviar imagem");
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function toggleEnabled(id: string, enabled: boolean) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !enabled }),
    });
    load();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Excluir produto?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (form.deliveryType === "spawn" && !form.spawnModel.trim()) {
      alert("Informe o modelo do veículo para spawn na cidade");
      return;
    }
    setLoading(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      imageUrl: form.imageUrl || null,
      spawnModel: form.spawnModel || null,
    };

    if (editingId) {
      await fetch(`/api/admin/products/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    closeForm();
    setLoading(false);
    load();
  }

  const inputClass = "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Produtos</h1>
          <p className="text-zinc-500 text-sm mt-1">Cadastre, edite fotos e configure spawn na cidade</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition">
          <Plus className="h-4 w-4" /> Novo produto
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form onSubmit={saveProduct} className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-zinc-100">{editingId ? "Editar produto" : "Cadastrar produto"}</h2>
              <button type="button" onClick={closeForm} className="text-zinc-500 hover:text-zinc-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Foto do produto</label>
              <div className="flex items-start gap-4">
                <div className="relative h-28 w-28 shrink-0 rounded-xl border border-zinc-700 bg-zinc-950 overflow-hidden flex items-center justify-center">
                  <ProductImage src={form.imageUrl} alt="Preview" iconClassName="h-8 w-8 text-zinc-600" />
                </div>
                <div className="flex-1 space-y-2">
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} className="hidden" />
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 disabled:opacity-50">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading ? "Enviando..." : "Escolher foto"}
                  </button>
                  {form.imageUrl && (
                    <button type="button" onClick={() => setForm({ ...form, imageUrl: null })} className="text-xs text-red-400 hover:underline">
                      Remover foto
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Nome</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Preço (R$)</label>
                <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-1">Categoria</label>
                <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputClass}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Tipo de entrega</label>
              <select value={form.deliveryType} onChange={(e) => setForm({ ...form, deliveryType: e.target.value as DeliveryType })} className={inputClass}>
                {DELIVERY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            {form.deliveryType === "spawn" && (
              <div className="rounded-lg border border-blue-900 bg-blue-950/30 p-4 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                  <Car className="h-4 w-4" /> Spawn direto na cidade
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Modelo do veículo (spawn name)</label>
                  <input required value={form.spawnModel} onChange={(e) => setForm({ ...form, spawnModel: e.target.value })}
                    placeholder="Ex: urus, m4, adder, sultan"
                    className={inputClass} />
                  <p className="text-xs text-zinc-500 mt-1">O veículo aparece na frente do jogador após o pagamento. Use o ID do servidor na compra.</p>
                </div>
              </div>
            )}

            {form.deliveryType === "vip" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Plano VIP</label>
                  <input value={form.vipTier} onChange={(e) => setForm({ ...form, vipTier: e.target.value })} placeholder="bronze, ouro, diamante" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Dias</label>
                  <input value={form.vipDays} onChange={(e) => setForm({ ...form, vipDays: e.target.value })} className={inputClass} />
                </div>
              </div>
            )}

            {form.deliveryType === "money" && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Valor in-game (R$)</label>
                <input value={form.moneyAmount} onChange={(e) => setForm({ ...form, moneyAmount: e.target.value })} className={inputClass} />
              </div>
            )}

            {form.deliveryType === "custom" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Comando FiveM</label>
                  <input value={form.command} onChange={(e) => setForm({ ...form, command: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Argumentos (JSON)</label>
                  <input value={form.commandArgs} onChange={(e) => setForm({ ...form, commandArgs: e.target.value })} className={inputClass} />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Descrição</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} h-20`} />
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-400">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Destaque na loja
              </label>
              {editingId && (
                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
                  Produto ativo
                </label>
              )}
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={loading || uploading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingId ? "Salvar alterações" : "Cadastrar"}
              </button>
              <button type="button" onClick={closeForm} className="rounded-lg border border-zinc-700 px-6 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="relative h-12 w-12 shrink-0 rounded-lg border border-zinc-700 bg-zinc-950 overflow-hidden flex items-center justify-center">
              <ProductImage src={p.imageUrl} alt={p.name} iconClassName="h-5 w-5 text-zinc-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-zinc-100">{p.name}</p>
              <p className="text-xs text-zinc-500 truncate">
                {p.category.name}
                {p.deliveryType === "spawn" && p.spawnModel ? ` · spawn: ${p.spawnModel}` : ` · ${p.command}`}
              </p>
            </div>
            <span className="font-bold text-blue-400 shrink-0">{formatCurrency(p.price)}</span>
            <button onClick={() => toggleEnabled(p.id, p.enabled)}
              className={`rounded-full px-3 py-1 text-xs font-medium shrink-0 ${p.enabled ? "bg-blue-950 text-blue-400" : "bg-zinc-800 text-zinc-500"}`}>
              {p.enabled ? "Ativo" : "Inativo"}
            </button>
            <button onClick={() => openEdit(p)} className="text-zinc-500 hover:text-blue-400 shrink-0" title="Editar">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={() => deleteProduct(p.id)} className="text-zinc-500 hover:text-red-400 shrink-0">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
