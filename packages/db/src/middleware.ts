import { Prisma } from '@prisma/client';
import { getWorkspaceId } from './client';

/**
 * Workspace-scoped models — all queries auto-filtered by workspace_id.
 */
const WORKSPACE_MODELS = new Set<Prisma.ModelName>([
  'Contact',
  'Company',
  'Deal',
  'Activity',
  'Email',
  'Automation',
  'Sequence',
  'AiUsage',
  'Integration',
  'Forecast',
  'Pipeline',
  'Stage',
  'FailedJob',
  'Product',
  'PriceBook',
  'PriceBookEntry',
  'Quote',
  'QuoteLineItem',
  'DealContact',
  'Campaign',
  'CampaignMember',
  'AuditLog',
  'DealStageHistory',
  'Quota',
]);

type MiddlewareParams = Prisma.MiddlewareParams;

/**
 * Prisma middleware that auto-injects workspace_id into all
 * queries on workspace-scoped models. Defense-in-depth layer
 * alongside PostgreSQL RLS.
 */
export function workspaceMiddleware(): Prisma.Middleware {
  return async (params: MiddlewareParams, next: (params: MiddlewareParams) => Promise<unknown>) => {
    if (!params.model || !WORKSPACE_MODELS.has(params.model as Prisma.ModelName)) {
      return next(params);
    }

    let workspaceId: string;
    try {
      workspaceId = getWorkspaceId();
    } catch {
      // No workspace context — skip injection (e.g., internal/system queries)
      return next(params);
    }

    const readActions = ['findMany', 'findFirst', 'findUnique', 'count', 'aggregate', 'groupBy'];
    const writeActions = ['update', 'updateMany', 'delete', 'deleteMany', 'upsert'];

    if (readActions.includes(params.action)) {
      params.args = params.args ?? {};
      params.args.where = { ...params.args.where, workspaceId };
    }

    if (params.action === 'create') {
      params.args = params.args ?? {};
      params.args.data = { ...params.args.data, workspaceId };
    }

    if (params.action === 'createMany') {
      params.args = params.args ?? {};
      if (Array.isArray(params.args.data)) {
        params.args.data = params.args.data.map((d: Record<string, unknown>) => ({
          ...d,
          workspaceId,
        }));
      } else {
        params.args.data = { ...params.args.data, workspaceId };
      }
    }

    if (writeActions.includes(params.action)) {
      params.args = params.args ?? {};
      params.args.where = { ...params.args.where, workspaceId };
    }

    return next(params);
  };
}
