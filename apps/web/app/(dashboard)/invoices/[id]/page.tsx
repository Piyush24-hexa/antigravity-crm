'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, FileText, Printer, Download, CreditCard, Clock } from 'lucide-react';
import { invoicesApi } from '../../../../lib/api';
import { formatCurrency } from '../../../../lib/utils';

export default function InvoiceDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const inv = await invoicesApi.get(id);
        setInvoice(inv);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-surface-500">Loading invoice details...</div>;
  }

  if (!invoice) {
    return <div className="p-8 text-surface-500">Invoice not found</div>;
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
            <h1 className="text-2xl font-bold text-surface-900">{invoice.invoiceNumber}</h1>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
              invoice.status === 'draft' ? 'bg-surface-200 text-surface-700' :
              invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
              invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {invoice.status}
            </span>
          </div>
          <p className="text-sm text-surface-500 mt-1">
            Billed to: <span className="font-medium text-brand-600">{invoice.company?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost">
            <Printer size={16} /> Print
          </button>
          <button className="btn-ghost">
            <Download size={16} /> PDF
          </button>
          {Number(invoice.balanceDue) > 0 && (
            <button className="btn-primary bg-accent-green hover:bg-accent-green/90 text-white">
              <CreditCard size={16} /> Record Payment
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
              <h2 className="font-bold text-surface-900">Invoice Lines</h2>
              <button className="text-sm text-brand-600 font-medium flex items-center gap-1">
                <Edit size={14} /> Edit Lines
              </button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-surface-200 text-sm text-surface-500">
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium text-right">Qty</th>
                  <th className="px-6 py-3 font-medium text-right">Unit Price</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {invoice.lines?.map((line: any) => (
                  <tr key={line.id}>
                    <td className="px-6 py-4 text-sm font-medium">{line.description}</td>
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
                <span className="font-medium">{formatCurrency(Number(invoice.subtotal))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Tax</span>
                <span className="font-medium">{formatCurrency(Number(invoice.taxAmount))}</span>
              </div>
              <div className="pt-2 border-t border-surface-200 flex justify-between">
                <span className="font-bold text-surface-900">Total Amount</span>
                <span className="font-bold text-surface-900 text-lg">{formatCurrency(Number(invoice.totalAmount))}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Amount Paid</span>
                <span>-{formatCurrency(Number(invoice.amountPaid))}</span>
              </div>
              <div className="pt-2 border-t border-surface-200 flex justify-between">
                <span className="font-bold text-surface-900">Balance Due</span>
                <span className="font-bold text-red-600 text-xl">{formatCurrency(Number(invoice.balanceDue))}</span>
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
              {invoice.notes || "No notes provided for this invoice."}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-bold text-surface-900 text-sm uppercase tracking-wider">Details</h3>
            
            <div>
              <span className="block text-xs text-surface-500 mb-1 flex items-center gap-1"><Clock size={12}/> Issue Date</span>
              <span className="text-sm font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</span>
            </div>

            <div>
              <span className="block text-xs text-surface-500 mb-1 flex items-center gap-1"><Clock size={12}/> Due Date</span>
              <span className={`text-sm font-medium ${new Date(invoice.dueDate) < new Date() && Number(invoice.balanceDue) > 0 ? 'text-red-600' : ''}`}>
                {new Date(invoice.dueDate).toLocaleDateString()}
              </span>
            </div>
            
            <div>
              <span className="block text-xs text-surface-500 mb-1">Currency</span>
              <span className="text-sm font-medium">{invoice.currency}</span>
            </div>

            {invoice.salesOrder && (
              <div className="pt-4 border-t border-surface-200">
                <span className="block text-xs text-surface-500 mb-1">Sales Order Ref</span>
                <span className="text-sm font-medium text-brand-600 cursor-pointer hover:underline" onClick={() => router.push(`/sales-orders/${invoice.salesOrderId}`)}>
                  {invoice.salesOrder.orderNumber}
                </span>
              </div>
            )}
          </div>

          {/* Payments */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-bold text-surface-900 text-sm uppercase tracking-wider">Payment History</h3>
            {invoice.payments && invoice.payments.length > 0 ? (
              <div className="space-y-3">
                {invoice.payments.map((pay: any) => (
                  <div key={pay.id} className="p-3 border border-surface-200 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm text-surface-800">{new Date(pay.paidAt).toLocaleDateString()}</span>
                      <span className="text-xs uppercase px-1.5 py-0.5 bg-green-100 text-green-700 rounded">{pay.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-accent-green">{formatCurrency(Number(pay.amount))}</span>
                      <span className="text-xs text-surface-500 capitalize">{pay.method.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-surface-500">No payments recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
