import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/lib/store";
import { generatePixPayload } from "@/lib/pix";
import { jsonOk, jsonErr } from "@/lib/api";

const checkoutSchema = z.object({
  items: z.array(z.object({ productId: z.string(), quantity: z.number().min(1).max(10) })).min(1),
  clientEmail: z.string().email(),
  clientName: z.string().min(2).optional(),
  clientIdentifier: z.string().min(1, "Informe seu ID do servidor (passaporte/license)"),
  clientDiscord: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) return jsonErr(parsed.error.issues[0]?.message || "Dados inválidos");

    const { items, clientEmail, clientName, clientIdentifier, clientDiscord } = parsed.data;
    const settings = await getStoreSettings();

    let total = 0;
    const orderItems: {
      productId: string;
      name: string;
      price: number;
      quantity: number;
      command: string;
      commandArgs: string;
    }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId, enabled: true } });
      if (!product) return jsonErr(`Produto não encontrado`);
      if (product.stock !== null && product.stock < item.quantity) {
        return jsonErr(`${product.name} sem estoque suficiente`);
      }
      total += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        command: product.command,
        commandArgs: product.commandArgs,
      });
    }

    const order = await prisma.order.create({
      data: {
        clientEmail,
        clientName,
        clientIdentifier,
        clientDiscord,
        total,
        status: "PENDING",
        items: { create: orderItems },
      },
      include: { items: true },
    });

    const pix = generatePixPayload(
      total,
      order.internalId,
      settings.pixKey || "chave@pix.com",
      settings.pixBeneficiary || settings.storeName
    );

    await prisma.order.update({
      where: { id: order.id },
      data: { pixCopyPaste: pix.copyPaste },
    });

    return jsonOk({
      orderId: order.id,
      internalId: order.internalId,
      total,
      pixCopyPaste: pix.copyPaste,
    });
  } catch (e) {
    console.error(e);
    return jsonErr("Erro ao processar pedido", 500);
  }
}
