import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export const Orders = () => {
  const { orders, addSalesOrder, addPurchaseOrder, inventory } = useContext(AppContext);
  const [selectedOrder, setSelectedOrder] = useState(orders[0] || null);

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ type: 'Sales', productId: inventory[0]?.id || '', qty: 1 });

  const activeSales = orders.filter(o => o.type === 'Sales').length;
  const purchases = orders.filter(o => o.type === 'Purchase').length;

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (newOrder.type === 'Sales') {
      addSalesOrder(newOrder.productId, parseInt(newOrder.qty, 10));
    } else {
      addPurchaseOrder(newOrder.productId, parseInt(newOrder.qty, 10));
    }
    setIsOverlayOpen(false);
  };

  return (
    <>
      <section className="flex justify-between items-end mb-10">
        <div className="max-w-2xl">
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">Order Logistics</h2>
          <p className="text-on-surface-variant mt-2 text-lg font-light leading-relaxed">Streamlining your enterprise supply chain. Managed {orders.length} orders today across global regional hubs.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex p-1 bg-surface-container-high rounded-full">
            <button className="px-4 py-2 text-xs font-bold rounded-full bg-white shadow-sm text-primary transition-all">Sales</button>
            <button className="px-4 py-2 text-xs font-bold rounded-full text-on-surface-variant hover:text-on-surface transition-all">Purchase</button>
          </div>
          <button onClick={() => setIsOverlayOpen(true)} className="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-6 py-3 rounded-full font-headline font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create Order
          </button>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6 mb-10">
        <div className="col-span-8 grid grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] uppercase tracking-widest font-bold text-outline mb-1">Active Sales</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-headline font-extrabold">{activeSales}</span>
              <span className="text-tertiary text-xs font-bold flex items-center"><span className="material-symbols-outlined text-[14px]">arrow_upward</span></span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl border-l-4 border-tertiary shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] uppercase tracking-widest font-bold text-outline mb-1">Stock Arrivals</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-headline font-extrabold">{purchases}</span>
              <span className="text-outline text-xs font-bold">In Transit</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl border-l-4 border-error shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] uppercase tracking-widest font-bold text-outline mb-1">Pending Sync</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-headline font-extrabold">0</span>
              <span className="text-error text-xs font-bold">Needs Action</span>
            </div>
          </div>
        </div>
        <div className="col-span-4 bg-secondary-container rounded-3xl p-6 flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-widest font-bold text-on-secondary-container mb-1">Net Flow Efficiency</p>
            <h3 className="text-2xl font-headline font-extrabold text-on-secondary-container">Optimized (94%)</h3>
          </div>
          <span className="material-symbols-outlined text-on-secondary-container/20 text-6xl group-hover:scale-110 transition-transform absolute -right-2 -bottom-2">trending_up</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-headline font-bold text-xl">Recent Activity</h3>
          </div>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant/10">
                <tr>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.05em] font-bold text-outline">Order ID</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.05em] font-bold text-outline">Type</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.05em] font-bold text-outline">Product ID</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.05em] font-bold text-outline">Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.05em] font-bold text-outline text-right">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {orders.map(order => (
                  <tr key={order.id} onClick={() => setSelectedOrder(order)} className={`hover:bg-surface-container-lowest transition-colors cursor-pointer group ${selectedOrder?.id === order.id ? 'bg-surface-container-low/50' : ''}`}>
                    <td className="px-6 py-5">
                      <p className="font-headline font-bold text-sm">ORD-{order.id.slice(-4)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`flex items-center gap-1.5 ${order.type === 'Sales' ? 'text-primary' : 'text-tertiary-dim'}`}>
                        <span className="material-symbols-outlined text-sm">{order.type === 'Sales' ? 'outbound' : 'input'}</span>
                        <span className="text-xs font-bold">{order.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium">{order.productId}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'Completed' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-surface-container-highest text-on-surface-variant'}`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-5 text-right font-headline font-bold text-sm">{order.qty}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-5 bg-surface-container-low rounded-3xl p-10 flex flex-col h-fit sticky top-24">
          {selectedOrder ? (
            <>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h4 className="font-headline font-extrabold text-2xl">ORD-{selectedOrder.id.slice(-4)}</h4>
                  <p className="text-primary font-bold text-sm">{selectedOrder.type} Fulfillment</p>
                </div>
                <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:shadow-md transition-all">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
              <div className="space-y-8">
                <div className="bg-white/40 rounded-3xl p-6 space-y-4">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-outline">Items Ordered</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-primary font-bold text-xs">x{selectedOrder.qty}</span>
                        <span className="text-xs font-medium">{inventory.find(i => i.id === selectedOrder.productId)?.name || 'Unknown Product'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-4">inventory_2</span>
              <p>Select an order to view details</p>
            </div>
          )}
        </div>
      </div>

      {isOverlayOpen && (
        <div className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[60] flex justify-end">
          <div className="w-full max-w-lg bg-surface-container-lowest h-full shadow-2xl p-10 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-extrabold font-manrope">New Order</h3>
              <button onClick={() => setIsOverlayOpen(false)} className="p-2 hover:bg-surface-container rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form className="space-y-6 flex-1 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Order Type</label>
                <select value={newOrder.type} onChange={e => setNewOrder({...newOrder, type: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20">
                  <option>Sales</option>
                  <option>Purchase</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Select Product</label>
                <select value={newOrder.productId} onChange={e => setNewOrder({...newOrder, productId: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20">
                  {inventory.map(item => (
                    <option key={item.id} value={item.id}>{item.name} ({item.stock} in stock)</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Quantity</label>
                <input value={newOrder.qty} onChange={e => setNewOrder({...newOrder, qty: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20" type="number" min="1"/>
              </div>
            </form>
            <div className="pt-8 flex gap-3">
              <button onClick={() => setIsOverlayOpen(false)} className="flex-1 py-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-all">Cancel</button>
              <button onClick={handleCreateOrder} className="flex-[2] py-4 bg-gradient-to-br from-primary to-primary-dim text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all">Create Order</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
