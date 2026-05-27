import { z } from 'zod';
import { PaginationSchema, SortSchema } from './common';

export const InvoiceStatus = z.enum([
  'draft',
  'sent',
  'viewed',
  'partial',
  'paid',
  'overdue',
  'void',
]);

export const InvoiceLineSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  description: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
  unitPrice: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  taxRate: z.number().nonnegative().default(0),
});

export const CreateInvoiceSchema = z.object({
  salesOrderId: z.string().uuid().optional(),
  companyId: z.string().uuid(),
  status: InvoiceStatus.default('draft'),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  currency: z.string().length(3).default('USD'),
  exchangeRate: z.number().optional(),
  notes: z.string().optional(),
  lines: z.array(InvoiceLineSchema).optional(),
});

export const UpdateInvoiceSchema = CreateInvoiceSchema.partial();

export const InvoiceFilterSchema = PaginationSchema.merge(SortSchema).extend({
  search: z.string().optional(),
  companyId: z.string().uuid().optional(),
  salesOrderId: z.string().uuid().optional(),
  status: InvoiceStatus.optional(),
});

export type CreateInvoice = z.infer<typeof CreateInvoiceSchema>;
export type UpdateInvoice = z.infer<typeof UpdateInvoiceSchema>;
export type InvoiceFilter = z.infer<typeof InvoiceFilterSchema>;
