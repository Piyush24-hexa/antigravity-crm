'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, FileText, CheckCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { salesOrdersApi } from '../../../lib/api';
import { formatCurrency } from '../../../lib/utils';

export default function SalesOrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data } = await salesOrdersApi.list({
          search: search || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined
        });
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, statusFilter]);

  const totalValue = orders.reduce((sum, d) => sum + (Number(d.totalAmount) || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Sales Orders</h1>
          <p className="text-sm text-surface-500 mt-1">{orders.length} orders · {formatCurrency(totalValue)} total</p>
        </div>
        <button className="btn-primary" onClick={() => router.push('/sales-orders/new')}>
          <Plus size={16} />
          New Order
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <span className="stat-label">Total Value</span>
          <span className="stat-value">{formatCurrency(totalValue)}</span>
          <span className="text-xs text-surface-500 font-medium">All matched orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Draft Orders</span>
          <span className="stat-value text-surface-600">
            {orders.filter(o => o.status === 'draft').length}
          </span>
          <span className="text-xs text-surface-500 font-medium">pending confirmation</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Confirmed & Shipped</span>
          <span className="stat-value text-accent-green">
            {orders.filter(o => ['confirmed', 'shipped'].includes(o.status)).length}
          </span>
          <span className="text-xs text-accent-green font-medium">in fulfillment</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
          <input type="text" placeholder="Search by order number..." className="input-field pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'draft', 'confirmed', 'in_production', 'shipped', 'invoiced', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === s ? 'bg-brand-500/15 text-brand-400' : 'text-surface-500 hover:bg-surface-200'
              }`}
            >
              {s.replace('_', ' ')}
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
                <th className="table-header text-left px-4 py-3">Order Number</th>
                <th className="table-header text-left px-4 py-3">Status</th>
                <th className="table-header text-left px-4 py-3">Deal</th>
                <th className="table-header text-left px-4 py-3">Amount</th>
                <th className="table-header text-left px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-surface-500">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-surface-500">No sales orders found</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="table-row cursor-pointer"
                    onClick={() => router.push(`/sales-orders/${order.id}`)}
                  >
                    <td className="table-cell font-medium text-brand-600">
                      {order.orderNumber}
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold capitalize ${
                        order.status === 'draft' ? 'bg-surface-200 text-surface-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        order.status === 'invoiced' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="table-cell text-surface-600">
                      {order.deal?.title || 'Unknown Deal'}
                    </td>
                    <td className="table-cell font-semibold text-surface-800">
                      {formatCurrency(Number(order.totalAmount))}
                    </td>
                    <td className="table-cell text-surface-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
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
