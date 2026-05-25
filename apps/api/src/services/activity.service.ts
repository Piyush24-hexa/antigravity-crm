import { prisma } from '@antigravity/db';
import type { ActivityFilter, CreateActivity, UpdateActivity } from '@antigravity/shared';
import type { Prisma } from '@prisma/client';

export class ActivityService {
  async list(filter: ActivityFilter) {
    const { page, limit, sortBy, sortOrder, contactId, dealId, companyId, type, direction, days } = filter;
    const skip = (page - 1) * limit;

    const where: Prisma.ActivityWhereInput = {
      ...(contactId && { contactId }),
      ...(dealId && { dealId }),
      ...(companyId && { companyId }),
      ...(type && { type }),
      ...(direction && { direction }),
      ...(days && {
        createdAt: { gte: new Date(Date.now() - days * 86400000) },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          contact: { select: { id: true, firstName: true, lastName: true, email: true } },
          deal: { select: { id: true, title: true } },
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      prisma.activity.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async create(data: CreateActivity & { userId?: string }) {
    const activity = await prisma.activity.create({
      data: {
        ...(data as any),
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
      include: {
        contact: { select: { id: true, firstName: true, lastName: true } },
        deal: { select: { id: true, title: true } },
        user: { select: { id: true, name: true } },
      },
    });

    // Update deal's last_activity_at if linked
    if (data.dealId) {
      await prisma.deal.update({
        where: { id: data.dealId },
        data: { lastActivityAt: new Date(), stalledAt: null },
      });
    }

    return activity;
  }

  async update(id: string, data: UpdateActivity) {
    return prisma.activity.update({
      where: { id },
      data: {
        ...data,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      },
    });
  }

  async delete(id: string) {
    return prisma.activity.delete({ where: { id } });
  }
}

export const activityService = new ActivityService();
