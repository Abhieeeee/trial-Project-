"use server";

export interface PromoValidationResult {
  valid: boolean;
  discountPercent: number;
  code: string;
  message: string;
}

const PROMO_REGISTRY: Record<string, number> = {
  AURA10: 10,
  NEPAL2026: 15,
  FREESHIP: 5,
};

export async function validatePromoCode(inputCode: string): Promise<PromoValidationResult> {
  const code = inputCode.trim().toUpperCase();

  if (!code) {
    return { valid: false, discountPercent: 0, code: "", message: "Please enter a valid promotional code." };
  }

  const discount = PROMO_REGISTRY[code];
  if (discount) {
    return {
      valid: true,
      discountPercent: discount,
      code,
      message: `Promo code '${code}' applied successfully (-${discount}% discount).`,
    };
  }

  return {
    valid: false,
    discountPercent: 0,
    code: "",
    message: `Invalid promo code '${code}'. Check spelling and try again.`,
  };
}
