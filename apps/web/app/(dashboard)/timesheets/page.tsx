'use client';

import { useState } from 'react';
import { Clock, UploadCloud, Calendar as CalendarIcon, FileText, CheckCircle2, DollarSign, Briefcase } from 'lucide-react';
import { demoDeals, demoCompanies } from '../../../lib/demo-data';

export default function TimesheetsPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [dealId, setDealId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  
  // Dummy local state for logged timesheets for the day
  const [loggedSheets, setLoggedSheets] = useState([
    { id: '1', startTime: '09:00', endTime: '11:00', duration: 2, description: 'On-site technical evaluation', companyName: 'Global Dynamics', status: 'pending' },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const calculateHours = (start: string, end: string) => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    return ((endH || 0) + (endM || 0) / 60) - ((startH || 0) + (startM || 0) / 60);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = calculateHours(startTime, endTime);
    const company = demoCompanies.find(c => c.id === companyId);
    
    setLoggedSheets([...loggedSheets, {
      id: Math.random().toString(36).substr(2, 9),
      startTime,
      endTime,
      duration,
      description,
      companyName: company?.name || 'Internal/Admin',
      status: 'pending'
    }]);

    // Reset form
    setStartTime(endTime);
    setEndTime('');
    setDescription('');
    setFiles([]);
    alert('Timesheet entry logged successfully!');
  };

  const totalHours = loggedSheets.reduce((sum, sheet) => sum + sheet.duration, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Daily Report & Timesheets</h1>
        <p className="text-sm text-surface-500 mt-1">Log your hours, activities, and upload evidence.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Log Entry Form */}
        <div className="xl:col-span-2">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6 text-brand-500">
              <Clock size={20} />
              <h2 className="text-lg font-bold text-surface-900">Log New Activity</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-surface-500 uppercase">Date</label>
                  <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-surface-500 uppercase">Start Time</label>
                  <input type="time" className="input-field" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-surface-500 uppercase">End Time</label>
                  <input type="time" className="input-field" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-surface-500 uppercase">Associated Enterprise</label>
                  <select className="input-field" value={companyId} onChange={e => setCompanyId(e.target.value)}>
                    <option value="">-- Internal / Admin --</option>
                    {demoCompanies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-surface-500 uppercase">Associated Deal</label>
                  <select className="input-field" value={dealId} onChange={e => setDealId(e.target.value)}>
                    <option value="">-- Select Deal --</option>
                    {demoDeals.filter(d => !companyId || d.company.name === demoCompanies.find(c => c.id === companyId)?.name).map(d => (
                      <option key={d.id} value={d.id}>{d.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-surface-500 uppercase">Activity Description</label>
                <textarea 
                  className="input-field min-h-[100px]" 
                  placeholder="Describe what was accomplished..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Media Upload Zone */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-surface-500 uppercase">Media Evidence (Photos, Receipts, Docs)</label>
                <div className="border-2 border-dashed border-surface-300 rounded-xl p-8 text-center hover:border-brand-500 hover:bg-brand-500/5 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud size={32} className="mx-auto mb-3 text-surface-400" />
                  <p className="font-medium text-surface-800">Drag & drop files or click to browse</p>
                  <p className="text-xs text-surface-500 mt-1">Support for Images, PDFs, and Videos up to 50MB</p>
                </div>
                
                {/* File Preview */}
                {files.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {files.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-surface-50 border border-surface-100">
                        <FileText size={20} className="text-brand-500 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-surface-900 truncate">{f.name}</p>
                          <p className="text-xs text-surface-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-surface-200">
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  <CheckCircle2 size={16} /> Submit Daily Report Entry
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Daily Summary */}
        <div className="xl:col-span-1 space-y-6">
          <div className="stat-card bg-gradient-to-br from-brand-600 to-brand-800 text-white border-none shadow-xl">
            <h3 className="text-sm font-medium opacity-80 uppercase tracking-wider mb-2">Total Hours Logged Today</h3>
            <div className="text-5xl font-bold">{totalHours.toFixed(1)}<span className="text-2xl opacity-60 ml-1">hrs</span></div>
            <p className="text-xs opacity-70 mt-2 text-brand-100">Target: 8.0 hours</p>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-surface-800 mb-4 uppercase tracking-wider">Today's Timeline</h3>
            
            <div className="space-y-4">
              {loggedSheets.length === 0 ? (
                <p className="text-sm text-surface-500 text-center py-4">No hours logged yet today.</p>
              ) : (
                loggedSheets.map(sheet => (
                  <div key={sheet.id} className="relative pl-6 border-l-2 border-brand-500 pb-4 last:pb-0">
                    <div className="absolute w-3 h-3 bg-brand-500 rounded-full -left-[7px] top-1 border-2 border-surface-50"></div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-brand-600">{sheet.startTime} - {sheet.endTime}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-100 text-surface-600">
                        {sheet.duration}h
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-surface-900">{sheet.companyName}</p>
                    <p className="text-xs text-surface-500 mt-1 line-clamp-2">{sheet.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
