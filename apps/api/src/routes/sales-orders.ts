import { FastifyPluginAsync } from 'fastify';
import { salesOrderService } from '../services/sales-order.service';
import {
  CreateSalesOrderSchema,
  UpdateSalesOrderSchema,
  SalesOrderFilterSchema,
} from '@antigravity/shared';
import { z } from 'zod';

export const salesOrdersRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (request, reply) => {
    const filter = SalesOrderFilterSchema.parse(request.query);
    const result = await salesOrderService.list(filter);
    return reply.send(result);
  });

  app.get('/:id', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const so = await salesOrderService.getById(id);
    if (!so) return reply.status(404).send({ detail: 'Sales order not found' });
    return reply.send({ data: so });
  });

  app.post('/', async (request, reply) => {
    const body = CreateSalesOrderSchema.parse(request.body);
    const so = await salesOrderService.create(body);
    return reply.code(201).send({ data: so });
  });

  app.patch('/:id', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const body = UpdateSalesOrderSchema.parse(request.body);
    const so = await salesOrderService.update(id, body);
    return reply.send({ data: so });
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    await salesOrderService.delete(id);
    return reply.code(204).send();
  });

  app.post('/:id/invoice', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const invoice = await salesOrderService.generateInvoice(id);
    return reply.code(201).send({ data: invoice });
  });
};
