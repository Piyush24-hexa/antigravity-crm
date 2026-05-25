'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, Building2, User, DollarSign, Activity, 
  Calendar, CheckCircle2, MoreHorizontal, Edit, Target 
} from 'lucide-react';
import { demoDeals, demoCompanies, demoContacts } from '../../../../lib/demo-data';
import { formatCurrency, getInitials, getStatusBadge } from '../../../../lib/utils';
import { DealCommandCenter } from '../../../../components/DealCommandCenter';
import Link from 'next/link';

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deal = demoDeals.find((d) => d.id === params.id) || demoDeals[0];

  if (!deal) return <div className="p-8 text-center text-surface-500">Deal not found</div>;

  const fullCompany = demoCompanies.find(c => c.name === deal.company.name) || demoCompanies[0];
  const fullContact = demoContacts.find(c => c.firstName === deal.contact.firstName && c.lastName === deal.contact.lastName) || demoContacts[0];

  if (!fullCompany || !fullContact) return <div className="p-8 text-center text-surface-500">Missing entity data</div>;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header / Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-900 transition-colors"
        >
          <X size={16} />
          Close Deal Room
        </button>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <MoreHorizontal size={16} />
          </button>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Edit size={16} /> Edit Deal
          </button>
        </div>
      </div>

      {/* Main Deal Header */}
      <div className="glass-card p-6 flex items-start justify-between border-t-4 border-t-brand-500">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-surface-900">{deal.title}</h1>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: `${deal.stage.color}20`, color: deal.stage.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: deal.stage.color }}></span>
              {deal.stage.name}
            </span>
          </div>
          <p className="text-surface-500 text-sm">
            Owned by <strong className="text-surface-700">{deal.owner.name}</strong> · Created recently
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold gradient-text">{formatCurrency(deal.value)}</p>
          <p className="text-sm font-semibold text-accent-green">
            {Math.round(deal.winProbability * 100)}% Probability
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Connected Entities */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Customer Enterprise Card */}
          <div className="glass-card p-6 border-l-4 border-l-accent-cyan">
            <div className="flex items-center gap-2 mb-4 text-accent-cyan">
              <Building2 size={18} />
              <h2 className="font-bold uppercase tracking-wider text-sm">Customer Enterprise</h2>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 border border-surface-200 flex items-center justify-center text-brand-500 font-bold">
                {getInitials(fullCompany.name)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-surface-900">{fullCompany.name}</h3>
                <p className="text-xs text-surface-500">{fullCompany.domain}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Industry</span>
                <span className="font-semibold text-surface-800">{fullCompany.industry}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Company Size</span>
                <span className="font-semibold text-surface-800">{fullCompany.size}</span>
              </div>
            </div>

            <Link href={`/companies/${fullCompany.id}`}>
              <button className="w-full btn-secondary text-sm">
                Open Enterprise 360
              </button>
            </Link>
          </div>

          {/* Employee / Contact Card */}
          <div className="glass-card p-6 border-l-4 border-l-accent-purple">
            <div className="flex items-center gap-2 mb-4 text-accent-purple">
              <User size={18} />
              <h2 className="font-bold uppercase tracking-wider text-sm">Decision Maker (Employee)</h2>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400/20 to-accent-purple/20 border border-surface-300 flex items-center justify-center font-bold text-brand-400">
                {getInitials(`${fullContact.firstName} ${fullContact.lastName}`)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-surface-900">
                  {fullContact.firstName} {fullContact.lastName}
                </h3>
                <p className="text-xs font-medium text-brand-500">{(fullContact as any).title || 'Executive'}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Email</span>
                <span className="font-semibold text-surface-800">{fullContact.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Phone</span>
                <span className="font-semibold text-surface-800">{(fullContact as any).phone || 'N/A'}</span>
              </div>
            </div>

            <Link href={`/contacts/${fullContact.id}`}>
              <button className="w-full btn-secondary text-sm">
                Open Employee Profile
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: Deal Context & Momentum */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6 text-accent-orange">
              <Activity size={18} />
              <h2 className="font-bold uppercase tracking-wider text-sm">Momentum & Forecasting</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1 p-4 rounded-xl bg-surface-50 border border-surface-100">
                <p className="text-xs text-surface-500 font-medium">Expected Close Date</p>
                <div className="flex items-center gap-2 text-surface-900 font-semibold">
                  <Calendar size={16} className="text-brand-500" />
                  {new Date(deal.closeDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <div className="space-y-1 p-4 rounded-xl bg-surface-50 border border-surface-100">
                <p className="text-xs text-surface-500 font-medium">Next Step</p>
                <div className="flex items-center gap-2 text-surface-900 font-semibold">
                  <CheckCircle2 size={16} className="text-accent-green" />
                  Finalize Technical Review
                </div>
              </div>
              
              <div className="space-y-1 p-4 rounded-xl bg-surface-50 border border-surface-100">
                <p className="text-xs text-surface-500 font-medium">Deal Type</p>
                <div className="flex items-center gap-2 text-surface-900 font-semibold">
                  <Target size={16} className="text-accent-purple" />
                  Enterprise New Business
                </div>
              </div>

              <div className="space-y-1 p-4 rounded-xl bg-surface-50 border border-surface-100">
                <p className="text-xs text-surface-500 font-medium">Billing Frequency</p>
                <div className="flex items-center gap-2 text-surface-900 font-semibold">
                  <DollarSign size={16} className="text-accent-cyan" />
                  Annual ARR
                </div>
              </div>
            </div>
          </div>

          {/* Activity Placeholder */}
          <div className="glass-card p-6 min-h-[300px] flex items-center justify-center text-surface-400 border-dashed">
            <div className="text-center">
              <Activity size={32} className="mx-auto mb-3 opacity-50" />
              <p className="font-medium">Activity Feed</p>
              <p className="text-sm">Emails, notes, and meetings will appear here.</p>
            </div>
          </div>
        </div>
      </div>

      <DealCommandCenter 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={{
          title: deal.title,
          value: deal.value,
          winProbability: deal.winProbability,
          closeDate: deal.closeDate,
          companyId: fullCompany.id,
          contactId: fullContact.id
        }}
      />
    </div>
  );
}
