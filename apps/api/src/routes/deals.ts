import { FastifyPluginAsync } from 'fastify';
import { DealFilterSchema, CreateDealSchema, UpdateDealSchema, MoveStageSchema, UuidParamSchema } from '@antigravity/shared';
import { dealService } from '../services/deal.service';

export const dealRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    const start = Date.now();
    const filter = DealFilterSchema.parse(request.query);
    const result = await dealService.list(filter);
    return reply.send({
      data: result.data,
      meta: { page: result.page, limit: result.limit, total: result.total, took_ms: Date.now() - start },
    });
  });

  fastify.post('/', async (request, reply) => {
    const body = CreateDealSchema.parse(request.body);
    const deal = await dealService.create(body);
    return reply.status(201).send({ data: deal });
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    const deal = await dealService.getById(id);
    if (!deal) {
      return reply.status(404).send({
        type: 'https://antigravity.ai/errors/not-found',
        title: 'Deal not found',
        status: 404,
        detail: `No deal with id=${id}`,
        instance: request.url,
      });
    }
    return reply.send({ data: deal });
  });

  fastify.patch('/:id', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    const body = UpdateDealSchema.parse(request.body);
    const deal = await dealService.update(id, body);
    return reply.send({ data: deal });
  });

  // PATCH /deals/:id/stage — move deal to new stage
  fastify.patch('/:id/stage', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    const { stageId } = MoveStageSchema.parse(request.body);
    const deal = await dealService.moveStage(id, stageId);
    return reply.send({ data: deal });
  });

  // GET /deals/:id/timeline
  fastify.get('/:id/timeline', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    const timeline = await dealService.getTimeline(id);
    return reply.send({ data: timeline });
  });

  fastify.delete('/:id', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    await dealService.delete(id);
    return reply.status(204).send();
  });
};
