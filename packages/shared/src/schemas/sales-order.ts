import { z } from 'zod';
import { PaginationSchema, SortSchema } from './common';

export const SalesOrderStatus = z.enum([
  'draft',
  'confirmed',
  'in_production',
  'shipped',
  'invoiced',
  'cancelled',
]);

export const SalesOrderLineSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
  unitPrice: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  taxRate: z.number().nonnegative().default(0),
});

export const CreateSalesOrderSchema = z.object({
  dealId: z.string().uuid(),
  quoteId: z.string().uuid().optional(),
  billingCompanyId: z.string().uuid().optional(),
  shippingCompanyId: z.string().uuid().optional(),
  status: SalesOrderStatus.default('draft'),
  currency: z.string().length(3).default('USD'),
  notes: z.string().optional(),
  lines: z.array(SalesOrderLineSchema).optional(),
});

export const UpdateSalesOrderSchema = CreateSalesOrderSchema.partial();

export const SalesOrderFilterSchema = PaginationSchema.merge(SortSchema).extend({
  search: z.string().optional(),
  dealId: z.string().uuid().optional(),
  status: SalesOrderStatus.optional(),
});

export type CreateSalesOrder = z.infer<typeof CreateSalesOrderSchema>;
export type UpdateSalesOrder = z.infer<typeof UpdateSalesOrderSchema>;
export type SalesOrderFilter = z.infer<typeof SalesOrderFilterSchema>;
