"use client";

import Link from "next/link";
import { ShoppingBag, LayoutDashboard, Store, Shield, Zap, CreditCard, Gamepad2 } from "lucide-react";

export default function PlatformLanding() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-zinc-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Store className="h-4 w-4" />
            </div>
            LojaCart
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            <a href="#recursos" className="hover:text-zinc-100">Recursos</a>
            <a href="#como-funciona" className="hover:text-zinc-100">Como funciona</a>
            <Link href="/loja" className="hover:text-zinc-100">Ver loja demo</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/painel/login" className="text-sm font-medium text-zinc-400 hover:text-zinc-100">
              Entrar
            </Link>
            <Link href="/painel/registro" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
              Criar minha loja
            </Link>
          </div>
        </div>
      </header>

      <section className="gradient-hero px-4 py-20 md:py-28 text-center">
        <div className="mx-auto max-w-3xl animate-fade-up">
          <span className="inline-block rounded-full bg-blue-950 border border-blue-800 px-4 py-1.5 text-sm font-medium text-blue-400 mb-6">
            Plataforma para servidores FiveM
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-100 mb-6 leading-tight">
            Crie sua loja de<br />
            <span className="text-blue-500">produtos digitais</span>
          </h1>
          <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto">
            Monte sua vitrine, configure entregas automáticas no servidor e aceite PIX.
            Ideal para VIP, veículos, scripts e benefícios FiveM.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/painel/registro" className="rounded-xl bg-blue-600 px-8 py-3.5 font-semibold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition">
              Criar minha loja grátis
            </Link>
            <Link href="/loja" className="rounded-xl border border-zinc-700 px-8 py-3.5 font-semibold text-zinc-300 hover:bg-zinc-900 transition">
              Ver loja demo
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-zinc-500">
            <span>✓ Setup local</span>
            <span>✓ Entrega automática FiveM</span>
            <span>✓ PIX integrado</span>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-4 md:grid-cols-4 text-center">
          {[
            { value: "PIX", label: "Pagamento instantâneo" },
            { value: "Auto", label: "Entrega no servidor" },
            { value: "100%", label: "Personalizável" },
            { value: "Local", label: "Roda no seu PC" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-blue-500">{s.value}</p>
              <p className="text-sm text-zinc-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="recursos" className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-zinc-100 mb-4">Tudo para vender no FiveM</h2>
          <p className="text-center text-zinc-500 mb-12">Painel para cadastrar + loja para seus jogadores comprarem</p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: LayoutDashboard, title: "Painel de gestão", desc: "Cadastre produtos, categorias, veja pedidos e configure PIX em um painel limpo." },
              { icon: ShoppingBag, title: "Loja profissional", desc: "Vitrine moderna para seus jogadores comprarem VIP, veículos e pacotes." },
              { icon: Gamepad2, title: "Entrega automática", desc: "Script FiveM entrega VIP, dinheiro e veículos automaticamente após pagamento." },
              { icon: CreditCard, title: "Checkout PIX", desc: "Pagamento via PIX com confirmação e fila de entregas." },
              { icon: Zap, title: "Setup rápido", desc: "Rode localmente com start.bat em minutos." },
              { icon: Shield, title: "Seguro", desc: "Painel protegido por senha, token API para o servidor." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-blue-800 transition">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 text-blue-500">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-zinc-100 mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-zinc-900 py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-zinc-100 mb-12">Como funciona</h2>
          <div className="space-y-8 text-left">
            {[
              { step: "1", title: "Crie sua loja", desc: "Registre-se no painel, configure nome, PIX e servidor FiveM." },
              { step: "2", title: "Cadastre produtos", desc: "Adicione VIP, veículos, dinheiro com comandos de entrega automática." },
              { step: "3", title: "Instale o script", desc: "Coloque o resource no servidor FiveM com seu token API." },
              { step: "4", title: "Venda!", desc: "Jogadores compram na loja, pagam PIX e recebem automaticamente." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start bg-zinc-950 rounded-xl p-5 border border-zinc-800">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">{item.step}</span>
                <div>
                  <h3 className="font-semibold text-zinc-100">{item.title}</h3>
                  <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-zinc-100 mb-4">Pronto para começar?</h2>
        <p className="text-zinc-500 mb-8">Configure sua loja FiveM em minutos.</p>
        <Link href="/painel/registro" className="inline-block rounded-xl bg-blue-600 px-8 py-3.5 font-semibold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition">
          Criar minha loja grátis
        </Link>
      </section>

      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-600">
        © {new Date().getFullYear()} LojaCart · Plataforma local estilo CentralCart para FiveM
      </footer>
    </div>
  );
}
