import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { withWorkspace } from '@antigravity/db';

/**
 * Wraps every request handler in AsyncLocalStorage workspace context.
 * Prisma middleware reads workspace_id from this context.
 */
const workspacePluginImpl: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (request, _reply) => {
    if (!request.workspaceId) return;

    // Store original handler
    const originalHandler = request.routeOptions?.handler;
    if (!originalHandler) return;
  });

  // Use onRoute to wrap all route handlers in workspace context
  fastify.addHook('onRoute', (routeOptions) => {
    const originalHandler = routeOptions.handler;

    routeOptions.handler = async function (request, reply) {
      if (!request.workspaceId) {
        return originalHandler.call(this, request, reply);
      }
      return withWorkspace(request.workspaceId, () =>
        originalHandler.call(this, request, reply)
      );
    };
  });
};

export const workspacePlugin = fp(workspacePluginImpl, {
  name: 'workspace',
  dependencies: ['auth'],
});
