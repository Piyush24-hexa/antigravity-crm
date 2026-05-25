import { z } from 'zod';

export const CreatePipelineSchema = z.object({
  name: z.string().min(1).max(255),
  isDefault: z.boolean().default(false),
});

export const UpdatePipelineSchema = CreatePipelineSchema.partial();

export const CreateStageSchema = z.object({
  name: z.string().min(1).max(255),
  displayOrder: z.number().int().min(0),
  winProbability: z.number().min(0).max(1).default(0),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export const UpdateStageSchema = CreateStageSchema.partial();

export type CreatePipeline = z.infer<typeof CreatePipelineSchema>;
export type UpdatePipeline = z.infer<typeof UpdatePipelineSchema>;
export type CreateStage = z.infer<typeof CreateStageSchema>;
export type UpdateStage = z.infer<typeof UpdateStageSchema>;
