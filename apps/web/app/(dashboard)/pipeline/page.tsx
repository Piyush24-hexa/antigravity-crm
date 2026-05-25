'use client';

import { useState } from 'react';
import { GripVertical, Plus, ChevronDown, MoreHorizontal, X, DollarSign, Target, Activity, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DealCommandCenter } from '../../../components/DealCommandCenter';
import { RoleGuard } from '../../../components/RoleGuard';
import { demoPipelineStages } from '../../../lib/demo-data';
import { formatCurrency, getInitials } from '../../../lib/utils';

export default function PipelinePage() {
  const router = useRouter();
  const stages = demoPipelineStages;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalOpen = stages.reduce(
    (sum, s) => sum + s.deals.reduce((ds, d) => ds + (d.value ?? 0), 0),
    0
  );

  return (
    <RoleGuard allowedRoles={['admin', 'manager']}>
      <div className="space-y-6 animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Pipeline</h1>
          <p className="text-sm text-surface-500 mt-1">
            Sales Pipeline · {formatCurrency(totalOpen)} total pipeline value
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="input-field w-auto py-2 text-sm">
            <option>Sales Pipeline</option>
            <option>Enterprise Pipeline</option>
          </select>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            New Deal
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-h-[600px]">
          {stages.map((stage) => {
            const stageTotal = stage.deals.reduce((s, d) => s + (d.value ?? 0), 0);
            return (
              <div key={stage.id} className="kanban-column shrink-0">
                {/* Column Header */}
                <div className="flex items-center justify-between px-1 mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    ></div>
                    <h3 className="text-sm font-semibold text-surface-800">{stage.name}</h3>
                    <span className="text-xs text-surface-500 bg-surface-200 px-1.5 py-0.5 rounded-md">
                      {stage.deals.length}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-surface-500">
                    {formatCurrency(stageTotal)}
                  </span>
                </div>

                {/* Progress bar for weighted value */}
                <div className="h-1 bg-surface-200 rounded-full mx-1 mb-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: stage.color,
                      width: `${Math.min(100, (stageTotal / Math.max(totalOpen, 1)) * 100 * 3)}%`,
                    }}
                  ></div>
                </div>

                {/* Deal Cards */}
                <div className="space-y-2.5 flex-1">
                  {stage.deals.map((deal, i) => (
                    <div
                      key={deal.id}
                      className="kanban-card animate-scale-in cursor-pointer"
                      style={{ animationDelay: `${i * 60}ms` }}
                      onClick={() => router.push(`/deals/${deal.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-surface-800 leading-tight line-clamp-2">
                          {deal.title}
                        </h4>
                        <button className="btn-ghost p-0.5 -mr-1 -mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>

                      <p className="text-xs text-surface-500 mb-3">{deal.company.name}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-surface-900">
                          {formatCurrency(deal.value)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-surface-500">
                            {deal.contact.firstName} {deal.contact.lastName.charAt(0)}.
                          </span>
                          <div
                            className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400/30 to-accent-purple/30 flex items-center justify-center text-[9px] font-semibold text-brand-400 border border-surface-300"
                            title={deal.owner.name}
                          >
                            {getInitials(deal.owner.name)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add deal button */}
                  <button className="w-full py-2.5 rounded-xl border border-dashed border-surface-300 text-xs text-surface-500 hover:border-brand-500 hover:text-brand-400 hover:bg-brand-500/5 transition-all flex items-center justify-center gap-1" onClick={() => setIsModalOpen(true)}>
                    <Plus size={14} />
                    Add deal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>

      <DealCommandCenter 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </RoleGuard>
  );
}
