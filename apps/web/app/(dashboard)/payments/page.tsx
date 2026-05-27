'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, CreditCard } from 'lucide-react';
import { paymentsApi } from '../../../lib/api';
import { formatCurrency } from '../../../lib/utils';

export default function PaymentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data } = await paymentsApi.list({
          status: statusFilter !== 'all' ? statusFilter : undefined
        });
        setPayments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, statusFilter]);

  const totalCollected = payments
    .filter(p => p.status === 'cleared')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Payments</h1>
          <p className="text-sm text-surface-500 mt-1">{payments.length} recorded payments</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} />
          Record Payment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card">
          <span className="stat-label">Total Collected</span>
          <span className="stat-value text-accent-green">{formatCurrency(totalCollected)}</span>
          <span className="text-xs text-accent-green font-medium">Cleared payments</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <span className="stat-value text-surface-600">{formatCurrency(pendingAmount)}</span>
          <span className="text-xs text-surface-500 font-medium">Awaiting settlement</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          {['all', 'pending', 'cleared', 'bounced', 'refunded'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === s ? 'bg-brand-500/15 text-brand-400' : 'text-surface-500 hover:bg-surface-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="table-header text-left px-4 py-3">Date</th>
                <th className="table-header text-left px-4 py-3">Amount</th>
                <th className="table-header text-left px-4 py-3">Status</th>
                <th className="table-header text-left px-4 py-3">Method</th>
                <th className="table-header text-left px-4 py-3">Invoice Ref</th>
                <th className="table-header text-left px-4 py-3">Reference</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-surface-500">Loading payments...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-surface-500">No payments found</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="table-row">
                    <td className="table-cell font-medium text-surface-800">
                      {new Date(payment.paidAt).toLocaleDateString()}
                    </td>
                    <td className="table-cell font-semibold">
                      {formatCurrency(Number(payment.amount))}
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold capitalize ${
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        payment.status === 'bounced' ? 'bg-red-100 text-red-700' :
                        payment.status === 'refunded' ? 'bg-surface-200 text-surface-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="table-cell text-surface-600 capitalize">
                      {payment.method.replace('_', ' ')}
                    </td>
                    <td className="table-cell text-brand-600">
                      {payment.invoice?.invoiceNumber}
                    </td>
                    <td className="table-cell text-surface-500 text-sm">
                      {payment.referenceNumber || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
