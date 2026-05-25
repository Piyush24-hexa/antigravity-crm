'use client';

import { useAppStore } from '../../../lib/store';
import { demoDeals, demoDailyReports, demoLeaderboard, demoRevenueData } from '../../../lib/demo-data';
import { Calendar, LayoutDashboard, Target, Users, TrendingUp, CheckCircle2, Clock, Info } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '../../../lib/utils';

export default function OverviewPage() {
  const { role } = useAppStore();

  const activeDeals = demoDeals.filter(d => d.status === 'open');
  const pipelineValue = activeDeals.reduce((acc, deal) => acc + deal.value, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold text-surface-900">Welcome back!</h1>
        <p className="text-surface-500 mt-1">Here is what's happening across the CRM today.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <span className="stat-label flex items-center gap-2"><Target size={14}/> Active Pipeline</span>
          <span className="stat-value text-brand-500">{formatCurrency(pipelineValue)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label flex items-center gap-2"><CheckCircle2 size={14}/> Win Rate</span>
          <span className="stat-value text-accent-green">64%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label flex items-center gap-2"><Users size={14}/> New Leads</span>
          <span className="stat-value text-accent-purple">12</span>
        </div>
        <div className="stat-card">
          <span className="stat-label flex items-center gap-2"><TrendingUp size={14}/> MRR Growth</span>
          <span className="stat-value text-accent-cyan">+14.2%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Recent Daily Reports & Activities */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-card p-6 border-l-4 border-l-brand-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-surface-900 font-bold">
                <LayoutDashboard size={20} className="text-brand-500"/>
                <h3>Today's Team Pulse</h3>
              </div>
              <Link href="/manager-view" className="text-sm font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1">
                Open Full Gantt View &rarr;
              </Link>
            </div>
            
            <div className="space-y-4">
              {demoDailyReports.slice(0, 3).map((report, idx) => (
                <div key={report.id} className="p-4 bg-surface-50 rounded-xl border border-surface-200 hover:border-brand-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-surface-900">{report.employeeName}</span>
                    <span className="text-xs text-surface-500 font-medium flex items-center gap-1"><Clock size={12}/> {report.timeEntries.length} Tasks Logged</span>
                  </div>
                  <p className="text-sm text-surface-600 line-clamp-2">{report.description}</p>
                </div>
              ))}
            </div>
            {role === 'employee' && (
              <div className="mt-4 text-center">
                <Link href="/daily-report">
                  <button className="btn-primary w-full shadow-md">
                    Submit My Daily Report
                  </button>
                </Link>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-surface-900">Pipeline Snapshot</h3>
              <Link href="/pipeline" className="text-sm font-semibold text-brand-500 hover:text-brand-600">
                View Board &rarr;
              </Link>
            </div>
            <div className="space-y-3">
              {activeDeals.slice(0, 4).map(deal => (
                <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 transition-colors cursor-pointer border border-transparent hover:border-surface-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: deal.stage.color }}></div>
                    <div>
                      <p className="text-sm font-bold text-surface-900">{deal.title}</p>
                      <p className="text-xs text-surface-500">{deal.company.name}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-surface-800">{formatCurrency(deal.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard & Quick Links */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-bold text-surface-900 mb-4">Top Performers</h3>
            <div className="space-y-4">
              {demoLeaderboard.map((user, idx) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-200 flex items-center justify-center font-bold text-sm text-surface-700">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-surface-900">{user.name}</p>
                    <p className="text-xs text-surface-500">{user.deals} deals won</p>
                  </div>
                  <span className="text-sm font-semibold text-accent-green">
                    {formatCurrency(user.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 bg-brand-500 text-white shadow-xl shadow-brand-500/20">
            <h3 className="font-bold mb-2 flex items-center gap-2"><Info size={16}/> Antigravity CRM</h3>
            <p className="text-sm text-white/80 mb-4">
              Your "Deal 360", "Daily Reports", and "Manager Gantt View" modules are fully integrated and benchmarking against industry standards like Microsoft Dynamics and Odoo.
            </p>
            <Link href="/daily-report">
              <button className="w-full py-2 bg-white text-brand-600 rounded-lg text-sm font-bold hover:shadow-lg transition-all">
                Try Daily Reports
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
