import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import { prisma, workspaceMiddleware } from '@antigravity/db';
import { authPlugin } from './plugins/auth';
import { workspacePlugin } from './plugins/workspace';
import { errorHandler } from './plugins/error-handler';
import { contactRoutes } from './routes/contacts';
import { companyRoutes } from './routes/companies';
import { dealRoutes } from './routes/deals';
import { pipelineRoutes } from './routes/pipelines';
import { activityRoutes } from './routes/activities';
import { salesOrdersRoutes } from './routes/sales-orders';
import { invoicesRoutes } from './routes/invoices';
import { paymentsRoutes } from './routes/payments';
import { workOrderRoutes } from './routes/work-orders';
import { reportRoutes } from './routes/reports';

const PORT = Number(process.env['API_PORT'] ?? 3001);
const HOST = process.env['API_HOST'] ?? '0.0.0.0';

async function bootstrap() {
  const app = Fastify({
    logger: {
      level: process.env['NODE_ENV'] === 'production' ? 'info' : 'debug',
      transport:
        process.env['NODE_ENV'] !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  });

  // ─── Register workspace middleware on Prisma ───
  prisma.$use(workspaceMiddleware());

  // ─── Global plugins ───
  await app.register(cors, {
    origin: process.env['CORS_ORIGIN'] ?? ['http://localhost:3000'],
    credentials: true,
  });

  await app.register(helmet, { global: true });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Antigravity CRM API',
        version: '0.1.0',
        description: 'AI-native CRM API',
      },
      servers: [{ url: `http://localhost:${PORT}` }],
    },
  });

  // ─── Custom plugins ───
  await app.register(authPlugin);
  await app.register(workspacePlugin);

  // ─── Error handler ───
  app.setErrorHandler(errorHandler);

  // ─── Health check ───
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // ─── Routes ───
  await app.register(contactRoutes, { prefix: '/contacts' });
  await app.register(companyRoutes, { prefix: '/companies' });
  await app.register(dealRoutes, { prefix: '/deals' });
  await app.register(pipelineRoutes, { prefix: '/pipelines' });
  await app.register(activityRoutes, { prefix: '/activities' });
  await app.register(salesOrdersRoutes, { prefix: '/sales-orders' });
  await app.register(invoicesRoutes, { prefix: '/invoices' });
  await app.register(paymentsRoutes, { prefix: '/payments' });
  await app.register(workOrderRoutes, { prefix: '/work-orders' });
  await app.register(reportRoutes, { prefix: '/reports' });

  // ─── Swagger docs ───
  await app.ready();

  // ─── Start ───
  await app.listen({ port: PORT, host: HOST });
  console.log(`\n🚀 Antigravity API running at http://localhost:${PORT}`);
  console.log(`📚 Docs at http://localhost:${PORT}/docs\n`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start API:', err);
  process.exit(1);
});
