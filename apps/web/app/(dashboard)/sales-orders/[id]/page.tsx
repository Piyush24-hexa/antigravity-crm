'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, FileText, CheckCircle, Printer, Download, Receipt } from 'lucide-react';
import { salesOrdersApi } from '../../../../lib/api';
import { formatCurrency } from '../../../../lib/utils';

export default function SalesOrderDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const so = await salesOrdersApi.get(id);
        setOrder(so);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-surface-500">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-8 text-surface-500">Order not found</div>;
  }

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="btn-ghost p-2 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-surface-900">{order.orderNumber}</h1>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
              order.status === 'draft' ? 'bg-surface-200 text-surface-700' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              order.status === 'invoiced' ? 'bg-blue-100 text-blue-700' :
              'bg-green-100 text-green-700'
            }`}>
              {order.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-surface-500 mt-1">
            Linked to Deal: <span className="font-medium text-brand-600">{order.deal?.title}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost">
            <Printer size={16} /> Print
          </button>
          <button className="btn-ghost">
            <Download size={16} /> PDF
          </button>
          {order.status === 'draft' && (
            <button className="btn-primary bg-accent-green hover:bg-accent-green/90 text-white">
              <CheckCircle size={16} /> Confirm Order
            </button>
          )}
          {order.status === 'shipped' && (
            <button className="btn-primary">
              <Receipt size={16} /> Generate Invoice
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Lines */}
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-surface-50/50">
              <h2 className="font-bold text-surface-900">Line Items</h2>
              <button className="text-sm text-brand-600 font-medium flex items-center gap-1">
                <Edit size={14} /> Edit Lines
              </button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-surface-200 text-sm text-surface-500">
                  <th className="px-6 py-3 font-medium">Product ID</th>
                  <th className="px-6 py-3 font-medium text-right">Qty</th>
                  <th className="px-6 py-3 font-medium text-right">Unit Price</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {order.lines?.map((line: any) => (
                  <tr key={line.id}>
                    <td className="px-6 py-4 text-sm font-medium">{line.productId}</td>
                    <td className="px-6 py-4 text-sm text-right">{line.quantity}</td>
                    <td className="px-6 py-4 text-sm text-right">{formatCurrency(Number(line.unitPrice))}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium">{formatCurrency(Number(line.lineTotal))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="bg-surface-50 p-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Tax</span>
                <span className="font-medium">{formatCurrency(Number(order.taxAmount))}</span>
              </div>
              <div className="pt-2 border-t border-surface-200 flex justify-between">
                <span className="font-bold text-surface-900">Total</span>
                <span className="font-bold text-brand-600 text-lg">{formatCurrency(Number(order.totalAmount))}</span>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div className="glass-card p-6">
            <h2 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
              <FileText size={16} className="text-surface-400" />
              Notes & Terms
            </h2>
            <p className="text-sm text-surface-600 whitespace-pre-wrap">
              {order.notes || "No notes provided for this order."}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-bold text-surface-900 text-sm uppercase tracking-wider">Details</h3>
            
            <div>
              <span className="block text-xs text-surface-500 mb-1">Created At</span>
              <span className="text-sm font-medium">{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            
            <div>
              <span className="block text-xs text-surface-500 mb-1">Currency</span>
              <span className="text-sm font-medium">{order.currency}</span>
            </div>
          </div>

          {/* Related Invoices */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-bold text-surface-900 text-sm uppercase tracking-wider">Related Invoices</h3>
            {order.invoices && order.invoices.length > 0 ? (
              <div className="space-y-3">
                {order.invoices.map((inv: any) => (
                  <div key={inv.id} className="p-3 border border-surface-200 rounded-lg hover:border-brand-300 cursor-pointer transition-colors" onClick={() => router.push(`/invoices/${inv.id}`)}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm text-brand-600">{inv.invoiceNumber}</span>
                      <span className="text-xs uppercase px-1.5 py-0.5 bg-surface-200 rounded">{inv.status}</span>
                    </div>
                    <div className="text-sm font-bold">{formatCurrency(Number(inv.totalAmount))}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-surface-500">No invoices generated yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
