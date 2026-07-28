import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { buildDeliveryFields } from "@/lib/product-delivery";
import { jsonOk, jsonErr, requireAdmin } from "@/lib/api";

export async function GET() {
  if (!(await requireAdmin())) return jsonErr("Não autorizado", 401);
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { position: "asc" },
  });
  return jsonOk(products);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return jsonErr("Não autorizado", 401);
  const body = await request.json();
  const slug = body.slug || slugify(body.name);
  const delivery = buildDeliveryFields(body);
  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug,
      description: body.description || "",
      price: parseFloat(body.price),
      categoryId: body.categoryId,
      command: delivery.command,
      commandArgs: delivery.commandArgs,
      deliveryType: delivery.deliveryType,
      spawnModel: delivery.spawnModel,
      enabled: body.enabled ?? true,
      featured: body.featured ?? false,
      stock: body.stock ?? null,
      expiryDays: body.expiryDays ?? null,
      imageUrl: body.imageUrl ?? null,
    },
  });
  return jsonOk(product, 201);
}
