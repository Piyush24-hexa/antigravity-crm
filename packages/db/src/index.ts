export { prisma, getWorkspaceId, withWorkspace, workspaceContext } from './client';
export { workspaceMiddleware } from './middleware';
export type { Prisma } from '@prisma/client';
export {
  PrismaClient,
  type Workspace,
  type User,
  type Contact,
  type Company,
  type Pipeline,
  type Stage,
  type Deal,
  type Activity,
  type Email,
  type Sequence,
  type SequenceStep,
  type Automation,
  type Forecast,
  type AiUsage,
  type Integration,
  type FailedJob,
} from '@prisma/client';
