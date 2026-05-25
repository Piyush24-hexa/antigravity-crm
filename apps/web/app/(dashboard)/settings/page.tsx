'use client';

import { Settings as SettingsIcon, Building2, Users, Link2, CreditCard, Shield } from 'lucide-react';
import { RoleGuard } from '../../../components/RoleGuard';

const settingsSections = [
  { icon: Building2, title: 'Workspace', desc: 'Name, slug, region, and general settings', badge: null },
  { icon: Users, title: 'Team Members', desc: '3 members · 7 seats available', badge: '3/10' },
  { icon: Link2, title: 'Integrations', desc: 'Gmail, Slack, Stripe, and more', badge: '2 active' },
  { icon: CreditCard, title: 'Billing', desc: 'Pro plan · $29/seat/month', badge: 'Pro' },
  { icon: Shield, title: 'Security', desc: 'SSO, MFA, and access controls', badge: null },
];

export default function SettingsPage() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
        <p className="text-sm text-surface-500 mt-1">Manage your workspace configuration</p>
      </div>

      <div className="space-y-3">
        {settingsSections.map(({ icon: Icon, title, desc, badge }, i) => (
          <div
            key={title}
            className="glass-card-hover p-5 flex items-center justify-between cursor-pointer animate-slide-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-surface-200 flex items-center justify-center">
                <Icon size={20} className="text-surface-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-surface-800">{title}</h3>
                <p className="text-xs text-surface-500">{desc}</p>
              </div>
            </div>
            {badge && (
              <span className="badge bg-brand-500/10 text-brand-400">{badge}</span>
            )}
          </div>
        ))}
      </div>
      </div>
    </RoleGuard>
  );
}
