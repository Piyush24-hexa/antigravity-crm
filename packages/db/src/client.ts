import { PrismaClient } from '@prisma/client';
import { AsyncLocalStorage } from 'node:async_hooks';

// AsyncLocalStorage for workspace context
export const workspaceContext = new AsyncLocalStorage<{ workspaceId: string }>();

// Singleton pattern for PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env['NODE_ENV'] === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Get the current workspace ID from AsyncLocalStorage context.
 * Throws if called outside a workspace context.
 */
export function getWorkspaceId(): string {
  const store = workspaceContext.getStore();
  if (!store?.workspaceId) {
    throw new Error('No workspace context — ensure request runs within workspaceContext.run()');
  }
  return store.workspaceId;
}

/**
 * Run a function within a workspace context.
 */
export function withWorkspace<T>(workspaceId: string, fn: () => T): T {
  return workspaceContext.run({ workspaceId }, fn);
}
