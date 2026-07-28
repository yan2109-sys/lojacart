import { hashPassword, createAdminToken, setAdminCookie, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/lib/store";
import { jsonOk, jsonErr } from "@/lib/api";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const schema = z.object({
  storeName: z.string().min(2),
  serverName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return jsonErr(parsed.error.issues[0]?.message || "Dados inválidos");

    const { storeName, serverName, email, password } = parsed.data;
    const existing = await getStoreSettings();

    const stillDefault = await verifyPassword("admin123", existing.adminPasswordHash);
    if (!stillDefault) {
      return jsonErr("Loja já configurada. Faça login no painel.", 409);
    }

    const passwordHash = await hashPassword(password);

    await prisma.storeSettings.upsert({
      where: { id: 1 },
      update: {
        storeName,
        serverName,
        slogan: `VIP, veículos e benefícios para ${serverName}`,
        adminPasswordHash: passwordHash,
        pixBeneficiary: storeName,
      },
      create: {
        id: 1,
        storeName,
        serverName,
        slogan: `VIP, veículos e benefícios para ${serverName}`,
        adminPasswordHash: passwordHash,
        apiSecret: uuidv4().replace(/-/g, ""),
        pixKey: email,
        pixBeneficiary: storeName,
      },
    });

    const token = await createAdminToken();
    await setAdminCookie(token);

    return jsonOk({ message: "Loja criada com sucesso!" }, 201);
  } catch (e) {
    console.error(e);
    return jsonErr("Erro interno", 500);
  }
}
