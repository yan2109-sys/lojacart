import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function getStoreSettings() {
  let settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    const { hashPassword } = await import("@/lib/auth");
    settings = await prisma.storeSettings.create({
      data: {
        id: 1,
        storeName: "Minha Loja FiveM",
        apiSecret: uuidv4().replace(/-/g, ""),
        adminPasswordHash: await hashPassword("admin123"),
        pixKey: "sua-chave-pix@email.com",
        pixBeneficiary: "Sua Loja RP",
      },
    });
  }
  return settings;
}

export async function getPublicStore() {
  const settings = await getStoreSettings();
  const categories = await prisma.category.findMany({
    where: { enabled: true },
    orderBy: { position: "asc" },
    include: {
      products: {
        where: { enabled: true },
        orderBy: { position: "asc" },
      },
    },
  });
  const featured = await prisma.product.findMany({
    where: { enabled: true, featured: true },
    include: { category: true },
    take: 6,
  });
  return {
    settings: {
      storeName: settings.storeName,
      slogan: settings.slogan,
      logoUrl: settings.logoUrl,
      primaryColor: settings.primaryColor,
      serverName: settings.serverName,
      discordUrl: settings.discordUrl,
    },
    categories,
    featured,
  };
}
