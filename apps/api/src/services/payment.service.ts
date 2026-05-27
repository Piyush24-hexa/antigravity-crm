import { prisma } from '@antigravity/db';
import type { PaymentFilter, CreatePayment, UpdatePayment } from '@antigravity/shared';
import type { Prisma } from '@prisma/client';

export class PaymentService {
  async list(filter: PaymentFilter) {
    const { page, limit, sortBy, sortOrder, invoiceId, status, method } = filter;
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentWhereInput = {
      ...(invoiceId && { invoiceId }),
      ...(status && { status }),
      ...(method && { method }),
    };

    const [data, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          invoice: { select: { id: true, invoiceNumber: true, totalAmount: true, balanceDue: true } },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async getById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: true,
      },
    });
  }

  async create(data: CreatePayment) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUniqueOrThrow({
        where: { id: data.invoiceId }
      });

      const payment = await tx.payment.create({
        data: {
          workspaceId: '', // overridden by middleware
          invoiceId: data.invoiceId,
          amount: data.amount,
          method: data.method,
          referenceNumber: data.referenceNumber,
          status: data.status,
          paidAt: new Date(data.paidAt),
          notes: data.notes
        }
      });

      // If the payment is cleared, update the invoice balance
      if (payment.status === 'cleared') {
        const newAmountPaid = Number(invoice.amountPaid) + data.amount;
        const newBalanceDue = Number(invoice.totalAmount) - newAmountPaid;
        
        let newStatus = invoice.status;
        if (newBalanceDue <= 0) {
          newStatus = 'paid';
        } else if (newAmountPaid > 0) {
          newStatus = 'partial';
        }

        await tx.invoice.update({
          where: { id: invoice.id },
          data: {
            amountPaid: newAmountPaid,
            balanceDue: newBalanceDue,
            status: newStatus,
            paidAt: newBalanceDue <= 0 ? new Date() : null,
          }
        });
      }

      return payment;
    });
  }

  async update(id: string, data: UpdatePayment) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.payment.findUniqueOrThrow({
        where: { id },
        include: { invoice: true }
      });

      const updated = await tx.payment.update({
        where: { id },
        data: {
          status: data.status,
          notes: data.notes,
        },
      });

      // Handle status transitions (e.g. pending -> cleared, or cleared -> bounced)
      if (existing.status !== updated.status) {
        let amountChange = 0;
        if (existing.status !== 'cleared' && updated.status === 'cleared') {
          amountChange = Number(existing.amount);
        } else if (existing.status === 'cleared' && updated.status !== 'cleared') {
          amountChange = -Number(existing.amount);
        }

        if (amountChange !== 0) {
          const newAmountPaid = Number(existing.invoice.amountPaid) + amountChange;
          const newBalanceDue = Number(existing.invoice.totalAmount) - newAmountPaid;
          
          let newStatus = existing.invoice.status;
          if (newBalanceDue <= 0) {
            newStatus = 'paid';
          } else if (newAmountPaid > 0) {
            newStatus = 'partial';
          } else {
            newStatus = 'draft'; // Or whatever logic fits when it goes back to 0
          }

          await tx.invoice.update({
            where: { id: existing.invoiceId },
            data: {
              amountPaid: newAmountPaid,
              balanceDue: newBalanceDue,
              status: newStatus,
              paidAt: newBalanceDue <= 0 ? new Date() : null,
            }
          });
        }
      }

      return updated;
    });
  }

  async delete(id: string) {
    return prisma.payment.delete({ where: { id } });
  }
}

export const paymentService = new PaymentService();
