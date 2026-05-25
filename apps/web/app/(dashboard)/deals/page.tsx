'use client';

import { useState } from 'react';
import { Search, Plus, ArrowUpDown, Calendar, TrendingUp, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DealCommandCenter } from '../../../components/DealCommandCenter';
import { demoDeals } from '../../../lib/demo-data';
import { formatCurrency, getStatusBadge, timeAgo } from '../../../lib/utils';

export default function DealsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = demoDeals.filter((d) => {
    const matchesSearch = !search || d.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = filtered.reduce((sum, d) => sum + (d.value ?? 0), 0);
  const openValue = filtered.filter((d) => d.status === 'open').reduce((sum, d) => sum + (d.value ?? 0), 0);
  const wonValue = filtered.filter((d) => d.status === 'won').reduce((sum, d) => sum + (d.value ?? 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Deals</h1>
          <p className="text-sm text-surface-500 mt-1">{filtered.length} deals · {formatCurrency(totalValue)} total</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          New Deal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <span className="stat-label">Open Pipeline</span>
          <span className="stat-value">{formatCurrency(openValue)}</span>
          <span className="text-xs text-accent-blue font-medium">{filtered.filter((d) => d.status === 'open').length} deals</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Won Revenue</span>
          <span className="stat-value text-accent-green">{formatCurrency(wonValue)}</span>
          <span className="text-xs text-accent-green font-medium">{filtered.filter((d) => d.status === 'won').length} closed</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Weighted Pipeline</span>
          <span className="stat-value gradient-text">
            {formatCurrency(filtered.filter((d) => d.status === 'open').reduce((sum, d) => sum + d.value * d.winProbability, 0))}
          </span>
          <span className="text-xs text-surface-500 font-medium">probability-weighted</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
          <input type="text" placeholder="Search deals..." className="input-field pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'open', 'won', 'lost'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === s ? 'bg-brand-500/15 text-brand-400' : 'text-surface-500 hover:bg-surface-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="table-header text-left px-4 py-3">Deal</th>
                <th className="table-header text-left px-4 py-3">Value</th>
                <th className="table-header text-left px-4 py-3">Stage</th>
                <th className="table-header text-left px-4 py-3">Contact</th>
                <th className="table-header text-left px-4 py-3">Close Date</th>
                <th className="table-header text-center px-4 py-3">Win %</th>
                <th className="table-header text-left px-4 py-3">Owner</th>
                <th className="table-header w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((deal) => (
                <tr 
                  key={deal.id} 
                  className="table-row cursor-pointer"
                  onClick={() => router.push(`/deals/${deal.id}`)}
                >
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-surface-800">{deal.title}</p>
                      <p className="text-xs text-surface-500">{deal.company.name}</p>
                    </div>
                  </td>
                  <td className="table-cell font-semibold text-surface-800">
                    {formatCurrency(deal.value)}
                  </td>
                  <td className="table-cell">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: `${deal.stage.color}20`, color: deal.stage.color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: deal.stage.color }}></span>
                      {deal.stage.name}
                    </span>
                  </td>
                  <td className="table-cell text-surface-600">
                    {deal.contact.firstName} {deal.contact.lastName}
                  </td>
                  <td className="table-cell">
                    <span className="flex items-center gap-1 text-xs text-surface-500">
                      <Calendar size={12} />
                      {new Date(deal.closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <div className="inline-flex items-center justify-center w-12 h-6 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: deal.winProbability >= 0.75 ? '#22c55e20' : deal.winProbability >= 0.5 ? '#f59e0b20' : '#ef444420',
                        color: deal.winProbability >= 0.75 ? '#22c55e' : deal.winProbability >= 0.5 ? '#f59e0b' : '#ef4444',
                      }}
                    >
                      {Math.round(deal.winProbability * 100)}%
                    </div>
                  </td>
                  <td className="table-cell text-surface-600 text-sm">{deal.owner.name}</td>
                  <td className="table-cell">
                    <button className="btn-ghost p-1">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DealCommandCenter 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
