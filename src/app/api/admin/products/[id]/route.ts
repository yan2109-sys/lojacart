import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { buildDeliveryFields } from "@/lib/product-delivery";
import { jsonOk, jsonErr, requireAdmin } from "@/lib/api";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return jsonErr("Não autorizado", 401);
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) return jsonErr("Produto não encontrado", 404);
  return jsonOk(product);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return jsonErr("Não autorizado", 401);
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};

  if (body.name !== undefined) {
    data.name = body.name;
    data.slug = body.slug || slugify(body.name);
  }
  if (body.description !== undefined) data.description = body.description;
  if (body.price !== undefined) data.price = parseFloat(body.price);
  if (body.categoryId !== undefined) data.categoryId = body.categoryId;
  if (body.featured !== undefined) data.featured = body.featured;
  if (body.enabled !== undefined) data.enabled = body.enabled;
  if (body.stock !== undefined) data.stock = body.stock;
  if (body.expiryDays !== undefined) data.expiryDays = body.expiryDays;
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl || null;

  if (body.deliveryType !== undefined) {
    const delivery = buildDeliveryFields(body);
    data.command = delivery.command;
    data.commandArgs = delivery.commandArgs;
    data.deliveryType = delivery.deliveryType;
    data.spawnModel = delivery.spawnModel;
  } else {
    if (body.command !== undefined) data.command = body.command;
    if (body.commandArgs !== undefined) data.commandArgs = body.commandArgs;
    if (body.spawnModel !== undefined) data.spawnModel = body.spawnModel || null;
  }

  const product = await prisma.product.update({ where: { id }, data });
  return jsonOk(product);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return jsonErr("Não autorizado", 401);
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return jsonOk({ deleted: true });
}
