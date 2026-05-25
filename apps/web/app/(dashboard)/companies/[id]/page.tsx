'use client';

import { useState } from 'react';
import { ArrowLeft, Building2, MapPin, Globe, Phone, Mail, Edit, Share2, MoreHorizontal, FileText, CheckCircle2, Clock, Users, HandCoins, Activity, Briefcase, Landmark, CreditCard, ExternalLink, X, DownloadCloud, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '../../../../lib/utils';
import { demoContacts } from '../../../../lib/demo-data';

// Mock detailed company matching the new Enterprise Schema
const mockCompany = {
  id: '2', // Matches Global Dynamics in demo-data
  name: 'Global Dynamics',
  legalName: 'Global Dynamics Manufacturing GmbH',
  domain: 'globaldynamics.com',
  industry: 'Manufacturing',
  size: '201-1000',
  revenue: 85000000,
  
  taxId: 'DE999988887777',
  registrationNumber: 'HRB 123456 Munich',
  companyType: 'GmbH',
  currency: 'EUR',
  paymentTerms: 'Net 45',
  creditLimit: 1500000,
  
  phone: '+49 (89) 555-0199',
  email: 'billing@globaldynamics.com',
  
  billingStreet: '100 Innovationstr.',
  billingCity: 'Munich',
  billingState: 'Bavaria',
  billingZip: '80331',
  billingCountry: 'Germany',
  
  shippingStreet: '100 Innovationstr., Warehouse Bay 4',
  shippingCity: 'Munich',
  shippingState: 'Bavaria',
  shippingZip: '80331',
  shippingCountry: 'Germany',

  techStack: ['React', 'Node.js', 'AWS', 'Snowflake'],
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6).toISOString(), // 6 months ago
};

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'locations' | 'contacts'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header / Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.push('/companies')}
          className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-900 transition-colors"
        >
          <X size={16} />
          Close
        </button>
        <div className="flex items-center gap-2">
          <button className="btn-secondary" onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <DownloadCloud size={16} />}
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
          <button className="btn-secondary">
            <Share2 size={16} /> Share
          </button>
          <button className="btn-primary" onClick={() => setIsEditModalOpen(true)}>
            <Edit size={16} /> Edit Company
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="xl:col-span-1 space-y-6">
          <div className="glass-card p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 border-2 border-surface-200 flex items-center justify-center mb-4">
                <Building2 size={40} className="text-brand-500" />
              </div>
              <h1 className="text-2xl font-bold text-surface-900 mb-1">{mockCompany.name}</h1>
              <p className="text-sm text-surface-500 mb-3">{mockCompany.legalName}</p>
              
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <span className="badge bg-brand-500/10 text-brand-500">{mockCompany.industry}</span>
                <span className="badge bg-surface-200 text-surface-700">{mockCompany.companyType}</span>
              </div>

              <div className="w-full grid grid-cols-2 gap-3 mb-6">
                <button className="flex items-center justify-center gap-2 py-2 px-4 bg-surface-100 hover:bg-surface-200 text-surface-800 rounded-lg text-sm font-semibold transition-colors">
                  <Globe size={16} /> Website
                </button>
                <button className="flex items-center justify-center gap-2 py-2 px-4 bg-surface-100 hover:bg-surface-200 text-surface-800 rounded-lg text-sm font-semibold transition-colors">
                  <Phone size={16} /> Call HQ
                </button>
              </div>

              <div className="w-full space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <Mail className="text-surface-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="text-xs font-medium text-surface-500 mb-0.5">Billing Email</p>
                    <p className="text-sm font-medium text-surface-900">{mockCompany.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-surface-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="text-xs font-medium text-surface-500 mb-0.5">Headquarters</p>
                    <p className="text-sm font-medium text-surface-900">{mockCompany.billingCity}, {mockCompany.billingCountry}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="text-surface-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="text-xs font-medium text-surface-500 mb-0.5">Company Size</p>
                    <p className="text-sm font-medium text-surface-900">{mockCompany.size} Employees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-surface-900 mb-4 flex items-center gap-2">
              <Activity size={16} className="text-accent-orange" />
              Activity Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-surface-600">
                  <Briefcase size={14} /> <span className="text-sm">Active Deals</span>
                </div>
                <span className="font-semibold text-surface-900">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-surface-600">
                  <HandCoins size={14} /> <span className="text-sm">Open Pipeline</span>
                </div>
                <span className="font-semibold text-accent-green">$1.2M</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-surface-600">
                  <Users size={14} /> <span className="text-sm">Total Contacts</span>
                </div>
                <span className="font-semibold text-surface-900">2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Content */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center gap-6 border-b border-surface-200">
            {(['overview', 'financials', 'locations', 'contacts'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold capitalize transition-colors relative ${
                  activeTab === tab ? 'text-brand-500' : 'text-surface-500 hover:text-surface-800'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6 animate-slide-up">
              <div className="glass-card p-6">
                <h3 className="text-base font-bold text-surface-900 mb-4 flex items-center gap-2">
                  <Building2 size={18} className="text-surface-400" /> Company Profile
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-surface-500 font-medium mb-1">Domain</p>
                    <a href={`https://${mockCompany.domain}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-500 hover:underline flex items-center gap-1">
                      {mockCompany.domain} <ExternalLink size={12} />
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 font-medium mb-1">Estimated Revenue</p>
                    <p className="text-sm font-medium text-surface-900">{formatCurrency(mockCompany.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 font-medium mb-1">Tech Stack</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {mockCompany.techStack.map(tech => (
                        <span key={tech} className="text-[10px] px-2 py-0.5 bg-surface-200 text-surface-700 rounded-md font-medium">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financials' && (
            <div className="space-y-6 animate-slide-up">
              <div className="glass-card p-6">
                <h3 className="text-base font-bold text-surface-900 mb-4 flex items-center gap-2">
                  <Landmark size={18} className="text-accent-purple" /> Legal & Registration
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-surface-500 font-medium mb-1">Legal Entity Name</p>
                    <p className="text-sm font-medium text-surface-900">{mockCompany.legalName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 font-medium mb-1">Company Type</p>
                    <p className="text-sm font-medium text-surface-900">{mockCompany.companyType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 font-medium mb-1">VAT / GST / Tax ID</p>
                    <p className="text-sm font-mono text-surface-900">{mockCompany.taxId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 font-medium mb-1">Registration No. (CIN)</p>
                    <p className="text-sm font-mono text-surface-900">{mockCompany.registrationNumber}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-base font-bold text-surface-900 mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-accent-green" /> Billing Terms
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-surface-500 font-medium mb-1">Default Currency</p>
                    <p className="text-sm font-medium text-surface-900">{mockCompany.currency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 font-medium mb-1">Payment Terms</p>
                    <span className="badge bg-accent-green/10 text-accent-green">{mockCompany.paymentTerms}</span>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 font-medium mb-1">Approved Credit Limit</p>
                    <p className="text-sm font-medium text-surface-900">{formatCurrency(mockCompany.creditLimit)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
              <div className="glass-card p-6 border-l-4 border-l-brand-500">
                <h3 className="text-base font-bold text-surface-900 mb-4">Billing Address</h3>
                <div className="space-y-2">
                  <p className="text-sm text-surface-800">{mockCompany.billingStreet}</p>
                  <p className="text-sm text-surface-800">{mockCompany.billingCity}, {mockCompany.billingState} {mockCompany.billingZip}</p>
                  <p className="text-sm text-surface-800">{mockCompany.billingCountry}</p>
                </div>
              </div>
              <div className="glass-card p-6 border-l-4 border-l-accent-cyan">
                <h3 className="text-base font-bold text-surface-900 mb-4">Shipping / Warehouse</h3>
                <div className="space-y-2">
                  <p className="text-sm text-surface-800">{mockCompany.shippingStreet}</p>
                  <p className="text-sm text-surface-800">{mockCompany.shippingCity}, {mockCompany.shippingState} {mockCompany.shippingZip}</p>
                  <p className="text-sm text-surface-800">{mockCompany.shippingCountry}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="glass-card animate-slide-up overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200 bg-surface-50">
                    <th className="table-head">NAME</th>
                    <th className="table-head">EMAIL</th>
                    <th className="table-head">STATUS</th>
                    <th className="table-head">OWNER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200">
                  {demoContacts
                    .filter(c => c.company.name === mockCompany.name)
                    .map(contact => (
                    <tr key={contact.id} className="hover:bg-surface-50 transition-colors cursor-pointer" onClick={() => router.push(`/contacts/${contact.id}`)}>
                      <td className="table-cell font-medium text-surface-900">
                        {contact.firstName} {contact.lastName}
                      </td>
                      <td className="table-cell text-surface-500">{contact.email}</td>
                      <td className="table-cell">
                        <span className={`badge ${
                          contact.status === 'customer' ? 'bg-accent-green/10 text-accent-green' :
                          contact.status === 'prospect' ? 'bg-accent-purple/10 text-accent-purple' :
                          'bg-brand-500/10 text-brand-500'
                        }`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="table-cell text-surface-600">{contact.owner.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {demoContacts.filter(c => c.company.name === mockCompany.name).length === 0 && (
                <div className="p-8 text-center text-surface-500 text-sm">
                  No contacts found for this company.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Company Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-0/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="glass-card w-full max-w-lg p-6 animate-scale-in my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-surface-900">Edit Company Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="btn-ghost p-1 rounded-lg hover:bg-surface-200">
                <X size={20} />
              </button>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Company details updated successfully (Mock)');
                setIsEditModalOpen(false);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Legal Name</label>
                  <input required name="legalName" type="text" className="input-field" defaultValue={mockCompany.legalName} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Domain</label>
                  <input required name="domain" type="text" className="input-field" defaultValue={mockCompany.domain} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Payment Terms</label>
                  <select name="paymentTerms" className="input-field" defaultValue={mockCompany.paymentTerms}>
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Credit Limit</label>
                  <input name="creditLimit" type="number" className="input-field" defaultValue={mockCompany.creditLimit} />
                </div>
              </div>

              <div className="pt-2 border-t border-surface-200">
                <h3 className="text-sm font-semibold text-surface-900 mb-3">Billing Address</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1">Street</label>
                    <input name="billingStreet" type="text" className="input-field" defaultValue={mockCompany.billingStreet} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-surface-500 mb-1">City</label>
                      <input name="billingCity" type="text" className="input-field" defaultValue={mockCompany.billingCity} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-surface-500 mb-1">Country</label>
                      <input name="billingCountry" type="text" className="input-field" defaultValue={mockCompany.billingCountry} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-200">
                <h3 className="text-sm font-semibold text-surface-900 mb-3">Shipping Address</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1">Street</label>
                    <input name="shippingStreet" type="text" className="input-field" defaultValue={mockCompany.shippingStreet} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-surface-500 mb-1">City</label>
                      <input name="shippingCity" type="text" className="input-field" defaultValue={mockCompany.shippingCity} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-surface-500 mb-1">Country</label>
                      <input name="shippingCountry" type="text" className="input-field" defaultValue={mockCompany.shippingCountry} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-surface-200 mt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="glass-card bg-surface-900 border-surface-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-green/20 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-accent-green" />
            </div>
            <div>
              <p className="text-sm font-semibold">Company Record Exported</p>
              <p className="text-xs text-surface-400">PDF generated and sent to admin@antigravity.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
