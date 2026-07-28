import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { jsonOk, jsonErr, requireAdmin } from "@/lib/api";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  if (!(await requireAdmin())) return jsonErr("Não autorizado", 401);

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return jsonErr("Nenhuma imagem enviada");
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return jsonErr("Formato inválido. Use JPG, PNG, WEBP ou GIF");
    }

    if (file.size > MAX_SIZE) {
      return jsonErr("Imagem muito grande. Máximo 5MB");
    }

    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const filename = `${uuidv4()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    return jsonOk({ url: `/uploads/products/${filename}` });
  } catch (e) {
    console.error(e);
    return jsonErr("Erro ao enviar imagem", 500);
  }
}
