import { ProductContextSchema, type ProductContext } from './schemas';

export function createEmptyProductContext(): ProductContext {
  return {
    productName: '',
    coreIngredients: [],
    coreSellingPoints: [],
    audience: '',
    occasion: '',
  };
}

export function validateProductContext(ctx: ProductContext): {
  valid: boolean;
  errors: string[];
} {
  const r = ProductContextSchema.safeParse(ctx);
  if (r.success) return { valid: true, errors: [] };
  return {
    valid: false,
    errors: r.error.issues.map(e => e.path.join('.') + ': ' + e.message),
  };
}

export function isProductContextComplete(ctx: ProductContext): boolean {
  return validateProductContext(ctx).valid;
}