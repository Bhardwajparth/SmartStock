import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const Reports = () => {
  const { orders, inventory } = useContext(AppContext);

  const totalSalesValue = orders.filter(o => o.type === 'Sales').reduce((acc, order) => {
    const item = inventory.find(i => i.id === order.productId);
    return acc + (order.qty * (item?.price || 1200));
  }, 0);

  const salesCounts = {};
  orders.filter(o => o.type === 'Sales').forEach(o => {
    salesCounts[o.productId] = (salesCounts[o.productId] || 0) + o.qty;
  });
  
  let bestSellingItemId = null;
  let maxSales = 0;
  for (const [id, qty] of Object.entries(salesCounts)) {
    if (qty > maxSales) {
      maxSales = qty;
      bestSellingItemId = id;
    }
  }
  const bestSellingItem = inventory.find(i => i.id === bestSellingItemId) || { name: 'N/A', price: 0 };
  const bestSellingVelocity = maxSales > 0 ? `${maxSales} units / period` : '0 units';
  const bestSellingContrib = totalSalesValue > 0 ? Math.round(((maxSales * (bestSellingItem.price || 1200)) / totalSalesValue) * 100) : 0;

  const slowestItem = inventory.find(i => !salesCounts[i.id] && i.stock > 0) || inventory[0] || { name: 'N/A' };

  const inStockCount = inventory.filter(i => i.stock >= (i.maxStock || 500) * 0.1).length;
  const lowStockCount = inventory.filter(i => i.stock > 0 && i.stock < (i.maxStock || 500) * 0.1).length;
  const outOfStockCount = inventory.filter(i => i.stock === 0).length;
  const totalItems = inventory.length || 1;
  const healthPct = Math.round((inStockCount / totalItems) * 100);

  const handleExport = () => window.print();

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Reports & Analytics</h2>
          <p className="text-on-surface-variant font-medium">Real-time performance and inventory velocity overview.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-surface-container-high rounded-xl p-1">
            <button className="px-4 py-1.5 text-xs font-bold rounded-lg bg-surface-container-lowest shadow-sm text-primary transition-all">Day</button>
            <button className="px-4 py-1.5 text-xs font-bold rounded-lg text-on-surface-variant hover:text-on-surface transition-all">Week</button>
            <button className="px-4 py-1.5 text-xs font-bold rounded-lg text-on-surface-variant hover:text-on-surface transition-all">Month</button>
            <button className="px-4 py-1.5 text-xs font-bold rounded-lg text-on-surface-variant hover:text-on-surface transition-all">Year</button>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-xl">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">calendar_today</span>
            <span className="text-sm font-semibold text-on-surface">Oct 1, 2023 - Oct 31, 2023</span>
            <span className="material-symbols-outlined text-on-surface-variant text-lg cursor-pointer">expand_more</span>
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-bold text-sm transition-all">
            <span className="material-symbols-outlined text-lg">file_download</span> Export
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-3xl flex flex-col justify-between group hover:scale-[1.02] transition-transform cursor-default">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">trending_up</span>
            </div>
            <span className="text-tertiary font-bold text-sm flex items-center gap-1">
              +{(totalSalesValue > 0 ? 12 : 0).toFixed(1)}% <span className="material-symbols-outlined text-sm">arrow_upward</span>
            </span>
          </div>
          <div className="mt-4">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Total Sales</p>
            <p className="text-2xl font-extrabold font-headline">${totalSalesValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-surface-container-low p-6 rounded-3xl flex gap-6 items-center">
          <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container-high flex items-center justify-center">
            {bestSellingItem.imgUrl ? (
              <img src={bestSellingItem.imgUrl} alt={bestSellingItem.name} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">star</span>
            )}
          </div>
          <div>
            <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mb-2 inline-block">Best Selling Item</span>
            <h3 className="text-xl font-bold font-headline mb-1">{bestSellingItem.name}</h3>
            <p className="text-on-surface-variant text-sm">Velocity: <span className="text-on-surface font-bold">{bestSellingVelocity}</span></p>
            <p className="text-tertiary text-xs font-bold mt-1 italic">Contribution: {bestSellingContrib}% of total revenue</p>
          </div>
        </div>

        <div className="bg-surface-container-highest p-6 rounded-3xl flex flex-col justify-center border-l-4 border-error">
          <p className="text-error font-bold text-[10px] uppercase tracking-widest mb-1">Slowest Turnover</p>
          <h4 className="text-lg font-bold font-headline mb-1 leading-tight">{slowestItem.name}</h4>
          <p className="text-on-surface-variant text-sm font-medium">Stock: <span className="font-bold">{slowestItem.stock}</span></p>
          <div className="mt-3 flex gap-1">
            <div className="h-1 flex-1 bg-error/20 rounded-full overflow-hidden">
              <div className="h-full bg-error w-[85%]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold font-headline">Revenue Performance</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-xs font-bold text-on-surface-variant">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary-dim"></span>
                <span className="text-xs font-bold text-on-surface-variant">Target</span>
              </div>
            </div>
          </div>
          <div className="relative h-[300px] chart-grid rounded-xl overflow-hidden" style={{ backgroundImage: 'linear-gradient(to right, #e1e9ee 1px, transparent 1px), linear-gradient(to bottom, #e1e9ee 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 1000 300" preserveAspectRatio="none">
              <path d="M0,200 L100,180 L200,190 L300,150 L400,140 L500,130 L600,120 L700,110 L800,105 L900,100 L1000,90" fill="none" stroke="#44546a" strokeDasharray="8,4" strokeOpacity="0.5" strokeWidth="2"></path>
              <path d="M0,250 C100,240 150,180 250,160 S400,200 500,150 S750,50 1000,40" fill="none" stroke="url(#lineGradient)" strokeLinecap="round" strokeWidth="4"></path>
              <defs>
                <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#0053db"></stop>
                  <stop offset="100%" stopColor="#0048c1"></stop>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute left-[70%] top-[40px] bg-on-surface text-white p-3 rounded-xl shadow-xl backdrop-blur-md">
              <p className="text-[10px] font-bold opacity-70">CURRENT</p>
              <p className="text-sm font-extrabold">${(totalSalesValue).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex justify-between mt-6 px-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            <span>Period 1</span>
            <span>Period 2</span>
            <span>Period 3</span>
            <span>Period 4</span>
            <span>Period 5</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-3xl border-t-8 border-primary">
          <h3 className="text-xl font-bold font-headline mb-8">Inventory Health</h3>
          <div className="relative flex justify-center items-center mb-8">
            <div className="w-48 h-48 rounded-full border-[16px] border-surface-container-high relative">
              <div className="absolute inset-0 rounded-full border-[16px] border-primary border-t-transparent border-r-transparent rotate-45" style={{ transform: `rotate(${(healthPct / 100) * 360 - 45}deg)` }}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold">{healthPct}%</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Optimal</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm font-semibold">Stocked</span>
              </div>
              <span className="text-sm font-bold">{inStockCount} SKU</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                <span className="text-sm font-semibold">Low Stock</span>
              </div>
              <span className="text-sm font-bold">{lowStockCount} SKU</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-error-container/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-error"></div>
                <span className="text-sm font-semibold text-error">Out of Stock</span>
              </div>
              <span className="text-sm font-bold text-error">{outOfStockCount} SKU</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
