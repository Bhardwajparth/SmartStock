import React, { useState } from 'react';
import { useManufacturing } from '../hooks/useManufacturing';
import { useInventory } from '../hooks/useInventory';

export const Manufacturing = () => {
  const { manufacturingJobs, startJob, updateJobStatus, isLoading: mfgLoading } = useManufacturing();
  const { inventory, isLoading: invLoading } = useInventory();
  
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [qty, setQty] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const rawMaterials = inventory.filter(i => i.type === 'Raw Material' || i.type === 'Consumable' || i.type === 'Component');
  const finishedGoods = inventory.filter(i => i.type === 'Finished Good' || i.type === 'Component');

  const filteredJobs = manufacturingJobs.filter(j => 
    j.id.includes(searchQuery) ||
    (inventory.find(i => i.id === j.finishedGoodId)?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversion = () => {
    if (sourceId && targetId && qty > 0) {
      startJob.mutate({
        rawMaterialIds: [sourceId],
        finishedGoodId: targetId,
        qty: parseInt(qty, 10)
      }, {
        onSuccess: () => {
          setQty(10);
          setSourceId('');
          setTargetId('');
        }
      });
    }
  };

  const estYield = Math.max(85, 99.5 - (qty * 0.05)).toFixed(1);

  if (mfgLoading || invLoading) return <div className="p-8 text-center text-slate-500">Loading manufacturing data...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Manufacturing Workflow</h2>
          <p className="text-on-surface-variant mt-1">Transform resources into finished assets with precision control.</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Search operations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/15">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Conversion Engine</h3>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              System Ready
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Input: Raw Materials</label>
              <div className="p-6 bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center focus-within:border-primary/40 transition-colors">
                <span className="material-symbols-outlined text-4xl text-primary mb-3">precision_manufacturing</span>
                <select value={sourceId} onChange={e => setSourceId(e.target.value)} className="w-full bg-transparent border-none text-sm font-medium focus:ring-0 text-center outline-none">
                  <option value="" disabled>Select Source SKU</option>
                  {rawMaterials.map(mat => (
                    <option key={mat.id} value={mat.id}>{mat.name} (Stock: {mat.stock})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-4 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Quantity To Consume</p>
                  <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} className="w-full bg-transparent border-none text-lg font-bold focus:ring-0 p-0 outline-none" placeholder="0" />
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant">Est. Yield</p>
                  <p className="text-lg font-bold mt-2">{estYield}<span className="text-sm font-normal">%</span></p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary shadow-inner">
                <span className="material-symbols-outlined">trending_flat</span>
              </div>
            </div>
            <div className="flex-1 w-full space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Output: Finished Goods</label>
              <div className="p-6 bg-primary-fixed-dim rounded-xl flex flex-col items-center justify-center text-center border border-primary/10">
                <span className="material-symbols-outlined text-4xl text-on-primary-fixed mb-3">package_2</span>
                <select value={targetId} onChange={e => setTargetId(e.target.value)} className="w-full bg-transparent border-none text-sm font-bold text-on-primary-fixed focus:ring-0 text-center outline-none">
                  <option value="" disabled>Select Output SKU</option>
                  {finishedGoods.map(fg => (
                    <option key={fg.id} value={fg.id}>{fg.name}</option>
                  ))}
                </select>
                <p className="text-xs text-on-primary-fixed-variant mt-1">Ready for serialization</p>
              </div>
              <button onClick={handleConversion} disabled={!sourceId || !targetId || qty <= 0 || startJob.isPending} className="w-full py-4 bg-gradient-to-br from-primary to-primary-dim text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50">
                EXECUTE CONVERSION
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-high rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Stock Overview</h3>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">category</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Raw Metals</p>
                    <p className="text-[10px] text-on-surface-variant">{rawMaterials.length} Active SKUs</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{rawMaterials.reduce((acc, i) => acc + i.stock, 0)} Units</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">inventory</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Finished Parts</p>
                    <p className="text-[10px] text-on-surface-variant">{finishedGoods.length} Active SKUs</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{finishedGoods.reduce((acc, i) => acc + i.stock, 0)} Units</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-outline-variant/20">
              <div className="flex justify-between text-xs font-bold text-on-surface-variant mb-2">
                <span>DAILY QUOTA</span>
                <span>{(manufacturingJobs.length * 10) % 100}%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${(manufacturingJobs.length * 10) % 100}%` }}></div>
              </div>
            </div>
          </div>
          <div className="relative h-48 rounded-xl overflow-hidden group">
            <img alt="Modern smart warehouse" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPS4XVBP0pyT0QZqSOuaOM9b9QmH1XcptllAcSgvoQ4ilKM6hRn949s5V5T1pqROHysPpHXEk0TQduI15Tj7vNcoScgq3_IOGx6eIm6X2dTH-Rui8TNg6cbFEf5Y1xudKxwdaY3dOKnDVqb41iRRyovaKNWdheq5XM3APBL3HSJNUVhdnnGK-VTxJja03akr4UOtU3d9pm_sFgXKlgu2Jjs6ivrC27DB_axxYbNJ2SYJHEdV7jmVf9wpc7_Z2oL1LllkibzT0_C_xc"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <p className="text-white text-xs font-bold tracking-widest uppercase">Live View</p>
              <p className="text-white/80 text-[10px]">Zone B-14 Automated Facility</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/15 overflow-hidden">
          <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Recent Operations</h3>
              <p className="text-xs text-on-surface-variant">Audit log of material conversions</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Batch ID</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Output Material</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Quantity Produced</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Timestamp</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-8 py-5 font-bold text-sm">#RUN-{job.id.slice(-5)}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                        <span className="text-sm">{inventory.find(i => i.id === job.finishedGoodId)?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-on-surface-variant">{job.qty} units</td>
                    <td className="px-8 py-5 text-sm text-on-surface-variant">{new Date(job.timestamp || Date.now()).toLocaleTimeString()}</td>
                    <td className="px-8 py-5">
                      <select 
                        value={job.status} 
                        onChange={(e) => updateJobStatus.mutate({ id: job.id, status: e.target.value })}
                        disabled={updateJobStatus.isPending}
                        className={`bg-transparent text-[10px] font-bold px-3 py-1 rounded-full uppercase outline-none focus:ring-2 focus:ring-primary/20 ${job.status === 'Completed' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-surface-container-highest text-on-surface-variant'}`}
                      >
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Failed</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-slate-500">No recent operations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
