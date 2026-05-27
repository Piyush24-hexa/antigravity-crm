import { FastifyPluginAsync } from 'fastify';
import { paymentService } from '../services/payment.service';
import {
  CreatePaymentSchema,
  UpdatePaymentSchema,
  PaymentFilterSchema,
} from '@antigravity/shared';
import { z } from 'zod';

export const paymentsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (request, reply) => {
    const filter = PaymentFilterSchema.parse(request.query);
    const result = await paymentService.list(filter);
    return reply.send(result);
  });

  app.get('/:id', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const pay = await paymentService.getById(id);
    if (!pay) return reply.status(404).send({ detail: 'Payment not found' });
    return reply.send({ data: pay });
  });

  app.post('/', async (request, reply) => {
    const body = CreatePaymentSchema.parse(request.body);
    const pay = await paymentService.create(body);
    return reply.code(201).send({ data: pay });
  });

  app.patch('/:id', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const body = UpdatePaymentSchema.parse(request.body);
    const pay = await paymentService.update(id, body);
    return reply.send({ data: pay });
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    await paymentService.delete(id);
    return reply.code(204).send();
  });
};
