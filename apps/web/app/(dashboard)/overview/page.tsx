'use client';

import { useAppStore } from '../../../lib/store';
import { demoDeals, demoDailyReports, demoLeaderboard } from '../../../lib/demo-data';
import {
  Target, Users, TrendingUp, CheckCircle2, Clock,
  ArrowUpRight, ArrowDownRight, ChevronRight,
  Briefcase, Activity, BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '../../../lib/utils';

const STATUS_DOT: Record<string, string> = {
  open: '#0ab5a0',
  won: '#16a34a',
  lost: '#dc2626',
};

export default function OverviewPage() {
  const { role } = useAppStore();

  const activeDeals = demoDeals.filter(d => d.status === 'open');
  const pipelineValue = activeDeals.reduce((acc, deal) => acc + deal.value, 0);

  const stats = [
    {
      label: 'Active Pipeline',
      value: formatCurrency(pipelineValue),
      icon: Target,
      delta: '+12.4%',
      up: true,
      color: '#0ab5a0',
      bg: '#ecfdf5',
    },
    {
      label: 'Win Rate',
      value: '64%',
      icon: CheckCircle2,
      delta: '+3.2%',
      up: true,
      color: '#16a34a',
      bg: '#f0fdf4',
    },
    {
      label: 'New Leads',
      value: '12',
      icon: Users,
      delta: '-2 vs last week',
      up: false,
      color: '#0284c7',
      bg: '#f0f9ff',
    },
    {
      label: 'MRR Growth',
      value: '+14.2%',
      icon: TrendingUp,
      delta: 'vs last month',
      up: true,
      color: '#7c3aed',
      bg: '#faf5ff',
    },
  ];

  return (
    <div className="animate-fade-in space-y-6 max-w-[1400px]">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Good morning 👋</h1>
          <p className="page-subtitle">Here's what's happening across your business today.</p>
        </div>
        {role === 'employee' && (
          <Link href="/daily-report">
            <button className="btn-primary">
              <Activity size={14} />
              Submit Daily Report
            </button>
          </Link>
        )}
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg" style={{ background: s.bg }}>
                  <Icon size={16} style={{ color: s.color }} />
                </div>
                <span className={s.up ? 'stat-delta-up flex items-center gap-0.5' : 'stat-delta-down flex items-center gap-0.5'}>
                  {s.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {s.delta}
                </span>
              </div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value mt-1" style={{ color: s.color }}>{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Left: Team Pulse + Pipeline */}
        <div className="xl:col-span-2 space-y-5">

          {/* Team Pulse */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-teal-500" />
                <h3 className="font-semibold text-slate-900 text-sm">Team Pulse — Today</h3>
              </div>
              <Link href="/manager-view" className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors">
                Full Gantt <ChevronRight size={13} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {demoDailyReports.slice(0, 3).map((report) => (
                <div key={report.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-900">{report.employeeName}</span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock size={11} />
                      {report.timeEntries.length} tasks logged
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">{report.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Snapshot */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-blue-500" />
                <h3 className="font-semibold text-slate-900 text-sm">Pipeline Snapshot</h3>
              </div>
              <Link href="/pipeline" className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors">
                View Board <ChevronRight size={13} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {activeDeals.slice(0, 5).map(deal => (
                <div key={deal.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STATUS_DOT[deal.status] || '#94a3b8' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{deal.title}</p>
                    <p className="text-xs text-slate-500 truncate">{deal.company.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-slate-900">{formatCurrency(deal.value)}</div>
                    <div className="text-[11px] text-slate-400">{deal.stage.name}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-50 bg-slate-50">
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>{activeDeals.length} open deals</span>
                <span className="font-semibold text-slate-700">{formatCurrency(pipelineValue)} total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Leaderboard + Quick Links */}
        <div className="space-y-5">

          {/* Leaderboard */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-purple-500" />
                <h3 className="font-semibold text-slate-900 text-sm">Top Performers</h3>
              </div>
              <BarChart3 size={14} className="text-slate-400" />
            </div>
            <div className="divide-y divide-slate-50">
              {demoLeaderboard.map((user, idx) => (
                <div key={user.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    idx === 0 ? 'bg-amber-100 text-amber-700'
                    : idx === 1 ? 'bg-slate-100 text-slate-600'
                    : 'bg-orange-50 text-orange-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.deals} deals won</p>
                  </div>
                  <span className="text-sm font-bold text-green-600 flex-shrink-0">
                    {formatCurrency(user.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions card */}
          <div className="card overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #0f1c3f 0%, #152466 100%)' }}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase size={14} className="text-teal-400" />
                <h3 className="font-semibold text-white text-sm">Antigravity ERP</h3>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Full-stack CRM + ERP with Production Gantt, RBAC, AI Copilot, Daily Reports, and Sales Pipeline — benchmarked against Odoo & HubSpot.
              </p>
              <div className="space-y-2">
                <Link href="/production">
                  <button className="w-full py-2 rounded-lg text-xs font-semibold bg-teal-500 text-white hover:bg-teal-400 transition-colors">
                    View Production Board
                  </button>
                </Link>
                <Link href="/copilot">
                  <button className="w-full py-2 rounded-lg text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors border border-white/10">
                    Launch AI Copilot
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
