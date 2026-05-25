'use client';

import { useState } from 'react';
import { Search, Plus, Globe, MapPin, Building2, Users, HandCoins, ArrowUpDown, X, Loader2, ChevronDown, ChevronUp, SearchCode } from 'lucide-react';
import Link from 'next/link';
import { demoCompanies } from '../../../lib/demo-data';
import { formatCurrency, formatNumber } from '../../../lib/utils';

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetchingVAT, setIsFetchingVAT] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    taxId: '',
    name: '',
    legalName: '',
    domain: '',
    industry: '',
    size: '1-10',
    companyType: 'Private',
    currency: 'USD',
    paymentTerms: 'Net 30',
    creditLimit: '',
  });

  const handleVatLookup = () => {
    if (!formData.taxId) return;
    setIsFetchingVAT(true);
    // Simulate pinging a Tax Registry API (e.g. VIES or ClearTax)
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        name: 'Stark Industries',
        legalName: 'Stark Industries Defense LLC',
        domain: 'stark.com',
        industry: 'Defense & Technology',
        size: '1000+',
        companyType: 'Public',
        currency: 'USD',
        paymentTerms: 'Net 60',
        creditLimit: '50000000'
      }));
      setIsFetchingVAT(false);
    }, 1500);
  };

  const filtered = demoCompanies.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.domain?.toLowerCase().includes(search.toLowerCase()) ||
      c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Companies</h1>
          <p className="text-sm text-surface-500 mt-1">{filtered.length} companies</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          Add Company
        </button>
      </div>

      <div className="glass-card p-4">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
          <input
            type="text"
            placeholder="Search companies..."
            className="input-field pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((company, i) => (
          <Link
            href={`/companies/${company.id}`}
            key={company.id}
            className="glass-card-hover p-5 space-y-4 animate-scale-in block"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 border border-surface-300 flex items-center justify-center">
                  <Building2 size={20} className="text-brand-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-surface-800">{company.name}</h3>
                  <p className="text-xs text-surface-500 flex items-center gap-1">
                    <Globe size={11} /> {company.domain}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {company.industry && (
                <span className="badge bg-brand-500/10 text-brand-400">{company.industry}</span>
              )}
              {company.size && (
                <span className="badge bg-surface-300/50 text-surface-600">{company.size} employees</span>
              )}
              {company.country && (
                <span className="badge bg-surface-300/50 text-surface-600 flex items-center gap-1">
                  <MapPin size={10} /> {company.country}
                </span>
              )}
            </div>

            {company.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {company.techStack.map((tech) => (
                  <span key={tech} className="text-[10px] px-2 py-0.5 rounded-md bg-accent-cyan/10 text-accent-cyan font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-surface-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-surface-500">
                  <Users size={13} /> {company._count.contacts}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-surface-500">
                  <HandCoins size={13} /> {company._count.deals}
                </div>
              </div>
              {company.revenue && (
                <span className="text-sm font-semibold text-surface-700">
                  {formatCurrency(company.revenue)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Add Company Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-0/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="glass-card w-full max-w-2xl p-6 animate-scale-in my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-surface-900">Add New Enterprise Company</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost p-1 rounded-lg hover:bg-surface-200">
                <X size={20} />
              </button>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Enterprise Company added successfully (Mock)');
                setIsModalOpen(false);
              }}
              className="space-y-4"
            >
              {/* VAT Auto Fetch Section */}
              <div className="p-4 bg-brand-500/5 border border-brand-500/20 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-brand-600 mb-2">
                  <SearchCode size={16} />
                  <h3 className="text-sm font-bold">Auto-Fetch Details</h3>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-brand-600/80 mb-1">VAT / GST / Tax ID Number</label>
                    <input 
                      type="text" 
                      className="input-field border-brand-500/20 focus:border-brand-500 focus:ring-brand-500/20" 
                      placeholder="e.g. GSTIN123456" 
                      value={formData.taxId}
                      onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      type="button" 
                      className="btn-primary h-[38px] min-w-[120px]"
                      onClick={handleVatLookup}
                      disabled={isFetchingVAT || !formData.taxId}
                    >
                      {isFetchingVAT ? <Loader2 size={16} className="animate-spin" /> : 'Lookup'}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-brand-600/60">Pings registry API to automatically populate legal and financial details below.</p>
              </div>

              {/* Core Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Legal Entity Name</label>
                  <input required name="legalName" type="text" className="input-field" placeholder="Acme Corporation LLC" value={formData.legalName} onChange={e => setFormData({...formData, legalName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Brand/Display Name</label>
                  <input required name="name" type="text" className="input-field" placeholder="Acme Corp" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Domain</label>
                  <input name="domain" type="text" className="input-field" placeholder="acmecorp.com" value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Industry</label>
                  <input name="industry" type="text" className="input-field" placeholder="Technology" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Company Type</label>
                  <select name="companyType" className="input-field" value={formData.companyType} onChange={e => setFormData({...formData, companyType: e.target.value})}>
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                    <option value="LLC">LLC</option>
                    <option value="Non-Profit">Non-Profit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Company Size</label>
                  <select name="size" className="input-field" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})}>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="200+">200+ employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
              </div>

              {/* Financial Section */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === 'financial' ? null : 'financial')}
                  className="flex items-center justify-between w-full p-3 bg-surface-50 rounded-lg border border-surface-200 hover:border-brand-300 transition-colors"
                >
                  <span className="text-sm font-semibold text-surface-800">Financial & Billing Terms</span>
                  {expandedSection === 'financial' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSection === 'financial' && (
                  <div className="p-4 border border-t-0 border-surface-200 rounded-b-lg bg-white space-y-4 animate-slide-up">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-surface-500 mb-1">Default Currency</label>
                        <select name="currency" className="input-field" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="INR">INR (₹)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-surface-500 mb-1">Payment Terms</label>
                        <select name="paymentTerms" className="input-field" value={formData.paymentTerms} onChange={e => setFormData({...formData, paymentTerms: e.target.value})}>
                          <option value="Due on Receipt">Due on Receipt</option>
                          <option value="Net 15">Net 15</option>
                          <option value="Net 30">Net 30</option>
                          <option value="Net 60">Net 60</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-surface-500 mb-1">Approved Credit Limit</label>
                      <input name="creditLimit" type="number" className="input-field" placeholder="50000" value={formData.creditLimit} onChange={e => setFormData({...formData, creditLimit: e.target.value})} />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-surface-200 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
