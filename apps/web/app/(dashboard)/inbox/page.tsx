'use client';

import { Mail, Inbox, Send, Archive, Star } from 'lucide-react';

export default function InboxPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Inbox</h1>
        <p className="text-sm text-surface-500 mt-1">Unified inbox — email, SMS, WhatsApp in one view</p>
      </div>

      <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-purple/20 flex items-center justify-center mb-4">
          <Mail size={28} className="text-brand-400" />
        </div>
        <h3 className="text-lg font-semibold text-surface-800 mb-2">Unified Inbox Coming in Phase 2</h3>
        <p className="text-sm text-surface-500 max-w-md">
          Two-way email sync with Gmail & Outlook, threaded conversations, AI-powered reply suggestions, 
          and sequence management — all in one place.
        </p>
        <div className="flex items-center gap-4 mt-6">
          {[
            { icon: Inbox, label: 'Inbound' },
            { icon: Send, label: 'Outbound' },
            { icon: Archive, label: 'Archived' },
            { icon: Star, label: 'Starred' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-200/50 text-surface-500 text-sm">
              <Icon size={16} /> {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
