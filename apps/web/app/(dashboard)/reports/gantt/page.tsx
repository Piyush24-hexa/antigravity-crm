'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, Filter, Building2, MapPin } from 'lucide-react';
import { RoleGuard } from '../../../../components/RoleGuard';

// Mock data for the Gantt chart
const employees = [
  { id: '1', name: 'Alex Chen', role: 'Enterprise Account Executive', avatar: 'AC' },
  { id: '2', name: 'Sarah Miller', role: 'Senior Sales Representative', avatar: 'SM' },
  { id: '3', name: 'James Park', role: 'Sales Development Rep', avatar: 'JP' },
  { id: '4', name: 'Emily Watson', role: 'Solutions Architect', avatar: 'EW' },
];

const mockActivities = [
  { id: 'a1', empId: '1', title: 'TechVentures Negotiation', type: 'meeting', startHour: 9, duration: 1.5, color: 'bg-accent-purple', company: 'TechVentures Inc' },
  { id: 'a2', empId: '1', title: 'Proposal Drafting', type: 'task', startHour: 11, duration: 2, color: 'bg-brand-500', company: 'Global Dynamics' },
  { id: 'a3', empId: '1', title: 'Internal Sync', type: 'internal', startHour: 14, duration: 1, color: 'bg-surface-400', company: 'Internal' },
  { id: 'a4', empId: '2', title: 'On-site Demonstration', type: 'travel', startHour: 10, duration: 4, color: 'bg-accent-cyan', company: 'Quantum Finance' },
  { id: 'a5', empId: '2', title: 'Follow-up Calls', type: 'task', startHour: 15, duration: 2, color: 'bg-brand-500', company: 'Multiple' },
  { id: 'a6', empId: '3', title: 'Cold Outreach Block', type: 'task', startHour: 9, duration: 3, color: 'bg-brand-500', company: 'Multiple' },
  { id: 'a7', empId: '3', title: 'Lead Qualification', type: 'meeting', startHour: 13, duration: 1.5, color: 'bg-accent-purple', company: 'EcoSmart Solutions' },
  { id: 'a8', empId: '4', title: 'Technical Architecture Review', type: 'meeting', startHour: 10, duration: 2.5, color: 'bg-accent-orange', company: 'Apex Retail Group' },
  { id: 'a9', empId: '4', title: 'Security Compliance Audit', type: 'task', startHour: 14, duration: 3, color: 'bg-accent-green', company: 'DataStream Analytics' },
];

const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export default function GanttChartPage() {
  const [date, setDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getPositionStyles = (startHour: number, duration: number) => {
    // 8 AM is the start, each hour is 1 unit.
    const offset = startHour - 8;
    const leftPercent = (offset / (hours.length - 1)) * 100;
    const widthPercent = (duration / (hours.length - 1)) * 100;
    
    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
    };
  };

  return (
    <RoleGuard allowedRoles={['admin', 'manager']}>
      <div className="space-y-6 animate-fade-in pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Resource Timeline</h1>
            <p className="text-sm text-surface-500 mt-1">Enterprise-grade daily schedule and timesheet visualization.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-surface-100 rounded-lg p-1 border border-surface-200">
              <button 
                onClick={() => setDate(new Date(date.setDate(date.getDate() - 1)))}
                className="p-1 hover:bg-surface-200 rounded text-surface-600"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="px-4 text-sm font-semibold text-surface-900 min-w-[180px] text-center flex items-center justify-center gap-2">
                <Calendar size={14} className="text-brand-500" />
                {formatDate(date)}
              </div>
              <button 
                onClick={() => setDate(new Date(date.setDate(date.getDate() + 1)))}
                className="p-1 hover:bg-surface-200 rounded text-surface-600"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            
            <button className="btn-secondary">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 px-4 py-3 glass-card text-xs font-semibold text-surface-600 uppercase tracking-wider">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-accent-purple"></div> Meetings & Calls</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-brand-500"></div> Focused Tasks</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-accent-cyan"></div> On-site / Travel</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-accent-orange"></div> Technical Work</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-surface-400"></div> Internal / Admin</div>
        </div>

        {/* Gantt Chart Area */}
        <div className="glass-card overflow-hidden">
          
          {/* Header Row (Time Scale) */}
          <div className="flex border-b border-surface-200 bg-surface-50/50">
            <div className="w-64 shrink-0 p-4 border-r border-surface-200 flex items-center">
              <span className="text-xs font-bold text-surface-500 uppercase">Resources ({employees.length})</span>
            </div>
            <div className="flex-1 relative flex">
              {hours.map((hour, idx) => (
                <div key={hour} className="flex-1 border-r border-surface-200 last:border-r-0 py-2">
                  <div className="text-xs font-semibold text-surface-500 text-center">
                    {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Rows */}
          <div className="divide-y divide-surface-200">
            {employees.map(emp => {
              const empActivities = mockActivities.filter(a => a.empId === emp.id);
              
              return (
                <div key={emp.id} className="flex min-h-[80px] hover:bg-surface-50/30 transition-colors">
                  
                  {/* Employee Info Sidebar */}
                  <div className="w-64 shrink-0 p-4 border-r border-surface-200 bg-surface-50/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center font-bold text-brand-600 text-sm">
                        {emp.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-surface-900 truncate">{emp.name}</p>
                        <p className="text-xs text-surface-500 truncate">{emp.role}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs font-medium text-surface-500">
                      <div className="flex items-center gap-1"><Clock size={12} /> {empActivities.reduce((s, a) => s + a.duration, 0)}h</div>
                      <div className="flex items-center gap-1 text-accent-green"><CheckCircle2 size={12} /> {empActivities.length} logs</div>
                    </div>
                  </div>

                  {/* Timeline Grid */}
                  <div className="flex-1 relative">
                    {/* Vertical Grid Lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {hours.map((hour) => (
                        <div key={hour} className="flex-1 border-r border-surface-200/50 last:border-r-0"></div>
                      ))}
                    </div>

                    {/* Activity Blocks */}
                    <div className="absolute inset-0 py-3">
                      {empActivities.map(activity => (
                        <div 
                          key={activity.id}
                          className={`absolute h-12 ${activity.color} rounded-md shadow-sm border border-black/10 overflow-hidden cursor-pointer hover:ring-2 hover:ring-brand-400 hover:ring-offset-2 hover:ring-offset-surface-50 transition-all group`}
                          style={getPositionStyles(activity.startHour, activity.duration)}
                        >
                          <div className="px-2 py-1.5 h-full flex flex-col justify-center">
                            <p className="text-xs font-bold text-white truncate drop-shadow-md">{activity.title}</p>
                            <div className="flex items-center gap-1 opacity-90">
                              <Building2 size={10} className="text-white" />
                              <p className="text-[10px] text-white truncate font-medium">{activity.company}</p>
                            </div>
                          </div>

                          {/* Hover Tooltip (Simulated) */}
                          <div className="hidden group-hover:block absolute z-10 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-surface-900 text-white p-3 rounded-lg shadow-xl text-xs w-48 pointer-events-none">
                            <p className="font-bold mb-1">{activity.title}</p>
                            <p className="text-surface-400 mb-2">{activity.company}</p>
                            <div className="flex justify-between items-center text-surface-300">
                              <span>Duration:</span>
                              <span className="font-semibold text-white">{activity.duration}h</span>
                            </div>
                            <div className="flex justify-between items-center text-surface-300 mt-1">
                              <span>Status:</span>
                              <span className="font-semibold text-accent-green">Logged & Verified</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </RoleGuard>
  );
}

// Dummy lucide icons needed
import { CheckCircle2 } from 'lucide-react';
