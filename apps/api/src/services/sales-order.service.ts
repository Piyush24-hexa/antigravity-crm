import { prisma } from '@antigravity/db';
import type { SalesOrderFilter, CreateSalesOrder, UpdateSalesOrder } from '@antigravity/shared';
import type { Prisma } from '@prisma/client';

export class SalesOrderService {
  async list(filter: SalesOrderFilter) {
    const { page, limit, sortBy, sortOrder, search, dealId, status } = filter;
    const skip = (page - 1) * limit;

    const where: Prisma.SalesOrderWhereInput = {
      ...(dealId && { dealId }),
      ...(status && { status }),
      ...(search && {
        orderNumber: { contains: search, mode: 'insensitive' as const },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.salesOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          deal: { select: { id: true, title: true, value: true, currency: true } },
          invoices: { select: { id: true, invoiceNumber: true, status: true, totalAmount: true } }
        },
      }),
      prisma.salesOrder.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async getById(id: string) {
    return prisma.salesOrder.findUnique({
      where: { id },
      include: {
        deal: {
          include: {
            company: true,
            contact: true
          }
        },
        lines: true,
        invoices: true
      },
    });
  }

  private generateOrderNumber(): string {
    return `SO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  async create(data: CreateSalesOrder) {
    // Calculate totals
    const lines = data.lines ?? [];
    let subtotal = 0;
    let taxAmount = 0;

    const mappedLines = lines.map(line => {
      const discountAmount = line.unitPrice * (line.discount / 100);
      const priceAfterDiscount = line.unitPrice - discountAmount;
      const lineTax = priceAfterDiscount * (line.taxRate / 100) * line.quantity;
      const lineTotal = (priceAfterDiscount * line.quantity) + lineTax;
      
      subtotal += priceAfterDiscount * line.quantity;
      taxAmount += lineTax;

      return {
        ...line,
        workspaceId: '', // overridden by middleware
        lineTotal
      };
    });

    return prisma.salesOrder.create({
      data: {
        workspaceId: '', // overridden by middleware
        dealId: data.dealId,
        quoteId: data.quoteId,
        billingCompanyId: data.billingCompanyId,
        shippingCompanyId: data.shippingCompanyId,
        orderNumber: this.generateOrderNumber(),
        status: data.status,
        currency: data.currency,
        notes: data.notes,
        subtotal,
        taxAmount,
        totalAmount: subtotal + taxAmount,
        lines: {
          create: mappedLines
        }
      },
      include: {
        lines: true
      }
    });
  }

  async update(id: string, data: UpdateSalesOrder) {
    // Only handling top-level status/notes updates for now
    return prisma.salesOrder.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string) {
    return prisma.salesOrder.delete({ where: { id } });
  }

  async generateInvoice(id: string) {
    const so = await this.getById(id);
    if (!so) throw new Error('Sales order not found');

    const invoiceLines = so.lines.map(line => ({
      workspaceId: so.workspaceId,
      productId: line.productId,
      description: `Item from SO ${so.orderNumber}`,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      discount: line.discount,
      taxRate: line.taxRate,
      lineTotal: line.lineTotal
    }));

    const invoice = await prisma.invoice.create({
      data: {
        workspaceId: so.workspaceId,
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        salesOrderId: so.id,
        companyId: so.billingCompanyId || '',
        status: 'draft',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Net 30 default
        subtotal: so.subtotal,
        taxAmount: so.taxAmount,
        totalAmount: so.totalAmount,
        balanceDue: so.totalAmount,
        amountPaid: 0,
        currency: so.currency,
        notes: `Auto-generated from Sales Order ${so.orderNumber}`,
        lines: {
          create: invoiceLines
        }
      },
      include: {
        lines: true
      }
    });
    
    // Update SO status to invoiced
    await prisma.salesOrder.update({
      where: { id },
      data: { status: 'invoiced' }
    });

    return invoice;
  }
}

export const salesOrderService = new SalesOrderService();
