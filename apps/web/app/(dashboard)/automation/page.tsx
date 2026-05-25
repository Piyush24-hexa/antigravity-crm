'use client';

import { Zap, GitBranch, Play, Pause } from 'lucide-react';
import { RoleGuard } from '../../../components/RoleGuard';

const demoAutomations = [
  { name: 'New Lead Welcome Sequence', trigger: 'contact_created', actions: 2, active: true, runs: 156 },
  { name: 'Stale Deal Alert', trigger: 'deal_stalled', actions: 1, active: true, runs: 42 },
  { name: 'Won Deal Notification', trigger: 'deal_won', actions: 3, active: false, runs: 28 },
  { name: 'High Score Assignment', trigger: 'contact_score_changed', actions: 2, active: true, runs: 89 },
  { name: 'Meeting Follow-Up', trigger: 'call_analyzed', actions: 2, active: false, runs: 15 },
];

export default function AutomationPage() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Automation</h1>
          <p className="text-sm text-surface-500 mt-1">No-code workflow automation with natural language</p>
        </div>
        <button className="btn-primary">
          <Zap size={16} />
          Create Rule
        </button>
      </div>

      <div className="space-y-3">
        {demoAutomations.map((auto, i) => (
          <div key={i} className="glass-card-hover p-4 flex items-center justify-between animate-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                auto.active ? 'bg-accent-green/15' : 'bg-surface-300/50'
              }`}>
                <GitBranch size={18} className={auto.active ? 'text-accent-green' : 'text-surface-500'} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-surface-800">{auto.name}</h3>
                <p className="text-xs text-surface-500">
                  Trigger: <span className="text-brand-400 font-medium">{auto.trigger}</span>
                  {' · '}{auto.actions} actions · {auto.runs} runs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`badge ${auto.active ? 'bg-accent-green/15 text-accent-green' : 'bg-surface-300/50 text-surface-500'}`}>
                {auto.active ? 'Active' : 'Paused'}
              </span>
              <button className="btn-ghost p-2">
                {auto.active ? <Pause size={16} /> : <Play size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </RoleGuard>
  );
}
