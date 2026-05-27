import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { workOrderService } from '../services/work-order.service';
import {
  workOrderFilterSchema,
  createWorkOrderSchema,
  updateWorkOrderProgressSchema,
  createWorkOrderLogSchema
} from '@antigravity/shared';

export const workOrderRoutes = async (app: FastifyInstance) => {
  app.get('/', async (request, reply) => {
    const filter = workOrderFilterSchema.parse(request.query);
    const result = await workOrderService.list(filter);
    return reply.send(result);
  });

  app.get('/:id', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const wo = await workOrderService.getById(id);
    if (!wo) return reply.code(404).send({ message: 'WorkOrder not found' });
    return reply.send({ data: wo });
  });

  app.post('/', async (request, reply) => {
    const data = createWorkOrderSchema.parse(request.body);
    const wo = await workOrderService.create(data);
    return reply.code(201).send({ data: wo });
  });

  app.patch('/:id/progress', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const data = updateWorkOrderProgressSchema.parse(request.body);
    const wo = await workOrderService.updateProgress(id, data);
    return reply.send({ data: wo });
  });

  app.post('/:id/logs', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const data = createWorkOrderLogSchema.parse(request.body);
    const log = await workOrderService.addLog(id, data);
    return reply.code(201).send({ data: log });
  });
};
