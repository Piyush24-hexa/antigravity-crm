import { prisma } from '@antigravity/db';

export class PipelineService {
  async list() {
    return prisma.pipeline.findMany({
      include: {
        stages: { orderBy: { displayOrder: 'asc' } },
        _count: { select: { stages: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getById(id: string) {
    return prisma.pipeline.findUnique({
      where: { id },
      include: {
        stages: {
          orderBy: { displayOrder: 'asc' },
          include: {
            deals: {
              where: { status: 'open' },
              include: {
                contact: { select: { id: true, firstName: true, lastName: true } },
                company: { select: { id: true, name: true } },
                owner: { select: { id: true, name: true, avatarUrl: true } },
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });
  }

  async create(data: { name: string; isDefault?: boolean }) {
    return prisma.pipeline.create({ data: data as any });
  }

  async update(id: string, data: { name?: string; isDefault?: boolean }) {
    return prisma.pipeline.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.pipeline.delete({ where: { id } });
  }

  async getStages(pipelineId: string) {
    return prisma.stage.findMany({
      where: { pipelineId },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: { select: { deals: true } },
      },
    });
  }
}

export const pipelineService = new PipelineService();
