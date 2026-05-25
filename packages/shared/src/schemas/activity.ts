import { z } from 'zod';
import { PaginationSchema, SortSchema } from './common';

export const ActivityType = z.enum(['email', 'call', 'note', 'task', 'meeting', 'sms']);
export const Direction = z.enum(['inbound', 'outbound']);
export const Sentiment = z.enum(['positive', 'neutral', 'negative', 'at_risk']);

export const CreateActivitySchema = z.object({
  contactId: z.string().uuid().optional(),
  dealId: z.string().uuid().optional(),
  companyId: z.string().uuid().optional(),
  type: ActivityType,
  direction: Direction.optional(),
  subject: z.string().max(255).optional(),
  body: z.string().optional(),
  durationSeconds: z.number().int().nonnegative().optional(),
  scheduledAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
});

export const UpdateActivitySchema = CreateActivitySchema.partial();

export const ActivityFilterSchema = PaginationSchema.merge(SortSchema).extend({
  contactId: z.string().uuid().optional(),
  dealId: z.string().uuid().optional(),
  companyId: z.string().uuid().optional(),
  type: ActivityType.optional(),
  direction: Direction.optional(),
  days: z.coerce.number().int().min(1).max(365).optional(),
});

export type CreateActivity = z.infer<typeof CreateActivitySchema>;
export type UpdateActivity = z.infer<typeof UpdateActivitySchema>;
export type ActivityFilter = z.infer<typeof ActivityFilterSchema>;
