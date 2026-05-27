import { z } from 'zod';

export const workOrderStatusSchema = z.enum([
  'pending',
  'released',
  'in_progress',
  'qc',
  'completed',
  'cancelled'
]);

export type WorkOrderStatus = z.infer<typeof workOrderStatusSchema>;

export const createWorkOrderSchema = z.object({
  salesOrderId: z.string().uuid(),
  productId: z.string().uuid(),
  plannedQty: z.number().int().min(1),
  plannedStart: z.string().datetime().optional(),
  plannedEnd: z.string().datetime().optional(),
});

export type CreateWorkOrder = z.infer<typeof createWorkOrderSchema>;

export const updateWorkOrderProgressSchema = z.object({
  status: workOrderStatusSchema.optional(),
  completedQty: z.number().int().min(0).optional(),
  rejectedQty: z.number().int().min(0).optional(),
  actualStart: z.string().datetime().optional(),
  actualEnd: z.string().datetime().optional(),
});

export type UpdateWorkOrderProgress = z.infer<typeof updateWorkOrderProgressSchema>;

export const createWorkOrderLogSchema = z.object({
  type: z.enum(['status_change', 'qc_check', 'qty_update', 'note']),
  notes: z.string().min(1),
});

export type CreateWorkOrderLog = z.infer<typeof createWorkOrderLogSchema>;

export const workOrderFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  status: workOrderStatusSchema.optional(),
  salesOrderId: z.string().uuid().optional(),
  search: z.string().optional(),
});

export type WorkOrderFilter = z.infer<typeof workOrderFilterSchema>;
