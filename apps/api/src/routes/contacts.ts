import { FastifyPluginAsync } from 'fastify';
import { ContactFilterSchema, CreateContactSchema, UpdateContactSchema, UuidParamSchema } from '@antigravity/shared';
import { contactService } from '../services/contact.service';

export const contactRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /contacts
  fastify.get('/', async (request, reply) => {
    const start = Date.now();
    const filter = ContactFilterSchema.parse(request.query);
    const result = await contactService.list(filter);
    return reply.send({
      data: result.data,
      meta: { page: result.page, limit: result.limit, total: result.total, took_ms: Date.now() - start },
    });
  });

  // POST /contacts
  fastify.post('/', async (request, reply) => {
    const body = CreateContactSchema.parse(request.body);
    const contact = await contactService.create(body);
    return reply.status(201).send({ data: contact });
  });

  // GET /contacts/:id
  fastify.get('/:id', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    const contact = await contactService.getById(id);
    if (!contact) {
      return reply.status(404).send({
        type: 'https://antigravity.ai/errors/not-found',
        title: 'Contact not found',
        status: 404,
        detail: `No contact with id=${id}`,
        instance: request.url,
      });
    }
    return reply.send({ data: contact });
  });

  // PATCH /contacts/:id
  fastify.patch('/:id', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    const body = UpdateContactSchema.parse(request.body);
    const contact = await contactService.update(id, body);
    return reply.send({ data: contact });
  });

  // DELETE /contacts/:id (soft delete)
  fastify.delete('/:id', async (request, reply) => {
    const { id } = UuidParamSchema.parse(request.params);
    await contactService.softDelete(id);
    return reply.status(204).send();
  });
};
