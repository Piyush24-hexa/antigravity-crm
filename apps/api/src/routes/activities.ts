import { FastifyPluginAsync } from 'fastify';
import { ActivityFilterSchema, CreateActivitySchema, UpdateActivitySchema, UuidParamSchema } from '@antigravity/shared';
import { activityService } from '../services/activity.service';

export const activityRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    const start = Date.now();
    const filter = ActivityFilterSchema.parse(request.query);
    const result = await activityService.list(filter);
    return reply.send({
      data: result.data,
      meta: { page: result.page, limit: result.limit, total: result.total, took_ms: Date.now() - start },
    });
  });

  fastify.post('/', async (request, reply) => {
    const body = CreateActivitySchema.parse(request.body);
    const activity = await activityService.create({ ...body, userId: request.userId || undefined });
    return reply.status(201).send({ data: activity });
  });

  fastify.patch('/:id', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    const body = UpdateActivitySchema.parse(request.body);
    const activity = await activityService.update(id, body);
    return reply.send({ data: activity });
  });

  fastify.delete('/:id', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    await activityService.delete(id);
    return reply.status(204).send();
  });
};
