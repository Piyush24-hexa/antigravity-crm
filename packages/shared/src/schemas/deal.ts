import { z } from 'zod';
import { PaginationSchema, SortSchema } from './common';

export const DealStatus = z.enum(['open', 'won', 'lost']);

export const CreateDealSchema = z.object({
  title: z.string().min(1).max(255),
  dealType: z.enum(['New Business', 'Expansion', 'Renewal']).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  source: z.string().max(100).optional(),
  contactId: z.string().uuid().optional(),
  companyId: z.string().uuid().optional(),
  stageId: z.string().uuid(),
  ownerId: z.string().uuid().optional(),
  value: z.number().nonnegative().optional(),
  currency: z.string().length(3).default('USD'),
  billingFrequency: z.enum(['One-time', 'Monthly', 'Annually']).optional(),
  closeDate: z.string().datetime().optional(),
  winProbability: z.number().min(0).max(100).optional(),
  status: DealStatus.default('open'),
  competitors: z.array(z.string().max(100)).default([]),
  nextStep: z.string().max(500).optional(),
  nextStepDate: z.string().datetime().optional(),
  customFields: z.record(z.unknown()).default({}),
});

export const UpdateDealSchema = CreateDealSchema.partial();

export const MoveStageSchema = z.object({
  stageId: z.string().uuid(),
});

export const DealFilterSchema = PaginationSchema.merge(SortSchema).extend({
  search: z.string().optional(),
  stageId: z.string().uuid().optional(),
  pipelineId: z.string().uuid().optional(),
  ownerId: z.string().uuid().optional(),
  status: DealStatus.optional(),
  valueMin: z.coerce.number().nonnegative().optional(),
  valueMax: z.coerce.number().nonnegative().optional(),
  atRisk: z.coerce.boolean().optional(),
});

export type CreateDeal = z.infer<typeof CreateDealSchema>;
export type UpdateDeal = z.infer<typeof UpdateDealSchema>;
export type MoveStage = z.infer<typeof MoveStageSchema>;
export type DealFilter = z.infer<typeof DealFilterSchema>;
