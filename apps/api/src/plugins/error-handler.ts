import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import type { ApiError } from '@antigravity/shared';

/**
 * Global error handler — RFC 7807 problem details.
 */
export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { log } = request;

  // Zod validation errors
  if (error instanceof ZodError) {
    const detail = error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');

    const body: ApiError = {
      type: 'https://antigravity.ai/errors/validation',
      title: 'Validation Error',
      status: 400,
      detail,
      instance: request.url,
    };

    return reply.status(400).send(body);
  }

  // Known Fastify errors (rate limit, not found, etc.)
  if (error.statusCode) {
    const body: ApiError = {
      type: `https://antigravity.ai/errors/${error.code?.toLowerCase() ?? 'error'}`,
      title: error.message,
      status: error.statusCode,
      detail: error.message,
      instance: request.url,
    };

    return reply.status(error.statusCode).send(body);
  }

  // Unknown errors — log full error, return generic 500
  log.error(error, 'Unhandled error');

  const body: ApiError = {
    type: 'https://antigravity.ai/errors/internal',
    title: 'Internal Server Error',
    status: 500,
    detail: 'An unexpected error occurred',
    instance: request.url,
  };

  return reply.status(500).send(body);
}
