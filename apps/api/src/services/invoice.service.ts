import { prisma } from '@antigravity/db';
import type { InvoiceFilter, CreateInvoice, UpdateInvoice } from '@antigravity/shared';
import type { Prisma } from '@prisma/client';

export class InvoiceService {
  async list(filter: InvoiceFilter) {
    const { page, limit, sortBy, sortOrder, search, companyId, salesOrderId, status } = filter;
    const skip = (page - 1) * limit;

    const where: Prisma.InvoiceWhereInput = {
      ...(companyId && { companyId }),
      ...(salesOrderId && { salesOrderId }),
      ...(status && { status }),
      ...(search && {
        invoiceNumber: { contains: search, mode: 'insensitive' as const },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          company: { select: { id: true, name: true } },
          salesOrder: { select: { id: true, orderNumber: true } }
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async getById(id: string) {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        company: true,
        salesOrder: true,
        lines: true,
        payments: true
      },
    });
  }

  private generateInvoiceNumber(): string {
    return `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  async create(data: CreateInvoice) {
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

    const totalAmount = subtotal + taxAmount;

    return prisma.invoice.create({
      data: {
        companyId: data.companyId,
        salesOrderId: data.salesOrderId,
        invoiceNumber: this.generateInvoiceNumber(),
        status: data.status,
        issueDate: new Date(data.issueDate),
        dueDate: new Date(data.dueDate),
        currency: data.currency,
        exchangeRate: data.exchangeRate,
        notes: data.notes,
        subtotal,
        taxAmount,
        totalAmount,
        balanceDue: totalAmount, // Initial balance equals total
        workspaceId: '',
        lines: {
          create: mappedLines
        }
      },
      include: {
        lines: true
      }
    });
  }

  async update(id: string, data: UpdateInvoice) {
    return prisma.invoice.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string) {
    return prisma.invoice.delete({ where: { id } });
  }

  async send(id: string) {
    // Mock email sending
    console.log(`Sending invoice ${id} to customer via email...`);
    
    return prisma.invoice.update({
      where: { id },
      data: {
        status: 'sent',
        updatedAt: new Date(),
      },
    });
  }

  async void(id: string) {
    return prisma.invoice.update({
      where: { id },
      data: {
        status: 'void',
        balanceDue: 0,
        updatedAt: new Date(),
      },
    });
  }
}

export const invoiceService = new InvoiceService();
