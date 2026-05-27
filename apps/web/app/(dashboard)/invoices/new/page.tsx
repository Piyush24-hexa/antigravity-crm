'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, CheckCircle } from 'lucide-react';
import { invoicesApi } from '../../../../lib/api';

export default function NewInvoicePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyId: '',
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    status: 'draft',
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    currency: 'USD',
    notes: '',
  });

  const [lines, setLines] = useState([
    { description: '', quantity: 1, unitPrice: 0, discount: 0, taxRate: 0 }
  ]);

  const addLine = () => {
    setLines([...lines, { description: '', quantity: 1, unitPrice: 0, discount: 0, taxRate: 0 }]);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: string, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value } as any;
    setLines(newLines);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let taxAmount = 0;
    
    lines.forEach(line => {
      const lineTotal = (line.quantity * line.unitPrice) - line.discount;
      subtotal += lineTotal;
      taxAmount += lineTotal * (line.taxRate / 100);
    });

    return { subtotal, taxAmount, totalAmount: subtotal + taxAmount };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyId) {
      alert('Company ID is required');
      return;
    }

    setSubmitting(true);
    try {
      const { subtotal, taxAmount, totalAmount } = calculateTotals();
      
      const payload = {
        ...formData,
        issueDate: new Date(formData.issueDate).toISOString(),
        dueDate: new Date(formData.dueDate).toISOString(),
        lines,
        subtotal,
        taxAmount,
        totalAmount
      };

      const { data } = await invoicesApi.create(payload) as any;
      router.push(`/invoices/${data.id}`);
    } catch (error) {
      console.error(error);
      alert('Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="btn-ghost p-2 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Create New Invoice</h1>
          <p className="text-sm text-surface-500 mt-1">Draft a new invoice for a company</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-bold text-surface-900 text-lg">Invoice Details</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Company ID</label>
              <input 
                type="text" 
                required 
                className="input-field w-full" 
                placeholder="Enter Company UUID"
                value={formData.companyId}
                onChange={e => setFormData({...formData, companyId: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Invoice Number</label>
              <input 
                type="text" 
                required 
                className="input-field w-full" 
                value={formData.invoiceNumber}
                onChange={e => setFormData({...formData, invoiceNumber: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Issue Date</label>
              <input 
                type="date" 
                required 
                className="input-field w-full" 
                value={formData.issueDate}
                onChange={e => setFormData({...formData, issueDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Due Date</label>
              <input 
                type="date" 
                required 
                className="input-field w-full" 
                value={formData.dueDate}
                onChange={e => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-surface-50/50">
            <h2 className="font-bold text-surface-900">Line Items</h2>
          </div>
          
          <div className="p-6 space-y-4">
            {lines.map((line, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-surface-500 mb-1">Description</label>
                  <input 
                    type="text" 
                    required 
                    className="input-field w-full" 
                    placeholder="Item description"
                    value={line.description}
                    onChange={e => updateLine(index, 'description', e.target.value)}
                  />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium text-surface-500 mb-1">Qty</label>
                  <input 
                    type="number" 
                    min="1" 
                    required 
                    className="input-field w-full" 
                    value={line.quantity}
                    onChange={e => updateLine(index, 'quantity', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-medium text-surface-500 mb-1">Unit Price</label>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    required 
                    className="input-field w-full" 
                    value={line.unitPrice}
                    onChange={e => updateLine(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium text-surface-500 mb-1">Tax %</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    className="input-field w-full" 
                    value={line.taxRate}
                    onChange={e => updateLine(index, 'taxRate', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => removeLine(index)}
                  className="mt-6 p-2 text-surface-400 hover:text-red-500 transition-colors"
                  disabled={lines.length === 1}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <button type="button" onClick={addLine} className="text-sm font-semibold text-brand-600 flex items-center gap-1">
              <Plus size={16} /> Add Line Item
            </button>
          </div>

          <div className="bg-surface-50 p-6 border-t border-surface-200">
            <div className="w-64 ml-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Subtotal</span>
                <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Tax</span>
                <span className="font-medium">${totals.taxAmount.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-surface-200 flex justify-between">
                <span className="font-bold text-surface-900">Total</span>
                <span className="font-bold text-brand-600 text-lg">${totals.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="font-bold text-surface-900">Notes</h2>
          <textarea 
            className="input-field w-full h-24 py-2" 
            placeholder="Payment terms, thank you message, etc..."
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => router.back()} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Saving...' : (
              <>
                <CheckCircle size={16} /> Create Invoice
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
