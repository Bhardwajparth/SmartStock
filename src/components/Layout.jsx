import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="bg-background text-on-surface overflow-x-hidden min-h-screen">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-24 pb-12 px-8 min-h-screen">
        <Outlet />
      </main>
      <button className="fixed bottom-10 right-10 bg-gradient-to-br from-primary to-primary-dim text-white p-4 rounded-full shadow-xl flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all group">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_box</span>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-300 whitespace-nowrap font-bold text-sm">Quick Add Product</span>
      </button>
    </div>
  );
};
