'use client';

import { useState } from 'react';
import { Clock, Calendar, Info, FileText, Link2, ExternalLink } from 'lucide-react';
import { demoDailyReports } from '../../../lib/demo-data';

export default function ManagerViewPage() {
  const [showBenchmarks, setShowBenchmarks] = useState(true);
  
  // Custom Gantt Chart configuration
  const startHour = 8;
  const endHour = 18;
  const totalHours = endHour - startHour;
  const hourMarkers = Array.from({ length: totalHours + 1 }, (_, i) => startHour + i);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Manager View</h1>
          <p className="text-surface-500 mt-2">Daily activity reports, time tracking, and resource allocation.</p>
        </div>
        <button 
          onClick={() => setShowBenchmarks(!showBenchmarks)}
          className={`btn-ghost ${showBenchmarks ? 'bg-surface-200 text-surface-900' : ''}`}
        >
          <Info size={16} /> Industry Benchmarks
        </button>
      </div>

      {showBenchmarks && (
        <div className="glass-card p-6 bg-gradient-to-r from-brand-50 to-surface-50 border border-brand-100">
          <div className="flex items-center gap-2 mb-4 text-brand-600">
            <Info size={20} />
            <h2 className="font-bold uppercase tracking-wider text-sm">Enterprise CRM Standards</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-bold text-surface-900 flex items-center gap-1">Microsoft Dynamics 365 <ExternalLink size={12} className="text-surface-400"/></h3>
              <p className="text-sm text-surface-600">Utilizes the <strong>Project Operations</strong> module for time entry and task tracking. Interactions are logged via the 'Activities' entity. Gantt charts are a core native feature for visual scheduling.</p>
            </div>
            <div className="space-y-2 border-l border-surface-200 pl-6">
              <h3 className="font-bold text-surface-900 flex items-center gap-1">Odoo CRM <ExternalLink size={12} className="text-surface-400"/></h3>
              <p className="text-sm text-surface-600">No single "Daily Report" button. Relies on logging <strong>Activities</strong> (calls, meetings) tied to the Timesheets app. Managers use Dashboards to filter activities by "Today".</p>
            </div>
            <div className="space-y-2 border-l border-surface-200 pl-6">
              <h3 className="font-bold text-surface-900 flex items-center gap-1">Oracle CRM <ExternalLink size={12} className="text-surface-400"/></h3>
              <p className="text-sm text-surface-600">Relies heavily on <strong>CRM Interaction Activity</strong> for real-time tracking of communications. Provides robust Gantt visualizations within Oracle Analytics and Siebel modules.</p>
            </div>
          </div>
        </div>
      )}

      {/* Gantt Chart Container */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-surface-200 flex items-center justify-between bg-surface-50">
          <div className="flex items-center gap-2 font-bold text-surface-800">
            <Calendar size={18} className="text-brand-500" />
            May 24, 2026
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-surface-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-brand-500"></span> Meetings</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-accent-purple"></span> Deep Work</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-surface-300"></span> Idle</span>
          </div>
        </div>

        <div className="p-6 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Timeline Header */}
            <div className="flex mb-4 pl-48 relative">
              {hourMarkers.map((hour) => (
                <div key={hour} className="flex-1 text-xs font-bold text-surface-400 relative">
                  <span className="absolute -translate-x-1/2">
                    {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                  </span>
                </div>
              ))}
            </div>

            {/* Gantt Rows */}
            <div className="space-y-6">
              {demoDailyReports.map((report) => (
                <div key={report.id} className="relative">
                  <div className="flex items-center">
                    {/* Employee Info */}
                    <div className="w-48 pr-4 shrink-0">
                      <p className="font-bold text-surface-900">{report.employeeName}</p>
                      <p className="text-xs text-surface-500">{report.timeEntries.length} logged tasks</p>
                    </div>

                    {/* Timeline Grid */}
                    <div className="flex-1 h-12 bg-surface-50 rounded-lg relative border border-surface-100 flex">
                      {/* Grid Lines */}
                      {Array.from({ length: totalHours }).map((_, i) => (
                        <div key={i} className="flex-1 border-r border-surface-200 border-dashed last:border-0 h-full" />
                      ))}

                      {/* Time Entry Blocks */}
                      {report.timeEntries.map((entry, idx) => {
                        const leftPercent = ((entry.startHour - startHour) / totalHours) * 100;
                        const widthPercent = ((entry.endHour - entry.startHour) / totalHours) * 100;
                        const colors = ['bg-brand-500', 'bg-accent-purple', 'bg-accent-cyan'];
                        
                        return (
                          <div 
                            key={entry.id}
                            className={`absolute top-1 bottom-1 rounded-md shadow-sm ${colors[idx % colors.length]} bg-opacity-90 hover:bg-opacity-100 transition-all cursor-help group`}
                            style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                          >
                            <span className="absolute inset-0 flex items-center px-2 text-xs font-bold text-white truncate">
                              {entry.title}
                            </span>
                            
                            {/* Hover Tooltip */}
                            <div className="absolute top-full left-0 mt-2 w-64 bg-surface-900 text-white p-3 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                              <p className="font-bold mb-1">{entry.title}</p>
                              <p className="text-xs text-surface-300 mb-2">
                                {entry.startHour > 12 ? entry.startHour - 12 : entry.startHour}:00 - {entry.endHour > 12 ? entry.endHour - 12 : entry.endHour}:00
                              </p>
                              <div className="text-xs space-y-1">
                                {report.linkedContacts.length > 0 && (
                                  <p className="flex items-center gap-1"><Link2 size={10} /> {report.linkedContacts.map(c => c.name).join(', ')}</p>
                                )}
                                {report.mediaAttachments.length > 0 && (
                                  <p className="flex items-center gap-1 text-brand-300"><FileText size={10} /> {report.mediaAttachments.length} attachments</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Daily Report Summary Expandable */}
                  <div className="ml-48 mt-2 p-3 bg-surface-50 rounded-lg text-sm border border-surface-200">
                    <p className="text-surface-700"><span className="font-semibold text-surface-900">Today's Summary:</span> {report.description}</p>
                    
                    {(report.linkedContacts.length > 0 || report.mediaAttachments.length > 0) && (
                      <div className="mt-3 flex flex-wrap gap-4 pt-3 border-t border-surface-200">
                        {report.linkedContacts.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-surface-500 uppercase">Linked:</span>
                            {report.linkedContacts.map(c => (
                              <span key={c.id} className="text-xs px-2 py-1 bg-white border border-surface-200 rounded-md shadow-sm font-medium">{c.name}</span>
                            ))}
                          </div>
                        )}
                        {report.mediaAttachments.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-surface-500 uppercase">Media:</span>
                            {report.mediaAttachments.map(m => (
                              <span key={m.id} className="text-xs px-2 py-1 bg-brand-50 border border-brand-100 text-brand-600 rounded-md shadow-sm font-medium flex items-center gap-1">
                                <FileText size={12} /> {m.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
