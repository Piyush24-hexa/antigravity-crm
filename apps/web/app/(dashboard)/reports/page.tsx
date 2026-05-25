'use client';

import { BarChart3, TrendingUp, Users, Trophy, Activity } from 'lucide-react';
import { RoleGuard } from '../../../components/RoleGuard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';
import { demoRevenueData, demoLeaderboard, demoPipelineStages } from '../../../lib/demo-data';
import { formatCurrency, getInitials } from '../../../lib/utils';

const stageChartData = demoPipelineStages.slice(0, 4).map((s) => ({
  name: s.name,
  value: s.deals.reduce((sum, d) => sum + d.value, 0),
  count: s.deals.length,
  color: s.color,
}));

const activityData = [
  { type: 'Emails', count: 156, color: '#6366f1' },
  { type: 'Calls', count: 89, color: '#8b5cf6' },
  { type: 'Meetings', count: 42, color: '#a855f7' },
  { type: 'Notes', count: 67, color: '#d946ef' },
  { type: 'Tasks', count: 34, color: '#06b6d4' },
];

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#06b6d4'];

export default function ReportsPage() {
  const totalPipeline = stageChartData.reduce((s, d) => s + d.value, 0);
  const totalWon = demoPipelineStages
    .find((s) => s.name === 'Closed Won')
    ?.deals.reduce((s, d) => s + d.value, 0) ?? 0;

  return (
    <RoleGuard allowedRoles={['admin', 'manager']}>
      <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Reports</h1>
        <p className="text-sm text-surface-500 mt-1">Analytics and insights for your sales performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center">
              <TrendingUp size={16} className="text-brand-400" />
            </div>
            <span className="stat-label">Pipeline Value</span>
          </div>
          <span className="stat-value">{formatCurrency(totalPipeline)}</span>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-accent-green/15 flex items-center justify-center">
              <Trophy size={16} className="text-accent-green" />
            </div>
            <span className="stat-label">Won Revenue</span>
          </div>
          <span className="stat-value text-accent-green">{formatCurrency(totalWon)}</span>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-accent-amber/15 flex items-center justify-center">
              <Users size={16} className="text-accent-amber" />
            </div>
            <span className="stat-label">Active Deals</span>
          </div>
          <span className="stat-value">{stageChartData.reduce((s, d) => s + d.count, 0)}</span>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/15 flex items-center justify-center">
              <Activity size={16} className="text-accent-cyan" />
            </div>
            <span className="stat-label">Win Rate</span>
          </div>
          <span className="stat-value gradient-text">68%</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-surface-800 mb-4">Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={demoRevenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272f" />
              <XAxis dataKey="month" tick={{ fill: '#71717f', fontSize: 12 }} axisLine={{ stroke: '#27272f' }} />
              <YAxis tick={{ fill: '#71717f', fontSize: 12 }} axisLine={{ stroke: '#27272f' }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181c', border: '1px solid #27272f', borderRadius: '12px', color: '#d4d4de' }}
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#7c5cfc" strokeWidth={2.5} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline by Stage */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-surface-800 mb-4">Pipeline by Stage</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stageChartData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272f" />
              <XAxis dataKey="name" tick={{ fill: '#71717f', fontSize: 12 }} axisLine={{ stroke: '#27272f' }} />
              <YAxis tick={{ fill: '#71717f', fontSize: 12 }} axisLine={{ stroke: '#27272f' }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181c', border: '1px solid #27272f', borderRadius: '12px', color: '#d4d4de' }}
                formatter={(value: number) => [formatCurrency(value), 'Value']}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {stageChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-surface-800 mb-4">Sales Leaderboard</h3>
          <div className="space-y-3">
            {demoLeaderboard.map((rep, i) => (
              <div key={rep.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-200/50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-accent-amber/20 text-accent-amber' :
                  i === 1 ? 'bg-surface-400/20 text-surface-500' :
                  'bg-amber-800/20 text-amber-600'
                }`}>
                  {i + 1}
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400/30 to-accent-purple/30 flex items-center justify-center text-xs font-semibold text-brand-400 border border-surface-300">
                  {getInitials(rep.name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-surface-800">{rep.name}</p>
                  <p className="text-xs text-surface-500">{rep.deals} deals closed</p>
                </div>
                <span className="text-sm font-bold text-surface-900">{formatCurrency(rep.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Breakdown */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-surface-800 mb-4">Activity Breakdown</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={activityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {activityData.map((entry, index) => (
                    <Cell key={index} fill={CHART_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181c', border: '1px solid #27272f', borderRadius: '12px', color: '#d4d4de' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {activityData.map((item, i) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }}></div>
                    <span className="text-sm text-surface-600">{item.type}</span>
                  </div>
                  <span className="text-sm font-semibold text-surface-800">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </RoleGuard>
  );
}
