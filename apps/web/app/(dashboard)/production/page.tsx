'use client';

import { useState, useEffect, useMemo } from 'react';
import { workOrdersApi } from '../../../lib/api';
import Link from 'next/link';
import { Loader2, Plus, LayoutGrid, Calendar as CalendarIcon, GripVertical } from 'lucide-react';
import { useAppStore } from '../../../lib/store';
import { addDays, format, differenceInDays, isSameDay, startOfDay } from 'date-fns';

const STATUSES = ['pending', 'released', 'in_progress', 'qc', 'completed', 'cancelled'];

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-slate-100 text-slate-600',
  released:   'bg-blue-50 text-blue-700',
  in_progress:'bg-teal-50 text-teal-700',
  qc:         'bg-amber-50 text-amber-700',
  completed:  'bg-green-50 text-green-700',
  cancelled:  'bg-red-50 text-red-600',
};

const STATUS_BAR: Record<string, string> = {
  pending:    '#94a3b8',
  released:   '#3b82f6',
  in_progress:'#0ab5a0',
  qc:         '#f59e0b',
  completed:  '#16a34a',
  cancelled:  '#ef4444',
};

export default function ProductionPage() {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'gantt'>('kanban');
  const { role } = useAppStore();

  const canEdit = role !== 'employee';

  useEffect(() => {
    workOrdersApi.list().then((res) => {
      setWorkOrders(res.data);
      setLoading(false);
    });
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (!canEdit) return;
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    if (!canEdit) return;
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    if (!id) return;

    // Optimistic update
    setWorkOrders(prev => prev.map(wo => wo.id === id ? { ...wo, status } : wo));
    
    try {
      await workOrdersApi.updateProgress(id, { status });
    } catch (error) {
      console.error('Failed to update status', error);
      const res = await workOrdersApi.list();
      setWorkOrders(res.data);
    }
  };

  // --- Gantt Chart Setup ---
  // Generate 14 days starting from today for the Gantt timeline
  const today = startOfDay(new Date());
  const ganttDays = useMemo(() => {
    return Array.from({ length: 21 }).map((_, i) => addDays(today, i - 3)); // Start 3 days ago, go 18 days into future
  }, [today]);

  const renderGanttRow = (wo: any) => {
    // Fallback logic if dates aren't fully set in DB seed
    const startDate = wo.plannedStart ? new Date(wo.plannedStart) : new Date(wo.createdAt);
    const endDate = wo.plannedEnd ? new Date(wo.plannedEnd) : addDays(startDate, 3);
    
    const startIdx = ganttDays.findIndex(d => isSameDay(d, startOfDay(startDate)));
    const endIdx = ganttDays.findIndex(d => isSameDay(d, startOfDay(endDate)));
    
    // If the dates are completely outside our window, we might not draw a bar or clip it
    const visualStart = Math.max(0, startIdx);
    const visualEnd = endIdx === -1 ? (startDate < ganttDays[0]! ? -1 : ganttDays.length - 1) : endIdx;
    
    if (visualEnd < 0 || visualStart >= ganttDays.length) {
      return null; // outside view
    }

    const duration = Math.max(1, visualEnd - visualStart + 1);
    
    return (
      <div 
        className={`absolute h-8 rounded-md flex items-center px-2 text-xs font-semibold whitespace-nowrap overflow-hidden shadow-sm border border-black/10 transition-all ${canEdit ? 'cursor-ew-resize hover:opacity-90' : 'cursor-default opacity-80'}`}
        style={{
          left: `${visualStart * (100 / ganttDays.length)}%`,
          width: `${duration * (100 / ganttDays.length)}%`,
          backgroundColor: 'var(--brand-500)',
          color: 'white'
        }}
        title={`Status: ${wo.status.replace('_', ' ')}\nQty: ${wo.completedQty}/${wo.plannedQty}`}
      >
        <span className="truncate">{wo.woNumber} - {wo.product?.name}</span>
      </div>
    );
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-surface-500" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
            Production Tracking
            {!canEdit && (
              <span className="text-xs bg-surface-200 text-surface-600 px-2 py-0.5 rounded-full font-medium ml-2">
                View Only Mode
              </span>
            )}
          </h1>
          <p className="text-sm text-surface-500 mt-1">Manage manufacturing timelines and shop floor progress.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="bg-surface-200 p-1 rounded-lg flex items-center">
            <button
              onClick={() => setView('kanban')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === 'kanban' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <LayoutGrid size={16} /> Board
            </button>
            <button
              onClick={() => setView('gantt')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === 'gantt' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <CalendarIcon size={16} /> Timeline
            </button>
          </div>

          {canEdit && (
            <button className="btn-primary" onClick={() => window.location.href = '/production/new'}>
              <Plus size={16} /> New Work Order
            </button>
          )}
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="flex gap-6 overflow-x-auto pb-4 min-h-[500px]">
          {STATUSES.map(status => {
            const columnWOs = workOrders.filter(wo => wo.status === status);
            
            return (
              <div 
                key={status} 
                className={`flex-shrink-0 w-80 flex flex-col bg-surface-100 rounded-lg p-4 border border-surface-200 ${canEdit ? '' : 'opacity-95'}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold uppercase tracking-wider text-xs text-surface-500">
                    {status.replace('_', ' ')}
                  </h3>
                  <span className="bg-surface-200 text-surface-600 px-2 py-0.5 rounded text-xs font-semibold">
                    {columnWOs.length}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                  {columnWOs.map(wo => (
                    <div 
                      key={wo.id} 
                      draggable={canEdit}
                      onDragStart={(e) => handleDragStart(e, wo.id)}
                      className={`glass-card p-4 transition-colors ${canEdit ? 'cursor-move hover:border-brand-500/50' : 'cursor-default'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/production/${wo.id}`} className="hover:underline font-semibold text-brand-600 flex items-center gap-1">
                          {canEdit && <GripVertical size={14} className="text-surface-300" />}
                          {wo.woNumber}
                        </Link>
                      </div>
                      <div className="text-surface-600 text-sm mb-2">{wo.product?.name || 'Unknown Product'}</div>
                      <div className="flex justify-between items-center text-xs text-surface-500">
                        <span>SO: {wo.salesOrder?.orderNumber}</span>
                        <span className="font-medium text-surface-800">
                          {wo.completedQty} / {wo.plannedQty}
                        </span>
                      </div>
                      
                      {wo.completedQty > 0 && (
                        <div className="mt-3 w-full bg-surface-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-brand-500 h-full" 
                            style={{ width: `${Math.min(100, Math.round((wo.completedQty / wo.plannedQty) * 100))}%` }} 
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* GANTT CHART VIEW */
        <div className="flex-1 bg-white border border-surface-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          {/* Header Row (Dates) */}
          <div className="flex border-b border-surface-200 bg-surface-50 sticky top-0 z-10">
            <div className="w-64 flex-shrink-0 border-r border-surface-200 p-4 font-semibold text-surface-700">
              Work Order Details
            </div>
            <div className="flex-1 relative flex">
              {ganttDays.map((date, i) => (
                <div 
                  key={i} 
                  className={`flex-1 border-r border-surface-100 flex flex-col items-center justify-center p-2 text-xs ${isSameDay(date, today) ? 'bg-brand-50/50' : ''}`}
                >
                  <span className="font-semibold text-surface-700">{format(date, 'd')}</span>
                  <span className="text-surface-500 uppercase text-[10px]">{format(date, 'EEE')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Body Rows */}
          <div className="flex-1 overflow-y-auto">
            {workOrders.length === 0 ? (
              <div className="p-8 text-center text-surface-500">No work orders found.</div>
            ) : (
              workOrders.map((wo, index) => (
                <div key={wo.id} className="flex border-b border-surface-100 hover:bg-surface-50 transition-colors group">
                  {/* Fixed Left Column */}
                  <div className="w-64 flex-shrink-0 border-r border-surface-200 p-4">
                    <div className="font-semibold text-brand-600 hover:underline cursor-pointer">
                      <Link href={`/production/${wo.id}`}>{wo.woNumber}</Link>
                    </div>
                    <div className="text-xs text-surface-500 truncate mt-1">{wo.product?.name || 'Unknown'}</div>
                    <div className="mt-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${STATUS_COLORS[wo.status] || 'bg-surface-200'}`}>
                        {wo.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Timeline Row */}
                  <div className="flex-1 relative min-h-[80px]">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {ganttDays.map((date, i) => (
                        <div key={i} className={`flex-1 border-r border-surface-100 ${isSameDay(date, today) ? 'bg-brand-50/30' : ''}`} />
                      ))}
                    </div>
                    
                    {/* The Gantt Bar */}
                    <div className="absolute inset-0 flex items-center py-2">
                      {renderGanttRow(wo)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
