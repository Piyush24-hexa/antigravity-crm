import { FastifyPluginAsync } from 'fastify';
import { invoiceService } from '../services/invoice.service';
import {
  CreateInvoiceSchema,
  UpdateInvoiceSchema,
  InvoiceFilterSchema,
} from '@antigravity/shared';
import { z } from 'zod';

export const invoicesRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (request, reply) => {
    const filter = InvoiceFilterSchema.parse(request.query);
    const result = await invoiceService.list(filter);
    return reply.send(result);
  });

  app.get('/:id', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const inv = await invoiceService.getById(id);
    if (!inv) return reply.status(404).send({ detail: 'Invoice not found' });
    return reply.send({ data: inv });
  });

  app.post('/', async (request, reply) => {
    const body = CreateInvoiceSchema.parse(request.body);
    const inv = await invoiceService.create(body);
    return reply.code(201).send({ data: inv });
  });

  app.patch('/:id', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const body = UpdateInvoiceSchema.parse(request.body);
    const inv = await invoiceService.update(id, body);
    return reply.send({ data: inv });
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    await invoiceService.delete(id);
    return reply.code(204).send();
  });

  app.post('/:id/send', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const inv = await invoiceService.send(id);
    return reply.send({ data: inv });
  });

  app.patch('/:id/void', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const inv = await invoiceService.void(id);
    return reply.send({ data: inv });
  });
};
