import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export const Inventory = () => {
  const { inventory, addProduct, updateProduct, deleteProduct, searchQuery } = useContext(AppContext);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', type: 'Structural', stock: 0, price: 0, desc: '' });

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = filteredInventory.reduce((sum, item) => sum + (item.stock * (item.price || 1200)), 0);

  const handleCreateOrUpdateProduct = (e) => {
    e.preventDefault();
    const item = {
      name: newProduct.name,
      sku: newProduct.sku,
      type: newProduct.type,
      stock: parseInt(newProduct.stock, 10) || 0,
      price: parseFloat(newProduct.price) || 0,
      desc: newProduct.desc
    };

    if (editingId) {
      updateProduct(editingId, item);
    } else {
      addProduct({
        ...item,
        id: Date.now().toString(),
        maxStock: 500,
        isCritical: (parseInt(newProduct.stock, 10) || 0) < 50
      });
    }
    
    setIsOverlayOpen(false);
    setEditingId(null);
    setNewProduct({ name: '', sku: '', type: 'Structural', stock: 0, price: 0, desc: '' });
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setNewProduct({
      name: item.name,
      sku: item.sku,
      type: item.type,
      stock: item.stock,
      price: item.price || 0,
      desc: item.desc || item.location || ''
    });
    setIsOverlayOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setNewProduct({ name: '', sku: '', type: 'Structural', stock: 0, price: 0, desc: '' });
    setIsOverlayOpen(true);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-2 block">Warehouse A-12</span>
            <h2 className="text-4xl font-extrabold font-manrope tracking-tight text-on-surface">Global Inventory</h2>
            <p className="text-on-surface-variant mt-2 max-w-md">Precision tracking for high-end architectural components and structural materials.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-semibold hover:bg-surface-container-highest transition-all scale-95 active:scale-90">
              <span className="material-symbols-outlined">filter_list</span> Filters
            </button>
            <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-dim text-white font-bold shadow-lg shadow-primary/20 scale-95 active:scale-90 transition-transform">
              <span className="material-symbols-outlined">add_circle</span> Add Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Total SKUs</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-manrope">{filteredInventory.length}</span>
              <span className="text-tertiary text-xs font-bold">+12%</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-tertiary">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">In Stock</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-manrope">{filteredInventory.filter(i => i.stock > 0).length}</span>
              <span className="text-slate-400 text-xs font-medium">Items</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-error">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Critical Level</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-manrope">{filteredInventory.filter(i => i.stock < (i.maxStock || 500) * 0.1).length}</span>
              <span className="text-error text-xs font-bold">Action Needed</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-secondary">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Total Value</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-manrope">${(totalValue / 1000).toFixed(1)}k</span>
              <span className="text-slate-400 text-xs font-medium">USD</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Product Information</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">SKU ID</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Category</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant text-center">Stock Level</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Unit Price</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15">
                {filteredInventory.map(item => (
                  <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        {item.imgUrl ? (
                          <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center overflow-hidden">
                            <img className="w-full h-full object-cover" alt={item.name} src={item.imgUrl} />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center overflow-hidden text-slate-400">
                            <span className="material-symbols-outlined">inventory_2</span>
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-on-surface font-manrope">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.desc || item.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-mono text-xs text-slate-600">{item.sku}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-[10px] font-bold uppercase tracking-tighter">{item.type}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.stock === 0 ? 'bg-error-container text-on-error-container' : 'bg-tertiary-container text-on-tertiary-container'}`}>
                          {item.stock} Units
                        </span>
                        <div className="w-24 h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`${item.stock === 0 ? 'bg-error' : 'bg-tertiary'} h-full`} style={{ width: `${Math.min(100, (item.stock / (item.maxStock || 500)) * 100)}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-on-surface">${(item.price || 1240).toLocaleString()}.00</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditClick(item)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary-container/30 rounded-lg transition-all">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button onClick={() => handleDeleteClick(item.id)} className="p-2 text-slate-400 hover:text-error hover:bg-error-container/30 rounded-lg transition-all">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInventory.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-8 py-10 text-center text-slate-500">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[60] flex justify-end transition-opacity duration-300 ${isOverlayOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`w-full max-w-lg bg-surface-container-lowest h-full shadow-2xl p-10 flex flex-col transform transition-transform duration-300 ${isOverlayOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-extrabold font-manrope">{editingId ? 'Edit Product' : 'New Inventory Entry'}</h3>
            <button onClick={() => setIsOverlayOpen(false)} className="p-2 hover:bg-surface-container rounded-full">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <form className="space-y-6 flex-1 overflow-y-auto">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Product Name</label>
              <input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full border shadow-sm outline-none bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20" placeholder="e.g. Architectural Beam" type="text"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">SKU Code</label>
                <input value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} className="w-full border shadow-sm outline-none bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20" placeholder="GL-000-00" type="text"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</label>
                <select value={newProduct.type} onChange={e => setNewProduct({...newProduct, type: e.target.value})} className="w-full border shadow-sm outline-none bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20">
                  <option>Raw Material</option>
                  <option>Component</option>
                  <option>Consumable</option>
                  <option>Finished Good</option>
                  <option>Structural</option>
                  <option>Façade</option>
                  <option>Foundation</option>
                  <option>Interior</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Initial Stock</label>
                <input value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full border shadow-sm outline-none bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20" placeholder="0" type="number"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Unit Price ($)</label>
                <input value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full border shadow-sm outline-none bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20" placeholder="0.00" type="number"/>
              </div>
            </div>
            <div className="space-y-2 pt-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</label>
              <textarea value={newProduct.desc} onChange={e => setNewProduct({...newProduct, desc: e.target.value})} className="w-full border shadow-sm outline-none bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20" placeholder="Product specifications and material details..." rows="4"></textarea>
            </div>
          </form>
          <div className="pt-8 flex gap-3">
            <button onClick={() => setIsOverlayOpen(false)} className="flex-1 py-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-all">Cancel</button>
            <button onClick={handleCreateOrUpdateProduct} className="flex-[2] py-4 bg-gradient-to-br from-primary to-primary-dim text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all">{editingId ? 'Save Changes' : 'Publish Item'}</button>
          </div>
        </div>
      </div>
    </>
  );
};
