import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/inventory', label: 'Inventory', icon: 'inventory_2' },
  { path: '/orders', label: 'Orders', icon: 'shopping_cart' },
  { path: '/manufacturing', label: 'Manufacturing', icon: 'factory' },
  { path: '/reports', label: 'Reports', icon: 'analytics' },
];

export const Sidebar = () => {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-100 dark:bg-slate-900 flex flex-col border-r border-slate-200/50 dark:border-slate-800/50 z-50">
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-widest text-slate-900 dark:text-white">Inventory</h1>
        <p className="font-manrope tracking-tight text-sm text-slate-600 mt-1">Smart Stock</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-manrope tracking-tight text-sm transition-colors ${
                isActive
                  ? 'text-blue-700 dark:text-blue-400 font-bold border-r-4 border-blue-700 hover:bg-slate-200 dark:hover:bg-slate-800'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-8 space-y-2">
        <button className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary py-3 px-4 rounded-xl font-headline font-bold text-sm mb-6 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
          <span className="material-symbols-outlined">add</span>
          New Entry
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-blue-700 transition-colors text-sm">
          <span className="material-symbols-outlined">settings</span>
          Settings
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-blue-700 transition-colors text-sm">
          <span className="material-symbols-outlined">help</span>
          Support
        </button>
      </div>
    </aside>
  );
};
