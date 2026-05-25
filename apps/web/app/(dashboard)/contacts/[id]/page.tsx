'use client';

import { useState } from 'react';
import { useContact } from '../../../../hooks/use-api';
import { Mail, Phone, MapPin, Building2, Globe, Linkedin, Twitter, ArrowLeft, Loader2, Edit3, MessageSquare, Briefcase, Calendar, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, getScoreColor, getStatusBadge, getInitials, timeAgo } from '../../../../lib/utils';
import { demoContacts } from '../../../../lib/demo-data'; // Fallback

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'timeline' | 'deals' | 'notes'>('overview');
  
  const { data, isLoading, error } = useContact(params.id);

  // Fallback to demo data if API fails (offline DB)
  const contact: any = (data?.data) || demoContacts.find(c => c.id === params.id) || demoContacts[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertCircle size={48} className="text-surface-400" />
        <h2 className="text-xl font-bold text-surface-900">Contact Not Found</h2>
        <Link href="/contacts" className="btn-primary">Back to Contacts</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Top Breadcrumb */}
      <div>
        <Link href="/contacts" className="inline-flex items-center text-sm font-medium text-surface-500 hover:text-surface-900 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Contacts
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: 360 Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-400/20 to-accent-purple/20 border-2 border-surface-200 flex items-center justify-center text-3xl font-bold text-brand-400 mb-4">
                {getInitials(`${contact.firstName} ${contact.lastName}`)}
              </div>
              <h1 className="text-2xl font-bold text-surface-900">{contact.firstName} {contact.lastName}</h1>
              <p className="text-brand-400 font-medium mt-1">{contact.title || 'No Title'}</p>
              
              <div className="flex items-center gap-2 mt-2 text-surface-500">
                <Building2 size={16} />
                <span>{contact.company?.name || 'Unknown Company'}</span>
              </div>

              <div className="flex gap-2 mt-4">
                <span className={`badge ${getStatusBadge(contact.status)} text-sm px-3 py-1`}>
                  {contact.status}
                </span>
                <span className={`score-ring ${getScoreColor(contact.leadScore)}`}>
                  {contact.leadScore}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-surface-200">
              <button className="flex-1 btn-primary py-2 justify-center"><Mail size={16} /> Email</button>
              <button className="flex-1 btn-secondary py-2 justify-center"><Phone size={16} /> Call</button>
            </div>

            <div className="mt-6 space-y-4 pt-6 border-t border-surface-200 text-sm">
              <div className="flex items-start gap-3 text-surface-600">
                <Mail size={16} className="mt-0.5 text-surface-400" />
                <span className="break-all">{contact.email || '--'}</span>
              </div>
              <div className="flex items-start gap-3 text-surface-600">
                <Phone size={16} className="mt-0.5 text-surface-400" />
                <span>{contact.phone || contact.mobile || '--'}</span>
              </div>
              <div className="flex items-start gap-3 text-surface-600">
                <MapPin size={16} className="mt-0.5 text-surface-400" />
                <span>
                  {[contact.street, contact.city, contact.state, contact.country].filter(Boolean).join(', ') || '--'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-surface-200">
              {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-surface-100 rounded-full text-[#0A66C2] hover:bg-surface-200"><Linkedin size={18} /></a>}
              {contact.twitter && <a href={contact.twitter} target="_blank" rel="noreferrer" className="p-2 bg-surface-100 rounded-full text-[#1DA1F2] hover:bg-surface-200"><Twitter size={18} /></a>}
            </div>
          </div>
          
          {/* Quick Stats Card */}
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
             <h3 className="text-sm font-bold text-surface-900 uppercase tracking-wider mb-4">Key Metrics</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-surface-500">Relationship Score</span>
                  <span className="font-semibold text-brand-400">{contact.relationshipScore}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-surface-500">Active Deals</span>
                  <span className="font-semibold text-surface-900">{contact.deals?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-surface-500">Last Activity</span>
                  <span className="text-sm text-surface-900">
                    {contact.activities?.[0] ? timeAgo(contact.activities[0].createdAt) : 'Never'}
                  </span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Pane: Main Content Tabs */}
        <div className="lg:col-span-8 flex flex-col min-h-[600px]">
          {/* Custom Tab Navigation */}
          <div className="flex space-x-1 p-1 bg-surface-200 rounded-xl mb-6">
            {(['overview', 'details', 'timeline', 'deals', 'notes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg capitalize transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-surface-900 shadow-sm border border-surface-200' 
                    : 'text-surface-500 hover:text-surface-700 hover:bg-surface-200/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 glass-card p-6 animate-fade-in relative">
            {activeTab === 'details' && (
              <div className="space-y-8 animate-slide-up">
                <div className="flex items-center justify-between mb-4 border-b border-surface-200 pb-2">
                  <h3 className="text-lg font-bold text-surface-900">Detailed Information</h3>
                  <button className="btn-ghost text-brand-400 text-sm"><Edit3 size={14} className="mr-1" /> Edit</button>
                </div>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  {/* Contact Info */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">First Name</label>
                    <p className="text-sm font-medium text-surface-900">{contact.firstName || '--'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Last Name</label>
                    <p className="text-sm font-medium text-surface-900">{contact.lastName || '--'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Job Title / Designation</label>
                    <p className="text-sm font-medium text-surface-900">{contact.title || '--'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Department</label>
                    <p className="text-sm font-medium text-surface-900">{contact.department || '--'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Email Address</label>
                    <p className="text-sm font-medium text-brand-400 hover:underline cursor-pointer">{contact.email || '--'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Mobile Phone</label>
                    <p className="text-sm font-medium text-surface-900">{contact.mobile || '--'}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-surface-200 grid grid-cols-2 gap-y-6 gap-x-8">
                  {/* Address Info */}
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Street Address</label>
                    <p className="text-sm font-medium text-surface-900">{contact.street || '--'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">City</label>
                    <p className="text-sm font-medium text-surface-900">{contact.city || '--'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">State / Province</label>
                    <p className="text-sm font-medium text-surface-900">{contact.state || '--'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Zip / Postal Code</label>
                    <p className="text-sm font-medium text-surface-900">{contact.zip || '--'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Country</label>
                    <p className="text-sm font-medium text-surface-900">{contact.country || '--'}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-surface-200 grid grid-cols-2 gap-y-6 gap-x-8">
                  {/* Preferences */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Email Opt Out</label>
                    <p className="text-sm font-medium text-surface-900">{contact.emailOptOut ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Do Not Call</label>
                    <p className="text-sm font-medium text-surface-900">{contact.doNotCall ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Contact Source</label>
                    <p className="text-sm font-medium text-surface-900 capitalize">{contact.source?.replace('_', ' ') || '--'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Owner</label>
                    <div className="flex items-center gap-2 mt-1">
                       <div className="w-5 h-5 rounded-full bg-surface-200 flex items-center justify-center text-[10px] font-bold text-surface-600">
                         {getInitials(contact.owner?.name || 'U')}
                       </div>
                       <p className="text-sm font-medium text-surface-900">{contact.owner?.name || '--'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
               <div className="space-y-6 animate-slide-up">
                  <h3 className="text-lg font-bold text-surface-900 border-b border-surface-200 pb-2">Activity Timeline</h3>
                  <div className="relative border-l-2 border-surface-200 ml-4 space-y-8 pb-8">
                    {contact.activities?.length > 0 ? contact.activities.map((act: any, i: number) => (
                      <div key={i} className="relative pl-6">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-brand-400"></div>
                        <div className="bg-surface-50 rounded-xl p-4 border border-surface-200">
                          <div className="flex items-center justify-between mb-2">
                             <span className="text-xs font-bold uppercase text-brand-400 tracking-wider">{act.type}</span>
                             <span className="text-xs text-surface-500">{timeAgo(act.createdAt)}</span>
                          </div>
                          <p className="text-sm font-medium text-surface-900">{act.subject}</p>
                          {act.summary && <p className="text-sm text-surface-600 mt-1">{act.summary}</p>}
                        </div>
                      </div>
                    )) : (
                      <p className="pl-6 text-sm text-surface-500">No activities recorded yet.</p>
                    )}
                  </div>
               </div>
            )}

            {activeTab === 'deals' && (
              <div className="space-y-4 animate-slide-up">
                <div className="flex items-center justify-between mb-4 border-b border-surface-200 pb-2">
                  <h3 className="text-lg font-bold text-surface-900">Associated Deals</h3>
                  <button className="btn-secondary text-sm"><Briefcase size={14} className="mr-1" /> New Deal</button>
                </div>
                {contact.deals?.length > 0 ? (
                  <div className="grid gap-3">
                    {contact.deals.map((deal: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-surface-200 hover:border-brand-400/50 transition-colors bg-surface-50">
                        <div>
                          <p className="font-semibold text-surface-900">{deal.title}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-surface-500">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{backgroundColor: deal.stage?.color || '#ccc'}}></span> {deal.stage?.name}</span>
                            <span>{deal.closeDate ? timeAgo(deal.closeDate) : 'No close date'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-surface-900">{formatCurrency(deal.value, deal.currency)}</p>
                          <p className="text-xs font-medium text-brand-400">{deal.winProbability}% win prob</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-surface-500">
                    <Briefcase size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No active deals</p>
                  </div>
                )}
              </div>
            )}

            {(activeTab === 'overview' || activeTab === 'notes') && (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-surface-500 animate-fade-in">
                <MessageSquare size={32} className="mb-3 opacity-50" />
                <p className="font-medium">No {activeTab} data available</p>
                <p className="text-sm mt-1">This section is pending full implementation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
