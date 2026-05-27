'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { workOrdersApi } from '../../../../lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewWorkOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    salesOrderId: '',
    productId: '',
    plannedQty: '10',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await workOrdersApi.create({
        salesOrderId: formData.salesOrderId || '00000000-0000-0000-0000-000000000000', 
        productId: formData.productId || '00000000-0000-0000-0000-000000000000',
        plannedQty: parseInt(formData.plannedQty, 10)
      });
      router.push('/production');
    } catch (error) {
      console.error(error);
      alert('Failed to create Work Order. Ensure valid UUIDs are used for Sales Order and Product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/production" className="p-2 hover:bg-surface-200 rounded-lg text-surface-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">New Work Order</h1>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-bold mb-6">Work Order Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-700">Sales Order ID (UUID)</label>
            <input 
              required 
              placeholder="Enter Sales Order UUID" 
              value={formData.salesOrderId} 
              onChange={e => setFormData({ ...formData, salesOrderId: e.target.value })} 
              className="input-field w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-700">Product ID (UUID)</label>
            <input 
              required 
              placeholder="Enter Product UUID" 
              value={formData.productId} 
              onChange={e => setFormData({ ...formData, productId: e.target.value })} 
              className="input-field w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-700">Planned Quantity</label>
            <input 
              type="number"
              required 
              min="1"
              value={formData.plannedQty} 
              onChange={e => setFormData({ ...formData, plannedQty: e.target.value })} 
              className="input-field w-full"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-surface-200">
            <Link href="/production" className="px-4 py-2 bg-surface-200 hover:bg-surface-300 text-surface-700 font-medium rounded-lg text-sm transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Work Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
