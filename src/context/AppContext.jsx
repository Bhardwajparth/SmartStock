import React, { createContext, useState, useEffect } from 'react';

// Initial Mock Data Sets
const initialInventory = [
  { id: '1', sku: 'TB-1200-98X', name: 'Titanium Alloy Bolt (M12)', type: 'Raw Material', stock: 12, maxStock: 500, location: 'Warehouse A-12', isCritical: true, imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnFgHkE5RvNohakCtps1iEc4-j3qvl8KxbvtIQFvgK-NSZhWA-4_35pDq0TFuuhHbtGHNtPg98HBh8crkXMGlufy0Dw4Ivu7hFZN8GVlde2ebexVZnSxD-oDoXprgchkugA0rLLgMRtxPyzoxETGpNO0XF6NRHnIajt1hsI5MEwHZItK2bRlwcMu4MrrD0GsexTUB_Un8Ke7SXh3Vz74wpU_PhP-uK5tHSPYcUe-M4oqzChiRckQUp6n7RvMsDlR8U3Gz-p3OOcWtK' },
  { id: '2', sku: 'CC-V42-MK3', name: 'Circuit Controller V4.2', type: 'Component', stock: 84, maxStock: 100, location: 'Electronics Bay', isCritical: false, imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqOHCoatiFc806XWIqNAsLBI5DgLGI4As7kWAGUnCe1SWT_r-tjKkwV5OUeXI7vOg6X3d3ChI_Hmf9H2T8pytiB4FE56GaWWRzY9V9A7hrHPgvELNgacYXeflesNBSvU1fTfa9Q3XLyqXe4dETe_u2K_xiRFmG-m3MlkZL5yJM97hRM3b9WLw7pVmtbKRqau1uBkOK5kR046NYOoJoXbplclQU-UZDVYyRn5Rz6uzxtp_DINqgz2-53zm-T0-sNX-QwQVd58rhFbOb' },
  { id: '3', sku: 'SEAL-S100', name: 'Architectural Sealant Grade-S', type: 'Consumable', stock: 0, maxStock: 250, location: 'Chemical Storage', isCritical: true, stockStatus: 'Out of stock', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY8SXRgOsa5wwi6vmDc4JlHFRgQ-nqC1u-S-Q7rhniY2R26iFdtF7me5xmm-RgzEIsaRCkupQ-8XdYOiYndRRpCnlSECtj3tOPBOq7Aam_CqsoEmusyCC1c4kyMoODCptpgGp9oBrqFNbSHyT6zzazLrEJEKmWIc1I6GefMAwlsZqBXJ-3n-p3kbxOtlP_yADk8jW0_ub5X4hKwCeoGRK3pzckZrUh6aSzmuIYMXLXSwbRbCbG4DiV-_XwTegvH0unghXQjgBQgV42' },
  { id: '4', sku: 'ENG-V8-2200', name: 'Industrial V8 Engine Block', type: 'Finished Good', stock: 45, maxStock: 100, location: 'Assembly Bay 2', isCritical: false, imgUrl: '' }
];

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [inventory, setInventory] = useState(initialInventory);
  const [orders, setOrders] = useState([]);
  const [manufacturingJobs, setManufacturingJobs] = useState([]);

  // Auto-updating logic wrapper
  const addSalesOrder = (productId, qty) => {
    setInventory(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, stock: Math.max(0, item.stock - qty) };
      }
      return item;
    }));
    setOrders(prev => [...prev, { id: Date.now().toString(), type: 'Sales', productId, qty, status: 'Processing' }]);
  };

  const addPurchaseOrder = (productId, qty) => {
    setInventory(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, stock: item.stock + qty, isCritical: (item.stock + qty) < (item.maxStock * 0.1) };
      }
      return item;
    }));
    setOrders(prev => [...prev, { id: Date.now().toString(), type: 'Purchase', productId, qty, status: 'Completed' }]);
  };

  const startManufacturingJob = (rawMaterialIds, finishedGoodId, qty) => {
    // In a real app we'd validate stock availability
    setInventory(prev => prev.map(item => {
      if (rawMaterialIds.includes(item.id)) {
        return { ...item, stock: Math.max(0, item.stock - qty) };
      }
      if (item.id === finishedGoodId) {
        return { ...item, stock: item.stock + qty };
      }
      return item;
    }));
    setManufacturingJobs(prev => [...prev, { id: Date.now().toString(), finishedGoodId, qty, status: 'In Progress' }]);
  };

  return (
    <AppContext.Provider value={{
      inventory,
      orders,
      manufacturingJobs,
      addSalesOrder,
      addPurchaseOrder,
      startManufacturingJob,
      setInventory
    }}>
      {children}
    </AppContext.Provider>
  );
};
