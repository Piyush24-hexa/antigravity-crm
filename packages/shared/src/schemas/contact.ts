import { z } from 'zod';
import { PaginationSchema, SortSchema } from './common';

export const ContactStatus = z.enum(['lead', 'prospect', 'customer', 'churned']);

export const CreateContactSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().max(50).optional(),
  mobile: z.string().max(50).optional(),
  firstName: z.string().max(255).optional(),
  lastName: z.string().max(255).optional(),
  title: z.string().max(255).optional(),
  department: z.string().max(255).optional(),
  linkedin: z.string().url().max(255).optional().or(z.literal('')),
  twitter: z.string().url().max(255).optional().or(z.literal('')),
  street: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  zip: z.string().max(50).optional(),
  country: z.string().max(100).optional(),
  doNotCall: z.boolean().default(false),
  emailOptOut: z.boolean().default(false),
  companyId: z.string().uuid().optional(),
  ownerId: z.string().uuid().optional(),
  status: ContactStatus.default('lead'),
  source: z.string().max(100).optional(),
  tags: z.array(z.string().max(255)).default([]),
  customFields: z.record(z.unknown()).default({}),
});

export const UpdateContactSchema = CreateContactSchema.partial();

export const ContactFilterSchema = PaginationSchema.merge(SortSchema).extend({
  search: z.string().optional(),
  status: ContactStatus.optional(),
  ownerId: z.string().uuid().optional(),
  companyId: z.string().uuid().optional(),
  source: z.string().optional(),
  scoreMin: z.coerce.number().int().min(0).max(100).optional(),
  scoreMax: z.coerce.number().int().min(0).max(100).optional(),
  tag: z.string().optional(),
});

export type CreateContact = z.infer<typeof CreateContactSchema>;
export type UpdateContact = z.infer<typeof UpdateContactSchema>;
export type ContactFilter = z.infer<typeof ContactFilterSchema>;
