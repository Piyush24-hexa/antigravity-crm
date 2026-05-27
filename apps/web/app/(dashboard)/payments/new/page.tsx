'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { paymentsApi } from '../../../../lib/api';

export default function NewPaymentPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    invoiceId: '',
    amount: 0,
    method: 'bank_transfer',
    referenceNumber: '',
    status: 'cleared',
    paidAt: new Date().toISOString().slice(0, 10),
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.invoiceId) {
      alert('Invoice ID is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount as any) || 0,
        paidAt: new Date(formData.paidAt).toISOString(),
      };

      const { data } = await paymentsApi.create(payload) as any;
      router.push(`/payments`);
    } catch (error) {
      console.error(error);
      alert('Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="btn-ghost p-2 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Record Payment</h1>
          <p className="text-sm text-surface-500 mt-1">Record a new payment for an invoice</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-bold text-surface-900 text-lg">Payment Details</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-1">Invoice ID</label>
              <input 
                type="text" 
                required 
                className="input-field w-full" 
                placeholder="Enter Invoice UUID"
                value={formData.invoiceId}
                onChange={e => setFormData({...formData, invoiceId: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Amount</label>
              <input 
                type="number" 
                required 
                min="0.01"
                step="0.01"
                className="input-field w-full" 
                placeholder="0.00"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Date Paid</label>
              <input 
                type="date" 
                required 
                className="input-field w-full" 
                value={formData.paidAt}
                onChange={e => setFormData({...formData, paidAt: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Payment Method</label>
              <select 
                required 
                className="input-field w-full"
                value={formData.method}
                onChange={e => setFormData({...formData, method: e.target.value})}
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="card">Credit Card</option>
                <option value="cheque">Cheque</option>
                <option value="cash">Cash</option>
                <option value="crypto">Crypto</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Status</label>
              <select 
                required 
                className="input-field w-full"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="cleared">Cleared</option>
                <option value="pending">Pending</option>
                <option value="bounced">Bounced</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-1">Reference Number / Transaction ID</label>
              <input 
                type="text" 
                className="input-field w-full" 
                placeholder="e.g. TXN-123456789"
                value={formData.referenceNumber}
                onChange={e => setFormData({...formData, referenceNumber: e.target.value})}
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-1">Notes</label>
              <textarea 
                className="input-field w-full h-24 py-2" 
                placeholder="Internal notes about this payment..."
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => router.back()} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary bg-accent-green hover:bg-accent-green/90 text-white">
            {submitting ? 'Saving...' : (
              <>
                <CheckCircle size={16} /> Record Payment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
