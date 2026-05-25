'use client';

import { useState } from 'react';
import { Upload, Plus, Search, FileText, CheckCircle2, User, Building } from 'lucide-react';
import { demoContacts, demoCompanies } from '../../../lib/demo-data';

export default function DailyReportPage() {
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [linkedEntities, setLinkedEntities] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filteredEntities = [...demoContacts, ...demoCompanies].filter(entity => {
    const name = 'firstName' in entity ? `${entity.firstName} ${entity.lastName}` : entity.name;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  }).slice(0, 5);

  const handleLinkEntity = (entity: any) => {
    if (!linkedEntities.find(e => e.id === entity.id)) {
      setLinkedEntities([...linkedEntities, entity]);
    }
    setSearchQuery('');
  };

  const removeEntity = (id: string) => {
    setLinkedEntities(linkedEntities.filter(e => e.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setDescription('');
      setLinkedEntities([]);
      setFiles([]);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-16 h-16 bg-accent-green/20 text-accent-green rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 mb-2">Report Submitted</h2>
        <p className="text-surface-500 mb-8 text-center max-w-md">
          Your daily report and timesheets have been successfully logged and sent to your manager's Gantt board.
        </p>
        <button className="btn-primary" onClick={() => setSubmitted(false)}>
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold text-surface-900">Daily Report</h1>
        <p className="text-surface-500 mt-2">Log your daily activities, update timesheets, and attach relevant customer media.</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        {/* Activity Summary */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-surface-900 uppercase tracking-wider">What did you accomplish today?</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field min-h-[150px] resize-y text-base"
            placeholder="E.g., Contacted TechVentures regarding their platform license expansion. Sent over the new pricing sheet..."
          />
        </div>

        {/* Tag Customers / Leads */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-surface-900 uppercase tracking-wider">Tag Customers & Leads</label>
            <button className="text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1">
              <Plus size={14} /> Quick Create Lead
            </button>
          </div>
          
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
            <input 
              type="text" 
              placeholder="Search contacts or companies..." 
              className="input-field pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {searchQuery && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-surface-200 rounded-xl shadow-xl overflow-hidden">
                {filteredEntities.map((entity, idx) => (
                  <button 
                    key={idx}
                    className="w-full text-left px-4 py-3 hover:bg-surface-50 flex items-center gap-3 border-b border-surface-100 last:border-0"
                    onClick={() => handleLinkEntity(entity)}
                  >
                    {'firstName' in entity ? <User size={16} className="text-accent-purple" /> : <Building size={16} className="text-accent-cyan" />}
                    <span className="font-medium text-surface-900">
                      {'firstName' in entity ? `${entity.firstName} ${entity.lastName}` : entity.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Entities */}
          {linkedEntities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {linkedEntities.map((entity, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-surface-100 rounded-lg border border-surface-200">
                  <span className="text-sm font-medium text-surface-800">
                    {'firstName' in entity ? `${entity.firstName} ${entity.lastName}` : entity.name}
                  </span>
                  <button onClick={() => removeEntity(entity.id)} className="text-surface-400 hover:text-red-500">
                    <Plus size={14} className="rotate-45" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Media Upload */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-surface-900 uppercase tracking-wider">Attachments & Media</label>
          <div className="border-2 border-dashed border-surface-300 rounded-2xl p-8 text-center hover:bg-surface-50 transition-colors relative">
            <input 
              type="file" 
              multiple 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
            <Upload size={32} className="mx-auto mb-4 text-surface-400" />
            <p className="font-medium text-surface-800 mb-1">Drop files here or click to upload</p>
            <p className="text-xs text-surface-500">Supports PDF, Images, Video, Audio (Max 50MB)</p>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl border border-surface-200">
                  <FileText size={16} className="text-brand-500" />
                  <span className="text-sm font-medium text-surface-800 flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-surface-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <button 
                    onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                    className="text-surface-400 hover:text-red-500"
                  >
                    <Plus size={14} className="rotate-45" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-surface-200 flex justify-end gap-3">
          <button className="btn-secondary">Save as Draft</button>
          <button 
            className="btn-primary min-w-[120px]" 
            onClick={handleSubmit}
            disabled={isSubmitting || !description}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
