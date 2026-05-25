import { z } from 'zod';

// ═══════════════════════════════════════
// PAGINATION & SORTING
// ═══════════════════════════════════════

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const SortSchema = z.object({
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type Pagination = z.infer<typeof PaginationSchema>;
export type Sort = z.infer<typeof SortSchema>;

// ═══════════════════════════════════════
// API ENVELOPE
// ═══════════════════════════════════════

export interface ApiSuccess<T> {
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    took_ms: number;
  };
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
}

// ═══════════════════════════════════════
// UUID
// ═══════════════════════════════════════

export const UuidSchema = z.string().uuid();
export const UuidParamSchema = z.object({ id: UuidSchema });
