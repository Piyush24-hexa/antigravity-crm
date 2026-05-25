import { prisma } from '@antigravity/db';
import type { CompanyFilter, CreateCompany, UpdateCompany } from '@antigravity/shared';
import type { Prisma } from '@prisma/client';

export class CompanyService {
  async list(filter: CompanyFilter) {
    const { page, limit, sortBy, sortOrder, search, industry, size, country } = filter;
    const skip = (page - 1) * limit;

    const where: Prisma.CompanyWhereInput = {
      ...(industry && { industry }),
      ...(size && { size }),
      ...(country && { country }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { domain: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: { select: { contacts: true, deals: true } },
        },
      }),
      prisma.company.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async getById(id: string) {
    return prisma.company.findUnique({
      where: { id },
      include: {
        contacts: {
          where: { gdprDeleted: false },
          orderBy: { leadScore: 'desc' },
          take: 20,
          include: { owner: { select: { id: true, name: true, avatarUrl: true } } },
        },
        deals: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { stage: { select: { name: true, color: true } } },
        },
        _count: { select: { contacts: true, deals: true, activities: true } },
      },
    });
  }

  async create(data: CreateCompany) {
    return prisma.company.create({ data: { ...(data as any), revenue: data.revenue ? BigInt(data.revenue) : null } });
  }

  async update(id: string, data: UpdateCompany) {
    return prisma.company.update({
      where: { id },
      data: { ...(data as any), revenue: data.revenue ? BigInt(data.revenue) : undefined },
    });
  }

  async delete(id: string) {
    return prisma.company.delete({ where: { id } });
  }
}

export const companyService = new CompanyService();
