export type DeliveryType = "spawn" | "vip" | "money" | "custom";

export const DELIVERY_TYPES: { value: DeliveryType; label: string }[] = [
  { value: "spawn", label: "Spawn na cidade (veículo)" },
  { value: "vip", label: "VIP" },
  { value: "money", label: "Dinheiro in-game" },
  { value: "custom", label: "Personalizado" },
];

export function buildDeliveryFields(input: {
  deliveryType: DeliveryType;
  spawnModel?: string;
  command?: string;
  commandArgs?: string;
  vipTier?: string;
  vipDays?: string;
  moneyAmount?: string;
}) {
  const { deliveryType } = input;

  if (deliveryType === "spawn" && input.spawnModel) {
    return {
      deliveryType: "spawn",
      spawnModel: input.spawnModel,
      command: "spawnvehicle",
      commandArgs: JSON.stringify(["{client_identifier}", input.spawnModel]),
    };
  }

  if (deliveryType === "vip") {
    const tier = input.vipTier || "bronze";
    const days = input.vipDays || "30";
    return {
      deliveryType: "vip",
      spawnModel: null,
      command: "addvip",
      commandArgs: JSON.stringify(["{client_identifier}", tier, days]),
    };
  }

  if (deliveryType === "money") {
    const amount = input.moneyAmount || "100000";
    return {
      deliveryType: "money",
      spawnModel: null,
      command: "givemoney",
      commandArgs: JSON.stringify(["{client_identifier}", amount]),
    };
  }

  return {
    deliveryType: "custom",
    spawnModel: input.spawnModel || null,
    command: input.command || "notify",
    commandArgs: input.commandArgs || '["{client_identifier}"]',
  };
}

export function parseDeliveryFromProduct(product: {
  deliveryType?: string | null;
  spawnModel?: string | null;
  command: string;
  commandArgs: string;
}) {
  let type = (product.deliveryType || "custom") as DeliveryType;
  if ((product.command === "spawnvehicle" || product.command === "givevehicle") && type === "custom") {
    type = "spawn";
  }
  if (product.command === "addvip" && type === "custom") type = "vip";
  if (product.command === "givemoney" && type === "custom") type = "money";
  let vipTier = "bronze";
  let vipDays = "30";
  let moneyAmount = "100000";

  try {
    const args = JSON.parse(product.commandArgs) as string[];
    if (type === "vip") {
      vipTier = args[1] || "bronze";
      vipDays = args[2] || "30";
    }
    if (type === "money") {
      moneyAmount = args[1] || "100000";
    }
  } catch { /* ignore */ }

  const spawnModel = product.spawnModel || (type === "spawn" ? (() => {
    try {
      const args = JSON.parse(product.commandArgs) as string[];
      return args[1] || "";
    } catch { return ""; }
  })() : "");

  return { type, vipTier, vipDays, moneyAmount, spawnModel };
}
