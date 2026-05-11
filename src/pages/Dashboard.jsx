import React from 'react';
import { useInventory } from '../hooks/useInventory';
import { useOrders } from '../hooks/useOrders';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Dashboard = () => {
  const { inventory } = useInventory();
  const { orders } = useOrders();
  
  const totalProducts = inventory.reduce((sum, item) => sum + item.stock, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Completed').length;
  const lowStockItems = inventory.filter(i => i.isCritical);

  const handleExport = () => {
    window.print();
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { border: { display: false }, grid: { color: 'rgba(169, 180, 185, 0.1)' } }
    }
  };

  const salesCount = orders.filter(o => o.type === 'Sales').length;
  const dynamicDecValue = 90 + (salesCount * 5);

  const chartData = {
    labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    datasets: [
      {
        label: 'Sales Trend',
        data: [40, 60, 45, 75, 55, dynamicDecValue],
        backgroundColor: '#c7d3ff',
        hoverBackgroundColor: '#0053db',
        borderRadius: 8,
        borderSkew: 10,
      }
    ],
  };

  const maxCapacity = 1400000;
  const currentCapacityPct = ((totalProducts / maxCapacity) * 100).toFixed(2);

  return (
    <>
      <section className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Architectural Overview</h2>
          <p className="text-slate-500 mt-2 font-medium">Real-time performance metrics for Q3 Inventory Cycles.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="px-5 py-2.5 bg-surface-container-high text-on-surface rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined text-lg">file_download</span>
            Export PDF
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Products</p>
              <h3 className="text-4xl font-extrabold text-on-surface">{totalProducts.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">inventory</span>
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <span className="text-tertiary font-bold text-xs flex items-center">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              +{(totalProducts / 100).toFixed(1)}%
            </span>
            <span className="text-slate-400 text-xs">from last month</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <span className="material-symbols-outlined text-9xl" style={{ fontSize: '160px' }}>inventory</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Orders</p>
              <h3 className="text-4xl font-extrabold text-on-surface">{activeOrdersCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <span className="text-tertiary font-bold text-xs flex items-center">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              +{(activeOrdersCount * 2.4).toFixed(1)}%
            </span>
            <span className="text-slate-400 text-xs">vs yesterday</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <span className="material-symbols-outlined text-9xl" style={{ fontSize: '160px' }}>local_shipping</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Low Stock Items</p>
              <h3 className="text-4xl font-extrabold text-error">{lowStockItems.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-error-container/20 flex items-center justify-center text-error">
              <span className="material-symbols-outlined">warning</span>
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <span className="text-error font-bold text-xs flex items-center">
              <span className="material-symbols-outlined text-sm">priority_high</span>
              {lowStockItems.filter(i => i.stock === 0).length} Urgent
            </span>
            <span className="text-slate-400 text-xs">Action required</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <span className="material-symbols-outlined text-9xl" style={{ fontSize: '160px' }}>warning</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        <div className="lg:col-span-3 bg-surface-container-lowest p-8 rounded-xl shadow-sm relative">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-lg font-bold text-on-surface">Sales Performance Trend</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-xs font-medium text-slate-500">Retail</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                <span className="text-xs font-medium text-slate-500">Enterprise</span>
              </div>
            </div>
          </div>
          <div className="h-64 relative">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-8">Capacity Distribution</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-400 uppercase tracking-wider">Storage Zone A</span>
                  <span>{Math.min(100, Math.max(0, 82 + salesCount)).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary-fixed transition-all" style={{ width: `${Math.min(100, Math.max(0, 82 + salesCount))}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-400 uppercase tracking-wider">Cold Storage</span>
                  <span>45%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[45%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-400 uppercase tracking-wider">Distribution Cntr</span>
                  <span>91%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-error-container w-[91%]"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 flex justify-center relative z-10">
            <div className="text-center">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Capacity</p>
              <p className="text-4xl font-extrabold">{(maxCapacity / 1000000).toFixed(1)}M<span className="text-sm font-normal text-slate-500 ml-1">Units</span></p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-10">
            <svg className="w-full h-full scale-150 origin-top-right" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M44.5,-63.5C57.4,-57.1,67.6,-44.6,73.5,-30.5C79.4,-16.4,80.9,-0.8,77.4,14C73.8,28.8,65.3,42.8,53.4,53.2C41.6,63.6,26.4,70.3,10.6,72.4C-5.1,74.5,-21.3,71.9,-35.6,64.2C-50,56.4,-62.4,43.5,-70.2,28.5C-78,13.5,-81.2,-3.6,-77,-18.8C-72.8,-34,-61.2,-47.3,-47.6,-53.5C-34,-59.8,-18.4,-59,-1.4,-57.1C15.6,-55.1,31.6,-69.9,44.5,-63.5Z" fill="white" transform="translate(100 100)"></path>
            </svg>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low p-8 rounded-xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-on-surface">Stock Criticality Report</h3>
            <p className="text-sm text-slate-500 mt-1">Items currently below their defined safety thresholds.</p>
          </div>
          <button className="text-primary font-bold text-sm hover:underline">View All Alerts</button>
        </div>
        <div className="space-y-4">
          {lowStockItems.map(item => (
            <div key={item.id} className={`bg-surface-container-lowest p-5 rounded-xl flex items-center gap-6 shadow-sm group hover:translate-x-1 transition-transform ${item.stock === 0 ? 'border-l-4 border-error' : ''}`}>
              <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                {item.imgUrl && <img className="w-full h-full object-cover" alt={item.name} src={item.imgUrl}/>}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-on-surface">{item.name}</h4>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-tighter ${item.stock === 0 ? 'bg-error-container text-on-error-container' : 'bg-tertiary-container text-on-tertiary-container'}`}>
                    {item.stock === 0 ? 'Out of stock' : item.stock < 20 ? 'Critical' : 'Low Stock'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium tracking-tight">SKU: {item.sku} • {item.location}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Stock Level</p>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-extrabold ${item.stock === 0 ? 'text-error' : 'text-on-surface'}`}>{item.stock}</span>
                  <span className="text-xs text-slate-400">/ {item.maxStock || 500} units</span>
                </div>
              </div>
              <div className="pl-4 border-l border-slate-100 flex gap-2">
                <button className="w-10 h-10 rounded-lg flex items-center justify-center text-primary hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined">shopping_basket</span>
                </button>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>
          ))}
          {lowStockItems.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No low stock items. All inventory levels are optimal.
            </div>
          )}
        </div>
      </section>
    </>
  );
};
