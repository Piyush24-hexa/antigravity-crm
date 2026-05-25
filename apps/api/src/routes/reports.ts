import { FastifyPluginAsync } from 'fastify';
import { dealService } from '../services/deal.service';
import { prisma } from '@antigravity/db';

export const reportRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /reports/pipeline — deals by stage with values
  fastify.get('/pipeline', async (request, reply) => {
    const pipelineId = (request.query as Record<string, string>)['pipelineId'];
    const summary = await dealService.pipelineSummary(pipelineId);
    return reply.send({ data: summary });
  });

  // GET /reports/revenue — won deals over time
  fastify.get('/revenue', async (_request, reply) => {
    const deals = await prisma.deal.findMany({
      where: { status: 'won' },
      select: { value: true, closeDate: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by month
    const monthly = new Map<string, number>();
    for (const deal of deals) {
      const date = deal.closeDate ?? deal.createdAt;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthly.set(key, (monthly.get(key) ?? 0) + Number(deal.value ?? 0));
    }

    const data = Array.from(monthly.entries()).map(([month, revenue]) => ({ month, revenue }));
    return reply.send({ data });
  });

  // GET /reports/leaderboard — reps by deals closed
  fastify.get('/leaderboard', async (_request, reply) => {
    const deals = await prisma.deal.findMany({
      where: { status: 'won', ownerId: { not: null } },
      select: {
        value: true,
        owner: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    const leaderboard = new Map<string, { name: string; avatarUrl: string | null; deals: number; revenue: number }>();
    for (const deal of deals) {
      if (!deal.owner) continue;
      const existing = leaderboard.get(deal.owner.id) ?? {
        name: deal.owner.name ?? 'Unknown',
        avatarUrl: deal.owner.avatarUrl,
        deals: 0,
        revenue: 0,
      };
      existing.deals++;
      existing.revenue += Number(deal.value ?? 0);
      leaderboard.set(deal.owner.id, existing);
    }

    const data = Array.from(leaderboard.entries())
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.revenue - a.revenue);

    return reply.send({ data });
  });

  // GET /reports/activities — activity breakdown by type
  fastify.get('/activities', async (_request, reply) => {
    const activities = await prisma.activity.groupBy({
      by: ['type'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const data = activities.map((a) => ({ type: a.type, count: a._count.id }));
    return reply.send({ data });
  });
};
