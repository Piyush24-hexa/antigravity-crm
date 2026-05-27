'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, FileText, CheckCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { invoicesApi } from '../../../lib/api';
import { formatCurrency } from '../../../lib/utils';

export default function InvoicesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data } = await invoicesApi.list({
          search: search || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined
        });
        setInvoices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, statusFilter]);

  const totalBalance = invoices.reduce((sum, d) => sum + (Number(d.balanceDue) || 0), 0);
  const totalAmount = invoices.reduce((sum, d) => sum + (Number(d.totalAmount) || 0), 0);
  const overdueAmount = invoices
    .filter(i => i.status === 'overdue')
    .reduce((sum, d) => sum + (Number(d.balanceDue) || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Invoices</h1>
          <p className="text-sm text-surface-500 mt-1">{invoices.length} invoices · {formatCurrency(totalAmount)} total</p>
        </div>
        <button className="btn-primary" onClick={() => router.push('/invoices/new')}>
          <Plus size={16} />
          New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <span className="stat-label">Total Balance Due</span>
          <span className="stat-value">{formatCurrency(totalBalance)}</span>
          <span className="text-xs text-surface-500 font-medium">Unpaid matched invoices</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Overdue</span>
          <span className="stat-value text-red-600">{formatCurrency(overdueAmount)}</span>
          <span className="text-xs text-red-500 font-medium">{invoices.filter(i => i.status === 'overdue').length} overdue</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Fully Paid</span>
          <span className="stat-value text-accent-green">
            {invoices.filter(o => o.status === 'paid').length}
          </span>
          <span className="text-xs text-accent-green font-medium">cleared</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
          <input type="text" placeholder="Search by invoice number..." className="input-field pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'void'].map((s) => (
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
                <th className="table-header text-left px-4 py-3">Invoice Number</th>
                <th className="table-header text-left px-4 py-3">Status</th>
                <th className="table-header text-left px-4 py-3">Company</th>
                <th className="table-header text-left px-4 py-3">Total</th>
                <th className="table-header text-left px-4 py-3">Balance</th>
                <th className="table-header text-left px-4 py-3">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-surface-500">Loading invoices...</td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-surface-500">No invoices found</td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr 
                    key={invoice.id} 
                    className="table-row cursor-pointer"
                    onClick={() => router.push(`/invoices/${invoice.id}`)}
                  >
                    <td className="table-cell font-medium text-brand-600">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold capitalize ${
                        invoice.status === 'draft' ? 'bg-surface-200 text-surface-700' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
                        invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="table-cell text-surface-600">
                      {invoice.company?.name || 'Unknown Company'}
                    </td>
                    <td className="table-cell font-semibold text-surface-800">
                      {formatCurrency(Number(invoice.totalAmount))}
                    </td>
                    <td className="table-cell font-semibold text-surface-800">
                      {formatCurrency(Number(invoice.balanceDue))}
                    </td>
                    <td className="table-cell text-surface-500 text-sm">
                      {new Date(invoice.dueDate).toLocaleDateString()}
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
