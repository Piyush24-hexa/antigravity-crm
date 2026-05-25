import { z } from 'zod';
import { PaginationSchema, SortSchema } from './common';

export const CreateCompanySchema = z.object({
  name: z.string().min(1).max(255),
  legalName: z.string().max(255).optional(),
  domain: z.string().max(255).optional(),
  industry: z.string().max(100).optional(),
  size: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']).optional(),
  revenue: z.number().int().nonnegative().optional(),
  
  taxId: z.string().max(100).optional(),
  registrationNumber: z.string().max(100).optional(),
  companyType: z.string().max(50).optional(),
  currency: z.string().max(3).default('USD'),
  paymentTerms: z.string().max(50).optional(),
  creditLimit: z.number().nonnegative().optional(),
  
  phone: z.string().max(50).optional(),
  email: z.string().email().optional(),
  
  billingStreet: z.string().max(500).optional(),
  billingCity: z.string().max(100).optional(),
  billingState: z.string().max(100).optional(),
  billingZip: z.string().max(50).optional(),
  billingCountry: z.string().max(100).optional(),
  
  shippingStreet: z.string().max(500).optional(),
  shippingCity: z.string().max(100).optional(),
  shippingState: z.string().max(100).optional(),
  shippingZip: z.string().max(50).optional(),
  shippingCountry: z.string().max(100).optional(),

  country: z.string().max(100).optional(),
  techStack: z.array(z.string().max(100)).default([]),
  customFields: z.record(z.unknown()).default({}),
});

export const UpdateCompanySchema = CreateCompanySchema.partial();

export const CompanyFilterSchema = PaginationSchema.merge(SortSchema).extend({
  search: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  country: z.string().optional(),
});

export type CreateCompany = z.infer<typeof CreateCompanySchema>;
export type UpdateCompany = z.infer<typeof UpdateCompanySchema>;
export type CompanyFilter = z.infer<typeof CompanyFilterSchema>;
