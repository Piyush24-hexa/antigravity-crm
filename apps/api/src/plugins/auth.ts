import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    workspaceId: string;
    userId: string;
    userRole: string;
  }
}

/**
 * Mock auth plugin for Phase 1.
 * Extracts workspace/user from headers. Replace with Clerk in Phase 3.
 *
 * Headers:
 *   x-workspace-id: UUID
 *   x-user-id: UUID
 *   x-user-role: owner|admin|member|viewer
 */
const authPluginImpl: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('workspaceId', '');
  fastify.decorateRequest('userId', '');
  fastify.decorateRequest('userRole', 'member');

  fastify.addHook('onRequest', async (request: FastifyRequest, reply) => {
    // Skip auth for health check and docs
    if (request.url === '/health' || request.url.startsWith('/docs')) {
      return;
    }

    const workspaceId = request.headers['x-workspace-id'] as string | undefined;
    const userId = request.headers['x-user-id'] as string | undefined;
    const userRole = (request.headers['x-user-role'] as string) ?? 'member';

    if (!workspaceId) {
      return reply.status(401).send({
        type: 'https://antigravity.ai/errors/unauthorized',
        title: 'Missing workspace context',
        status: 401,
        detail: 'x-workspace-id header is required',
        instance: request.url,
      });
    }

    request.workspaceId = workspaceId;
    request.userId = userId ?? '';
    request.userRole = userRole;
  });
};

export const authPlugin = fp(authPluginImpl, {
  name: 'auth',
});
