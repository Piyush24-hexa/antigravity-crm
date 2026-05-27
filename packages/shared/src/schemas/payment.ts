import { z } from 'zod';
import { PaginationSchema, SortSchema } from './common';

export const PaymentMethod = z.enum([
  'bank_transfer',
  'card',
  'cheque',
  'cash',
  'crypto',
]);

export const PaymentStatus = z.enum([
  'pending',
  'cleared',
  'bounced',
  'refunded',
]);

export const CreatePaymentSchema = z.object({
  invoiceId: z.string().uuid(),
  amount: z.number().nonnegative(),
  method: PaymentMethod,
  referenceNumber: z.string().max(100).optional(),
  status: PaymentStatus.default('pending'),
  paidAt: z.string().datetime(),
  notes: z.string().optional(),
});

export const UpdatePaymentSchema = CreatePaymentSchema.partial();

export const PaymentFilterSchema = PaginationSchema.merge(SortSchema).extend({
  invoiceId: z.string().uuid().optional(),
  status: PaymentStatus.optional(),
  method: PaymentMethod.optional(),
});

export type CreatePayment = z.infer<typeof CreatePaymentSchema>;
export type UpdatePayment = z.infer<typeof UpdatePaymentSchema>;
export type PaymentFilter = z.infer<typeof PaymentFilterSchema>;
