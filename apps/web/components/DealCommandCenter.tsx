'use client';

import { useState } from 'react';
import { X, DollarSign, Target, Activity, Users } from 'lucide-react';
import { demoPipelineStages, demoCompanies, demoContacts } from '../lib/demo-data';

export function DealCommandCenter({ 
  isOpen, 
  onClose,
  onSave,
  initialData
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSave?: (data: any) => void;
  initialData?: any;
}) {
  const stages = demoPipelineStages;
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    value: initialData?.value || '',
    currency: initialData?.currency || 'USD',
    billingFrequency: initialData?.billingFrequency || 'One-time',
    stageId: initialData?.stageId || stages[0]?.id || '',
    dealType: initialData?.dealType || 'New Business',
    priority: initialData?.priority || 'Medium',
    source: initialData?.source || '',
    competitors: initialData?.competitors || '',
    winProbability: initialData?.winProbability ? Math.round(initialData.winProbability * 100) : 50,
    closeDate: initialData?.closeDate || '',
    nextStep: initialData?.nextStep || '',
    companyId: initialData?.companyId || '',
    contactId: initialData?.contactId || '',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-0/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="glass-card w-full max-w-4xl p-6 animate-scale-in my-8 border-t-4 border-t-brand-500">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-surface-900">Deal Command Center</h2>
            <p className="text-sm text-surface-500">Configure financial terms, forecast velocity, and strategic context.</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1 rounded-lg hover:bg-surface-200">
            <X size={24} />
          </button>
        </div>
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (onSave) {
              onSave(formData);
            } else {
              alert('Deal configured and saved (Mock)');
              onClose();
            }
          }}
          className="space-y-8 text-left"
        >
          {/* Section 1: Core Details & CPQ Lite */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-200 pb-2">
              <DollarSign size={18} className="text-brand-500" />
              <h3 className="text-sm font-bold text-surface-900 uppercase tracking-wider">Revenue & Configuration</h3>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">Deal Title</label>
              <input required type="text" className="input-field text-lg font-medium" placeholder="e.g. Acme Corp - Enterprise Rollout Phase 1" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Total Value</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">$</span>
                  <input required type="number" min="0" className="input-field pl-7 font-mono text-brand-600 font-semibold" placeholder="50000" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Currency</label>
                <select className="input-field" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Billing Frequency</label>
                <select className="input-field" value={formData.billingFrequency} onChange={e => setFormData({...formData, billingFrequency: e.target.value})}>
                  <option value="One-time">One-time / Hardware</option>
                  <option value="Monthly">Monthly ARR</option>
                  <option value="Annually">Annual ARR</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Section 2: Forecasting & Momentum */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-surface-200 pb-2">
                <Activity size={18} className="text-accent-orange" />
                <h3 className="text-sm font-bold text-surface-900 uppercase tracking-wider">Forecasting & Momentum</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Pipeline Stage</label>
                  <select className="input-field" value={formData.stageId} onChange={e => setFormData({...formData, stageId: e.target.value})}>
                    {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Expected Close Date</label>
                  <input type="date" className="input-field" value={formData.closeDate} onChange={e => setFormData({...formData, closeDate: e.target.value})} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-surface-500">Win Probability: {formData.winProbability}%</label>
                  <span className="text-[10px] font-bold text-brand-500">{formData.winProbability > 75 ? 'HIGH COMMIT' : formData.winProbability < 25 ? 'AT RISK' : 'PIPELINE'}</span>
                </div>
                <input type="range" min="0" max="100" step="5" className="w-full accent-brand-500" value={formData.winProbability} onChange={e => setFormData({...formData, winProbability: parseInt(e.target.value)})} />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Next Step Momentum</label>
                <input type="text" className="input-field mb-2" placeholder="e.g. Schedule technical validation with CTO" value={formData.nextStep} onChange={e => setFormData({...formData, nextStep: e.target.value})} />
              </div>
            </div>

            {/* Section 3: Strategic Context */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-surface-200 pb-2">
                <Target size={18} className="text-accent-purple" />
                <h3 className="text-sm font-bold text-surface-900 uppercase tracking-wider">Strategic Context</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Deal Type</label>
                  <select className="input-field" value={formData.dealType} onChange={e => setFormData({...formData, dealType: e.target.value})}>
                    <option value="New Business">New Business</option>
                    <option value="Expansion">Expansion / Upsell</option>
                    <option value="Renewal">Renewal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Priority</label>
                  <select className="input-field" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical (Board Level)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Lead Source</label>
                <select className="input-field" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
                  <option value="">Select Source...</option>
                  <option value="Inbound">Inbound Request</option>
                  <option value="Outbound">Outbound (Cold)</option>
                  <option value="Referral">Partner / Referral</option>
                  <option value="Event">Event / Tradeshow</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Known Competitors (Comma separated)</label>
                <input type="text" className="input-field" placeholder="e.g. Salesforce, HubSpot, Custom Build" value={formData.competitors} onChange={e => setFormData({...formData, competitors: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Section 4: Entity Linking */}
          <div className="pt-4 border-t border-surface-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-100 pb-2">
              <Users size={18} className="text-accent-cyan" />
              <h3 className="text-sm font-bold text-surface-900 uppercase tracking-wider">Entity Linking</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Associated Company</label>
                <select 
                  className="input-field" 
                  value={formData.companyId} 
                  onChange={e => {
                    setFormData({...formData, companyId: e.target.value, contactId: ''}); // reset contact if company changes
                  }}
                >
                  <option value="">Search Company Directory...</option>
                  {demoCompanies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Decision Maker (Contact)</label>
                <select 
                  className="input-field" 
                  value={formData.contactId} 
                  onChange={e => {
                    const selectedContact = demoContacts.find(c => c.id === e.target.value);
                    const matchedCompany = selectedContact ? demoCompanies.find(c => c.name === selectedContact.company.name) : null;
                    setFormData({
                      ...formData, 
                      contactId: e.target.value,
                      // Auto-link the company if a contact is selected
                      ...(matchedCompany && !formData.companyId ? { companyId: matchedCompany.id } : {})
                    });
                  }}
                >
                  <option value="">Search Contacts Directory...</option>
                  {demoContacts
                    .filter(c => {
                      if (!formData.companyId) return true;
                      const matchedComp = demoCompanies.find(comp => comp.id === formData.companyId);
                      return matchedComp && c.company.name === matchedComp.name;
                    })
                    .map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName} {formData.companyId ? '' : `(${c.company.name})`}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 flex items-center justify-between border-t border-surface-200 mt-8">
            <p className="text-xs text-surface-400">Visibility: <strong className="text-accent-purple">Automatically visible to Managers and Admins</strong></p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn-primary py-2.5 px-6">
                Create Deal
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
