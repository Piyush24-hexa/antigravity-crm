'use client';

import { useState } from 'react';
import { Search, Filter, Plus, Download, MoreHorizontal, Mail, Phone, ArrowUpDown, Loader2, X, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { useContacts, useCreateContact } from '../../../hooks/use-api';
import { formatCurrency, getScoreColor, getStatusBadge, getInitials, timeAgo } from '../../../lib/utils';
import { useRouter } from 'next/navigation';

export default function ContactsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const createContact = useCreateContact();
  const router = useRouter();

  const { data, isLoading, error } = useContacts({
    search: search || undefined,
    status: statusFilter !== 'all' ? (statusFilter as 'lead' | 'prospect' | 'customer' | 'churned') : undefined,
    page: 1,
    limit: 50,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const contacts = (data?.data as any[]) || [];

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(cId => cId !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    // Simulate backend CSV generation and email dispatch
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccessMessage(`Successfully exported ${selectedContacts.length > 0 ? selectedContacts.length : contacts.length} contacts. Email sent to admin@antigravity.com.`);
      setSelectedContacts([]);
      
      // Auto-hide success toast after 5s
      setTimeout(() => setExportSuccessMessage(null), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Toast Notification */}
      {exportSuccessMessage && (
        <div className="fixed bottom-6 right-6 bg-surface-900 border border-surface-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50">
          <CheckCircle2 size={18} className="text-accent-green" />
          <p className="text-sm font-medium">{exportSuccessMessage}</p>
          <button onClick={() => setExportSuccessMessage(null)} className="p-1 hover:bg-surface-700 rounded-md ml-4 text-surface-400 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Contacts</h1>
          <p className="text-sm text-surface-500 mt-1">
            {isLoading ? 'Loading...' : `${(data as any)?.meta?.total ?? contacts.length} contacts found`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="btn-secondary transition-all min-w-[100px]" 
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 size={16} className="animate-spin mx-auto" />
            ) : (
              <>
                <Download size={16} />
                {selectedContacts.length > 0 ? `Export Selected (${selectedContacts.length})` : 'Export All'}
              </>
            )}
          </button>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            Add Contact
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            className="input-field pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'lead', 'prospect', 'customer', 'churned'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === s
                  ? 'bg-brand-500/15 text-brand-400'
                  : 'text-surface-500 hover:bg-surface-200'
              }`}
            >
              {s === 'all' ? 'All' : s}
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
                <th className="table-header text-center px-4 py-3 w-12">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-brand-500 border-surface-300 focus:ring-brand-500 cursor-pointer"
                    checked={contacts.length > 0 && selectedContacts.length === contacts.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="table-header text-left px-4 py-3">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-surface-700">
                    Contact <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="table-header text-left px-4 py-3">Company</th>
                <th className="table-header text-left px-4 py-3">Status</th>
                <th className="table-header text-center px-4 py-3">Lead Score</th>
                <th className="table-header text-left px-4 py-3">Owner</th>
                <th className="table-header text-left px-4 py-3">Source</th>
                <th className="table-header text-left px-4 py-3">Added</th>
                <th className="table-header text-center px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-surface-500">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Loading contacts...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-surface-500">
                    No contacts found.
                  </td>
                </tr>
              ) : (
                contacts.map((contact, i) => (
                  <tr
                    key={contact.id}
                    className="table-row cursor-pointer"
                    style={{ animationDelay: `${i * 30}ms` }}
                    onClick={() => router.push(`/contacts/${contact.id}`)}
                  >
                  <td className="table-cell text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded text-brand-500 border-surface-300 focus:ring-brand-500 cursor-pointer"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleSelectOne(contact.id)}
                    />
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400/20 to-accent-purple/20 border border-surface-300 flex items-center justify-center text-xs font-semibold text-brand-400">
                        {getInitials(`${contact.firstName} ${contact.lastName}`)}
                      </div>
                      <div>
                        <p className="font-medium text-surface-800">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-surface-500">{contact.email}</p>
                          {contact.title && (
                            <>
                              <span className="text-surface-300">•</span>
                              <p className="text-xs text-brand-400 font-medium">{contact.title}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-surface-700">{contact.company.name}</span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${getStatusBadge(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <span className={`score-ring ${getScoreColor(contact.leadScore)}`}>
                      {contact.leadScore}
                    </span>
                  </td>
                  <td className="table-cell text-surface-600">{contact.owner.name}</td>
                  <td className="table-cell">
                    <span className="text-xs text-surface-500 capitalize">{contact.source.replace('_', ' ')}</span>
                  </td>
                  <td className="table-cell text-surface-500 text-xs">
                    {timeAgo(contact.createdAt)}
                  </td>
                  <td className="table-cell text-center">
                    <button className="btn-ghost p-1">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200">
          <p className="text-xs text-surface-500">
            Showing {contacts.length} of {(data as any)?.meta?.total ?? contacts.length}
          </p>
          <div className="flex items-center gap-1">
            <button className="btn-ghost text-xs px-3 py-1" disabled>Previous</button>
            <button className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-500/15 text-brand-400">1</button>
            <button className="btn-ghost text-xs px-3 py-1" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-0/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-surface-900">Add New Contact</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost p-1 rounded-lg hover:bg-surface-200">
                <X size={20} />
              </button>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                createContact.mutate(
                  {
                    firstName: fd.get('firstName') as string,
                    lastName: fd.get('lastName') as string,
                    email: fd.get('email') as string,
                    phone: fd.get('phone') as string,
                    title: fd.get('title') as string,
                    linkedin: fd.get('linkedin') as string,
                    source: 'manual',
                    status: 'lead',
                    doNotCall: fd.get('doNotCall') === 'on',
                    emailOptOut: fd.get('emailOptOut') === 'on',
                    companyId: (fd.get('companyId') as string) || undefined,
                    tags: [],
                    customFields: {},
                  },
                  {
                    onSuccess: () => setIsModalOpen(false),
                    onError: (err) => alert('Failed to create contact: ' + err.message)
                  }
                );
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">First Name</label>
                  <input required name="firstName" type="text" className="input-field" placeholder="Jane" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Last Name</label>
                  <input required name="lastName" type="text" className="input-field" placeholder="Doe" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1">Email Address</label>
                <input required name="email" type="email" className="input-field" placeholder="jane@example.com" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Phone Number</label>
                  <input name="phone" type="tel" className="input-field" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Job Title</label>
                  <input name="title" type="text" className="input-field" placeholder="VP of Sales" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">LinkedIn Profile</label>
                  <input name="linkedin" type="url" className="input-field" placeholder="https://linkedin.com/in/jane-doe" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Company</label>
                  <select name="companyId" className="input-field cursor-pointer appearance-none">
                    <option value="">Select Company (Optional)</option>
                    <option value="11111111-1111-1111-1111-111111111111">Acme Corp</option>
                    <option value="22222222-2222-2222-2222-222222222222">Global Tech</option>
                    <option value="33333333-3333-3333-3333-333333333333">Stark Industries</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === 'address' ? null : 'address')}
                  className="flex items-center justify-between w-full p-3 bg-surface-50 rounded-lg border border-surface-200 hover:border-brand-300 transition-colors"
                >
                  <span className="text-sm font-semibold text-surface-800">Address Information</span>
                  {expandedSection === 'address' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSection === 'address' && (
                  <div className="p-4 border border-t-0 border-surface-200 rounded-b-lg bg-white space-y-4 animate-slide-up">
                    <div>
                      <label className="block text-xs font-medium text-surface-500 mb-1">Street Address</label>
                      <input name="street" type="text" className="input-field" placeholder="123 Main St" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-surface-500 mb-1">City</label>
                        <input name="city" type="text" className="input-field" placeholder="San Francisco" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-surface-500 mb-1">State</label>
                        <input name="state" type="text" className="input-field" placeholder="CA" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-surface-500 mb-1">Zip Code</label>
                        <input name="zip" type="text" className="input-field" placeholder="94105" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-surface-500 mb-1">Country</label>
                        <input name="country" type="text" className="input-field" placeholder="USA" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === 'preferences' ? null : 'preferences')}
                  className="flex items-center justify-between w-full p-3 bg-surface-50 rounded-lg border border-surface-200 hover:border-brand-300 transition-colors"
                >
                  <span className="text-sm font-semibold text-surface-800">Communication Preferences</span>
                  {expandedSection === 'preferences' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSection === 'preferences' && (
                  <div className="p-4 border border-t-0 border-surface-200 rounded-b-lg bg-white space-y-4 animate-slide-up">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="emailOptOut" className="w-4 h-4 rounded text-brand-500 border-surface-300 focus:ring-brand-500" />
                      <span className="text-sm text-surface-700">Email Opt Out (Do not send marketing emails)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="doNotCall" className="w-4 h-4 rounded text-brand-500 border-surface-300 focus:ring-brand-500" />
                      <span className="text-sm text-surface-700">Do Not Call</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-surface-200 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" disabled={createContact.isPending} className="btn-primary">
                  {createContact.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
