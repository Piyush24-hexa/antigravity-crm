'use client';

import { useState, useEffect } from 'react';
import { workOrdersApi } from '../../../lib/api';
import Link from 'next/link';
import { Loader2, Plus } from 'lucide-react';

const STATUSES = ['pending', 'released', 'in_progress', 'qc', 'completed', 'cancelled'];

export default function ProductionKanbanPage() {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workOrdersApi.list().then((res) => {
      setWorkOrders(res.data);
      setLoading(false);
    });
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
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

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-surface-500" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Production Board</h1>
          <p className="text-sm text-surface-500 mt-1">Manage manufacturing work orders and shop floor progress.</p>
        </div>
        <button className="btn-primary" onClick={() => window.location.href = '/production/new'}>
          <Plus size={16} /> New Work Order
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 min-h-[500px]">
        {STATUSES.map(status => {
          const columnWOs = workOrders.filter(wo => wo.status === status);
          
          return (
            <div 
              key={status} 
              className="flex-shrink-0 w-80 flex flex-col bg-surface-100 rounded-lg p-4 border border-surface-200"
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
                    draggable
                    onDragStart={(e) => handleDragStart(e, wo.id)}
                    className="glass-card p-4 cursor-move hover:border-brand-500/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/production/${wo.id}`} className="hover:underline font-semibold text-brand-600">
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
    </div>
  );
}
