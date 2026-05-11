import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-white/70 backdrop-blur-xl z-40 flex justify-between items-center px-8 shadow-sm">
      <div className="flex items-center flex-1 max-w-xl">
        {/* Removed global search, search is now handled per page */}
      </div>

      <nav className="flex items-center gap-8 ml-8">
        <NavLink to="#" className="text-blue-700 border-b-2 border-blue-700 pb-1 font-manrope text-sm font-medium">Overview</NavLink>
        <NavLink to="#" className="text-slate-600 hover:text-blue-600 transition-colors font-manrope text-sm font-medium">Logs</NavLink>
        <NavLink to="#" className="text-slate-600 hover:text-blue-600 transition-colors font-manrope text-sm font-medium">Schedule</NavLink>
      </nav>

      <div className="flex items-center gap-4 ml-8 border-l border-slate-100 pl-8">
        <button className="relative text-slate-600 hover:text-primary transition-opacity opacity-80 hover:opacity-100">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right hidden xl:block">
            <p className="text-xs font-bold text-slate-900 leading-none">{user?.email || 'User'}</p>
            <p className="text-[10px] text-slate-500 capitalize">{user?.role || 'Guest'}</p>
          </div>
          <img 
            className="w-9 h-9 rounded-full object-cover border-2 border-primary-container" 
            alt="Profile" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtj8PiOsxFCR3UfYlxgu_vlHt_BTqxbJTNW7VPSmvTjPgeTCYNROJu4z_HixSBBVql4NBNhyFpFtGZLAc6_9mO6ucLuRjSoIF0RVifGlE9Uj18I8B6ECWqOLLyiwBOxKxfyhDWUdvUibQe3ydjybDBSo_YUf-vr7W_9KN3yjKedJ5pQIPsL5KHtGgNoQb9YoRdyV1wm7HODmlTvedx_4SwnoZpCse6ChuryE1Eyt3oYd9h4TDiELUvyQUjM0x9ujBa66Nde8zXu9kX"
          />
          <button onClick={logout} className="ml-2 text-slate-500 hover:text-error transition-colors" title="Logout">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
