import { FastifyPluginAsync } from 'fastify';
import { CompanyFilterSchema, CreateCompanySchema, UpdateCompanySchema, UuidParamSchema } from '@antigravity/shared';
import { companyService } from '../services/company.service';

export const companyRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    const start = Date.now();
    const filter = CompanyFilterSchema.parse(request.query);
    const result = await companyService.list(filter);
    return reply.send({
      data: result.data,
      meta: { page: result.page, limit: result.limit, total: result.total, took_ms: Date.now() - start },
    });
  });

  fastify.post('/', async (request, reply) => {
    const body = CreateCompanySchema.parse(request.body);
    const company = await companyService.create(body);
    return reply.status(201).send({ data: company });
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    const company = await companyService.getById(id);
    if (!company) {
      return reply.status(404).send({
        type: 'https://antigravity.ai/errors/not-found',
        title: 'Company not found',
        status: 404,
        detail: `No company with id=${id}`,
        instance: request.url,
      });
    }
    return reply.send({ data: company });
  });

  fastify.patch('/:id', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    const body = UpdateCompanySchema.parse(request.body);
    const company = await companyService.update(id, body);
    return reply.send({ data: company });
  });

  fastify.delete('/:id', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    await companyService.delete(id);
    return reply.status(204).send();
  });
};
