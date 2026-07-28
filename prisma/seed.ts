import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const url = process.env.DATABASE_URL || "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminHash = await bcrypt.hash("admin123", 12);
  const apiSecret = uuidv4().replace(/-/g, "");

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: "Cidade RP Store",
      slogan: "VIP, veículos e benefícios com entrega automática no servidor",
      serverName: "Cidade RP",
      discordUrl: "https://discord.gg/exemplo",
      apiSecret,
      pixKey: "loja@email.com",
      pixBeneficiary: "Cidade RP Store",
      adminPasswordHash: adminHash,
      primaryColor: "#2563eb",
    },
  });

  const categories = [
    { name: "VIP", slug: "vip", icon: "Crown", description: "Planos VIP com benefícios exclusivos" },
    { name: "Veículos", slug: "veiculos", icon: "Car", description: "Carros exclusivos para sua garagem" },
    { name: "Dinheiro", slug: "dinheiro", icon: "Banknote", description: "Pacotes de dinheiro in-game" },
    { name: "Itens", slug: "itens", icon: "Package", description: "Itens e kits especiais" },
  ];

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { position: i },
      create: { ...cat, position: i },
    });
  }

  const vip = await prisma.category.findUnique({ where: { slug: "vip" } });
  const veiculos = await prisma.category.findUnique({ where: { slug: "veiculos" } });
  const dinheiro = await prisma.category.findUnique({ where: { slug: "dinheiro" } });

  const products = [
    {
      name: "VIP Bronze - 30 dias",
      slug: "vip-bronze-30",
      description: "Salário R$5.000/hora, tag VIP Bronze no Discord, acesso a veículos básicos VIP.",
      price: 29.9,
      categoryId: vip!.id,
      command: "addvip",
      commandArgs: '["{client_identifier}", "bronze", "30"]',
      featured: true,
      expiryDays: 30,
    },
    {
      name: "VIP Ouro - 30 dias",
      slug: "vip-ouro-30",
      description: "Salário R$15.000/hora, tag Ouro, veículos exclusivos, prioridade na fila.",
      price: 79.9,
      categoryId: vip!.id,
      command: "addvip",
      commandArgs: '["{client_identifier}", "ouro", "30"]',
      featured: true,
      expiryDays: 30,
    },
    {
      name: "VIP Diamante - 30 dias",
      slug: "vip-diamante-30",
      description: "Salário R$30.000/hora, tag Diamante, todos os benefícios, suporte prioritário.",
      price: 149.9,
      categoryId: vip!.id,
      command: "addvip",
      commandArgs: '["{client_identifier}", "diamante", "30"]',
      featured: true,
      expiryDays: 30,
    },
    {
      name: "Lamborghini Urus",
      slug: "lamborghini-urus",
      description: "Veículo permanente adicionado à sua garagem automaticamente após a compra.",
      price: 89.9,
      categoryId: veiculos!.id,
      command: "spawnvehicle",
      commandArgs: '["{client_identifier}", "urus"]',
      deliveryType: "spawn",
      spawnModel: "urus",
      featured: true,
    },
    {
      name: "BMW M4",
      slug: "bmw-m4",
      description: "Veículo esportivo spawnado na sua frente após a compra.",
      price: 59.9,
      categoryId: veiculos!.id,
      command: "spawnvehicle",
      commandArgs: '["{client_identifier}", "m4"]',
      deliveryType: "spawn",
      spawnModel: "m4",
    },
    {
      name: "R$ 100.000 in-game",
      slug: "100k",
      description: "Pacote de R$ 100.000 depositado na sua conta bancária in-game.",
      price: 19.9,
      categoryId: dinheiro!.id,
      command: "givemoney",
      commandArgs: '["{client_identifier}", "100000"]',
    },
    {
      name: "R$ 500.000 in-game",
      slug: "500k",
      description: "Pacote de R$ 500.000 depositado automaticamente.",
      price: 79.9,
      categoryId: dinheiro!.id,
      command: "givemoney",
      commandArgs: '["{client_identifier}", "500000"]',
      featured: true,
    },
  ];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { position: i },
      create: { ...p, position: i },
    });
  }

  console.log("Seed OK!");
  console.log("Admin senha: admin123");
  console.log("API Token FiveM:", apiSecret);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
