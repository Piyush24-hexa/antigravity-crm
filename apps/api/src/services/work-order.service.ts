import { prisma } from '@antigravity/db';
import type { WorkOrderFilter, CreateWorkOrder, UpdateWorkOrderProgress, CreateWorkOrderLog } from '@antigravity/shared';
import type { Prisma } from '@prisma/client';

export class WorkOrderService {
  async list(filter: WorkOrderFilter) {
    const { page, limit, status, salesOrderId, search } = filter;
    const skip = (page - 1) * limit;

    const where: Prisma.WorkOrderWhereInput = {
      ...(status && { status }),
      ...(salesOrderId && { salesOrderId }),
      ...(search && {
        woNumber: { contains: search, mode: 'insensitive' as const },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.workOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { id: true, name: true, sku: true } },
          salesOrder: { select: { id: true, orderNumber: true } },
        },
      }),
      prisma.workOrder.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async getById(id: string) {
    return prisma.workOrder.findUnique({
      where: { id },
      include: {
        product: true,
        salesOrder: true,
        logs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  private generateWoNumber(): string {
    return `WO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  async create(data: CreateWorkOrder) {
    return prisma.workOrder.create({
      data: {
        woNumber: this.generateWoNumber(),
        salesOrderId: data.salesOrderId,
        productId: data.productId,
        plannedQty: data.plannedQty,
        plannedStart: data.plannedStart ? new Date(data.plannedStart) : undefined,
        plannedEnd: data.plannedEnd ? new Date(data.plannedEnd) : undefined,
        workspaceId: '', // overridden by middleware
      },
    });
  }

  async updateProgress(id: string, data: UpdateWorkOrderProgress) {
    const wo = await prisma.workOrder.findUnique({ where: { id } });
    if (!wo) throw new Error('WorkOrder not found');

    const updated = await prisma.workOrder.update({
      where: { id },
      data: {
        status: data.status ?? undefined,
        completedQty: data.completedQty ?? undefined,
        rejectedQty: data.rejectedQty ?? undefined,
        actualStart: data.actualStart ? new Date(data.actualStart) : undefined,
        actualEnd: data.actualEnd ? new Date(data.actualEnd) : undefined,
        updatedAt: new Date(),
      },
    });

    // Auto-log status changes
    if (data.status && data.status !== wo.status) {
      await prisma.workOrderLog.create({
        data: {
          workOrderId: id,
          type: 'status_change',
          notes: `Status changed from ${wo.status} to ${data.status}`,
          workspaceId: '',
        }
      });
    }

    return updated;
  }

  async addLog(id: string, data: CreateWorkOrderLog) {
    return prisma.workOrderLog.create({
      data: {
        workOrderId: id,
        type: data.type,
        notes: data.notes,
        workspaceId: '',
      },
    });
  }
}

export const workOrderService = new WorkOrderService();
