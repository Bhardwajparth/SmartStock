import React, { createContext, useState, useEffect } from 'react';

// Initial Mock Data Sets
const initialInventory = [
  { id: '1', sku: 'TB-1200-98X', name: 'Titanium Alloy Bolt (M12)', type: 'Raw Material', stock: 12, maxStock: 500, price: 2.50, location: 'Warehouse A-12', isCritical: true, imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnFgHkE5RvNohakCtps1iEc4-j3qvl8KxbvtIQFvgK-NSZhWA-4_35pDq0TFuuhHbtGHNtPg98HBh8crkXMGlufy0Dw4Ivu7hFZN8GVlde2ebexVZnSxD-oDoXprgchkugA0rLLgMRtxPyzoxETGpNO0XF6NRHnIajt1hsI5MEwHZItK2bRlwcMu4MrrD0GsexTUB_Un8Ke7SXh3Vz74wpU_PhP-uK5tHSPYcUe-M4oqzChiRckQUp6n7RvMsDlR8U3Gz-p3OOcWtK' },
  { id: '2', sku: 'CC-V42-MK3', name: 'Circuit Controller V4.2', type: 'Component', stock: 84, maxStock: 100, price: 145.00, location: 'Electronics Bay', isCritical: false, imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqOHCoatiFc806XWIqNAsLBI5DgLGI4As7kWAGUnCe1SWT_r-tjKkwV5OUeXI7vOg6X3d3ChI_Hmf9H2T8pytiB4FE56GaWWRzY9V9A7hrHPgvELNgacYXeflesNBSvU1fTfa9Q3XLyqXe4dETe_u2K_xiRFmG-m3MlkZL5yJM97hRM3b9WLw7pVmtbKRqau1uBkOK5kR046NYOoJoXbplclQU-UZDVYyRn5Rz6uzxtp_DINqgz2-53zm-T0-sNX-QwQVd58rhFbOb' },
  { id: '3', sku: 'SEAL-S100', name: 'Architectural Sealant Grade-S', type: 'Consumable', stock: 0, maxStock: 250, price: 18.20, location: 'Chemical Storage', isCritical: true, stockStatus: 'Out of stock', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY8SXRgOsa5wwi6vmDc4JlHFRgQ-nqC1u-S-Q7rhniY2R26iFdtF7me5xmm-RgzEIsaRCkupQ-8XdYOiYndRRpCnlSECtj3tOPBOq7Aam_CqsoEmusyCC1c4kyMoODCptpgGp9oBrqFNbSHyT6zzazLrEJEKmWIc1I6GefMAwlsZqBXJ-3n-p3kbxOtlP_yADk8jW0_ub5X4hKwCeoGRK3pzckZrUh6aSzmuIYMXLXSwbRbCbG4DiV-_XwTegvH0unghXQjgBQgV42' },
  { id: '4', sku: 'ENG-V8-2200', name: 'Industrial V8 Engine Block', type: 'Finished Good', stock: 45, maxStock: 100, price: 3200.00, location: 'Assembly Bay 2', isCritical: false, imgUrl: '' }
];

const initialOrders = [
  { id: '1001', type: 'Sales', productId: '4', qty: 2, status: 'Processing', timestamp: Date.now() - 86400000 * 2 },
  { id: '1002', type: 'Purchase', productId: '1', qty: 500, status: 'Completed', timestamp: Date.now() - 86400000 * 5 }
];

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('inventoryData');
    return saved ? JSON.parse(saved) : initialInventory;
  });
  
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('ordersData');
    return saved ? JSON.parse(saved) : initialOrders;
  });
  
  const [manufacturingJobs, setManufacturingJobs] = useState(() => {
    const saved = localStorage.getItem('manufacturingJobsData');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('inventoryData', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('ordersData', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('manufacturingJobsData', JSON.stringify(manufacturingJobs));
  }, [manufacturingJobs]);

  const addProduct = (item) => {
    setInventory(prev => [...prev, item]);
  };

  const updateProduct = (id, updatedItem) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem, isCritical: updatedItem.stock < (updatedItem.maxStock || 500) * 0.1 } : item));
  };

  const deleteProduct = (id) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const addSalesOrder = (productId, qty) => {
    setInventory(prev => prev.map(item => {
      if (item.id === productId) {
        const newStock = Math.max(0, item.stock - qty);
        return { ...item, stock: newStock, isCritical: newStock < (item.maxStock || 500) * 0.1 };
      }
      return item;
    }));
    setOrders(prev => [{ id: Date.now().toString(), type: 'Sales', productId, qty, status: 'Processing', timestamp: Date.now() }, ...prev]);
  };

  const addPurchaseOrder = (productId, qty) => {
    // Stock is only incremented when status changes to 'Completed' typically, 
    // but for simplicity we'll keep the previous logic where it's added immediately, or we can make it pending.
    // Let's add it as In Transit and NOT update stock yet.
    setOrders(prev => [{ id: Date.now().toString(), type: 'Purchase', productId, qty, status: 'In Transit', timestamp: Date.now() }, ...prev]);
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === id) {
        // If transitioning from In Transit to Completed for Purchase, increment stock
        if (order.type === 'Purchase' && order.status !== 'Completed' && newStatus === 'Completed') {
          setInventory(inv => inv.map(item => item.id === order.productId ? { ...item, stock: item.stock + order.qty, isCritical: (item.stock + order.qty) < (item.maxStock || 500) * 0.1 } : item));
        }
        return { ...order, status: newStatus };
      }
      return order;
    }));
  };

  const deleteOrder = (id) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const startManufacturingJob = (rawMaterialIds, finishedGoodId, qty) => {
    setInventory(prev => prev.map(item => {
      if (rawMaterialIds.includes(item.id)) {
        return { ...item, stock: Math.max(0, item.stock - qty) };
      }
      if (item.id === finishedGoodId) {
        return { ...item, stock: item.stock + qty };
      }
      return item;
    }));
    setManufacturingJobs(prev => [{ id: Date.now().toString(), finishedGoodId, qty, status: 'Completed', timestamp: Date.now() }, ...prev]);
  };

  const updateJobStatus = (id, newStatus) => {
    setManufacturingJobs(prev => prev.map(job => job.id === id ? { ...job, status: newStatus } : job));
  };

  return (
    <AppContext.Provider value={{
      inventory,
      orders,
      manufacturingJobs,
      searchQuery,
      setSearchQuery,
      addProduct,
      updateProduct,
      deleteProduct,
      addSalesOrder,
      addPurchaseOrder,
      updateOrderStatus,
      deleteOrder,
      startManufacturingJob,
      updateJobStatus,
      setInventory
    }}>
      {children}
    </AppContext.Provider>
  );
};
