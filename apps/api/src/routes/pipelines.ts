import { FastifyPluginAsync } from 'fastify';
import { CreatePipelineSchema, UpdatePipelineSchema, UuidParamSchema } from '@antigravity/shared';
import { pipelineService } from '../services/pipeline.service';

export const pipelineRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (_request, reply) => {
    const pipelines = await pipelineService.list();
    return reply.send({ data: pipelines });
  });

  fastify.post('/', async (request, reply) => {
    const body = CreatePipelineSchema.parse(request.body);
    const pipeline = await pipelineService.create(body);
    return reply.status(201).send({ data: pipeline });
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    const pipeline = await pipelineService.getById(id);
    if (!pipeline) {
      return reply.status(404).send({
        type: 'https://antigravity.ai/errors/not-found',
        title: 'Pipeline not found',
        status: 404,
        detail: `No pipeline with id=${id}`,
        instance: request.url,
      });
    }
    return reply.send({ data: pipeline });
  });

  fastify.patch('/:id', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    const body = UpdatePipelineSchema.parse(request.body);
    const pipeline = await pipelineService.update(id, body);
    return reply.send({ data: pipeline });
  });

  fastify.delete('/:id', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    await pipelineService.delete(id);
    return reply.status(204).send();
  });

  // GET /pipelines/:id/stages
  fastify.get('/:id/stages', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    const stages = await pipelineService.getStages(id);
    return reply.send({ data: stages });
  });
};
