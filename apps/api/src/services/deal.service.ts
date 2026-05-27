import { prisma } from '@antigravity/db';
import type { DealFilter, CreateDeal, UpdateDeal } from '@antigravity/shared';
import type { Prisma } from '@prisma/client';

export class DealService {
  async list(filter: DealFilter) {
    const { page, limit, sortBy, sortOrder, search, stageId, pipelineId, ownerId, status, valueMin, valueMax, atRisk } = filter;
    const skip = (page - 1) * limit;

    const where: Prisma.DealWhereInput = {
      ...(stageId && { stageId }),
      ...(ownerId && { ownerId }),
      ...(status && { status }),
      ...(valueMin !== undefined && { value: { gte: valueMin } }),
      ...(valueMax !== undefined && { value: { lte: valueMax } }),
      ...(atRisk && { stalledAt: { not: null } }),
      ...(pipelineId && { stage: { pipelineId } }),
      ...(search && {
        title: { contains: search, mode: 'insensitive' as const },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          stage: { select: { id: true, name: true, color: true, pipelineId: true } },
          contact: { select: { id: true, firstName: true, lastName: true, email: true } },
          company: { select: { id: true, name: true } },
          owner: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      prisma.deal.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async getById(id: string) {
    return prisma.deal.findUnique({
      where: { id },
      include: {
        stage: true,
        contact: true,
        company: true,
        owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 30,
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        },
      },
    });
  }

  async create(data: CreateDeal) {
    return prisma.deal.create({
      data: {
        ...(data as any),
        closeDate: data.closeDate ? new Date(data.closeDate) : null,
      },
      include: {
        stage: { select: { name: true, color: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        company: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, data: UpdateDeal) {
    return prisma.deal.update({
      where: { id },
      data: {
        ...(data as any),
        closeDate: data.closeDate ? new Date(data.closeDate) : undefined,
        updatedAt: new Date(),
      },
    });
  }

  async moveStage(id: string, stageId: string) {
    const stage = await prisma.stage.findUnique({ where: { id: stageId } });
    if (!stage) throw new Error('Stage not found');

    const status = stage.winProbability === 1.0 ? 'won' : stage.winProbability === 0.0 && stage.displayOrder > 0 ? 'lost' : 'open';

    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: {
        stageId,
        winProbability: stage.winProbability,
        status,
        updatedAt: new Date(),
      },
      include: {
        stage: { select: { name: true, color: true } },
      },
    });

    if (status === 'won') {
      try {
        await prisma.salesOrder.create({
          data: {
            workspaceId: updatedDeal.workspaceId,
            dealId: updatedDeal.id,
            billingCompanyId: updatedDeal.companyId,
            orderNumber: `SO-${Date.now().toString().slice(-6)}`,
            status: 'draft',
            subtotal: updatedDeal.value || 0,
            taxAmount: 0,
            totalAmount: updatedDeal.value || 0,
            currency: updatedDeal.currency || 'USD',
          }
        });
      } catch (err) {
        console.error('Failed to auto-create Sales Order:', err);
      }
    }

    return updatedDeal;
  }

  async getTimeline(dealId: string) {
    return prisma.activity.findMany({
      where: { dealId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async delete(id: string) {
    return prisma.deal.delete({ where: { id } });
  }

  /** Pipeline summary for reports */
  async pipelineSummary(pipelineId?: string) {
    const pipeline = pipelineId
      ? await prisma.pipeline.findUnique({ where: { id: pipelineId }, include: { stages: { orderBy: { displayOrder: 'asc' } } } })
      : await prisma.pipeline.findFirst({ where: { isDefault: true }, include: { stages: { orderBy: { displayOrder: 'asc' } } } });

    if (!pipeline) return null;

    const stages = await Promise.all(
      pipeline.stages.map(async (stage) => {
        const deals = await prisma.deal.findMany({
          where: { stageId: stage.id, status: 'open' },
          select: { value: true },
        });
        const totalValue = deals.reduce((sum, d) => sum + Number(d.value ?? 0), 0);
        return {
          ...stage,
          dealCount: deals.length,
          totalValue,
        };
      })
    );

    return { pipeline, stages };
  }
}

export const dealService = new DealService();
