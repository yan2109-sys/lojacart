import { getBillingSummary } from "@/lib/billing";
import { getStoreSettings } from "@/lib/store";
import { prisma } from "@/lib/prisma";
import { jsonOk, jsonErr, requireAdmin } from "@/lib/api";

const MIN_WITHDRAWAL = 10;

export async function GET() {
  if (!(await requireAdmin())) return jsonErr("Não autorizado", 401);
  const withdrawals = await prisma.withdrawal.findMany({ orderBy: { createdAt: "desc" } });
  return jsonOk(withdrawals);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return jsonErr("Não autorizado", 401);

  const body = await request.json();
  const amount = parseFloat(body.amount);

  if (!amount || amount < MIN_WITHDRAWAL) {
    return jsonErr(`Valor mínimo para saque: R$ ${MIN_WITHDRAWAL.toFixed(2)}`);
  }

  const [billing, settings] = await Promise.all([getBillingSummary(), getStoreSettings()]);

  if (!settings.pixKey) {
    return jsonErr("Configure sua chave PIX em Configurações antes de sacar");
  }

  if (amount > billing.availableBalance) {
    return jsonErr("Saldo insuficiente para este saque");
  }

  const withdrawal = await prisma.withdrawal.create({
    data: {
      amount,
      pixKey: settings.pixKey,
      status: "COMPLETED",
      note: `Saque para ${settings.pixBeneficiary || settings.pixKey}`,
      completedAt: new Date(),
    },
  });

  return jsonOk(withdrawal, 201);
}
