'use client';

import { useState, useEffect } from 'react';
import { workOrdersApi } from '../../../../lib/api';
import { Loader2, ArrowLeft, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function WorkOrderDetailPage({ params }: { params: { id: string } }) {
  const [wo, setWo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState('');
  const [qcNotes, setQcNotes] = useState('');

  const loadData = () => {
    setLoading(true);
    workOrdersApi.get(params.id).then((res) => {
      setWo(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  const handleUpdateQty = async () => {
    if (!qty) return;
    await workOrdersApi.updateProgress(params.id, {
      completedQty: (wo.completedQty || 0) + parseInt(qty, 10)
    });
    setQty('');
    loadData();
  };

  const handleAddLog = async (type: string) => {
    if (!qcNotes) return;
    await workOrdersApi.addLog(params.id, { type, notes: qcNotes });
    setQcNotes('');
    loadData();
  };

  if (loading || !wo) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-surface-500" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/production" className="p-2 hover:bg-surface-200 rounded-lg text-surface-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-surface-900">{wo.woNumber}</h1>
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold capitalize ${
              wo.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-surface-200 text-surface-700'
            }`}>
              {wo.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-surface-500 mt-1">Manufacturing Order for {wo.product?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-4">Production Progress</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm">
                <span className="text-surface-500">Completed:</span>{' '}
                <span className="font-semibold text-lg">{wo.completedQty}</span> / {wo.plannedQty}
              </div>
              <div className="text-sm text-red-600">
                <span className="text-surface-500">Rejected:</span>{' '}
                <span className="font-semibold text-lg">{wo.rejectedQty}</span>
              </div>
            </div>
            
            <div className="w-full bg-surface-200 h-3 rounded-full overflow-hidden mb-6">
              <div 
                className="bg-brand-500 h-full" 
                style={{ width: `${Math.min(100, Math.round((wo.completedQty / wo.plannedQty) * 100))}%` }} 
              />
            </div>

            <div className="flex gap-3">
              <input 
                type="number" 
                placeholder="Qty produced" 
                value={qty} 
                onChange={e => setQty(e.target.value)} 
                className="input-field w-32"
              />
              <button className="btn-primary" onClick={handleUpdateQty}>Log Production</button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-4">Activity & QC Log</h2>
            <div className="flex gap-3 mb-6">
              <input 
                className="input-field flex-1"
                placeholder="Add a QC note or issue..." 
                value={qcNotes} 
                onChange={e => setQcNotes(e.target.value)} 
              />
              <button className="px-4 py-2 bg-surface-200 hover:bg-surface-300 text-surface-700 font-medium rounded-lg text-sm flex items-center gap-2" onClick={() => handleAddLog('note')}>
                <MessageSquare className="w-4 h-4" /> Note
              </button>
              <button className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg text-sm flex items-center gap-2" onClick={() => handleAddLog('qc_check')}>
                <AlertTriangle className="w-4 h-4" /> Flag Issue
              </button>
            </div>

            <div className="space-y-4">
              {wo.logs?.map((log: any) => (
                <div key={log.id} className="flex gap-4 p-4 border border-surface-200 rounded-lg bg-surface-50">
                  <div className="mt-1">
                    {log.type === 'qc_check' ? <AlertTriangle className="text-red-500 w-5 h-5" /> : 
                     log.type === 'status_change' ? <CheckCircle2 className="text-brand-500 w-5 h-5" /> :
                     <MessageSquare className="text-surface-400 w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-medium text-surface-800">{log.notes}</div>
                    <div className="text-xs text-surface-500 mt-1">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              {(!wo.logs || wo.logs.length === 0) && (
                <p className="text-sm text-surface-500 text-center py-4">No logs yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-4">Order Details</h2>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-surface-500">Product</div>
                <div className="font-medium text-surface-800">{wo.product?.name} ({wo.product?.sku})</div>
              </div>
              <div>
                <div className="text-surface-500">Sales Order</div>
                <div className="font-medium text-brand-600 hover:underline cursor-pointer">
                  {wo.salesOrder?.orderNumber}
                </div>
              </div>
              <div>
                <div className="text-surface-500">Planned Start</div>
                <div className="font-medium text-surface-800">{wo.plannedStart ? new Date(wo.plannedStart).toLocaleDateString() : '-'}</div>
              </div>
              <div>
                <div className="text-surface-500">Planned End</div>
                <div className="font-medium text-surface-800">{wo.plannedEnd ? new Date(wo.plannedEnd).toLocaleDateString() : '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
