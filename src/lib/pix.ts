export function generatePixPayload(amount: number, orderId: string, pixKey: string, beneficiary: string) {
  const txId = orderId.slice(0, 25).replace(/-/g, "");
  const amountStr = amount.toFixed(2);
  return {
    copyPaste: `00020126580014BR.GOV.BCB.PIX0136${pixKey}520400005303986540${amountStr.length.toString().padStart(2, "0")}${amountStr}5802BR5913${beneficiary.slice(0, 13).padEnd(13)}6009SAO PAULO62070503***6304${txId.slice(0, 4).toUpperCase()}`,
    txId,
  };
}
