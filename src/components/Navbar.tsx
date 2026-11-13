import React from 'react';
import { Truck, LayoutDashboard, Search, Smartphone } from 'lucide-react';

interface NavbarProps {
  currentTab: 'dispatch' | 'driver' | 'tracking';
  setCurrentTab: (tab: 'dispatch' | 'driver' | 'tracking') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">LOGIX EXPRESS</h1>
            <p className="text-xs text-slate-400">Hệ Thống Quản Lý Vận Chuyển</p>
          </div>
        </div>

        {/* 3 Nút chuyển phân hệ cho 4 thành viên */}
        <nav className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setCurrentTab('dispatch')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
              currentTab === 'dispatch' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>1. Điều Phối (Admin)</span>
          </button>

          <button
            onClick={() => setCurrentTab('driver')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
              currentTab === 'driver' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>2. App Tài Xế</span>
          </button>

          <button
            onClick={() => setCurrentTab('tracking')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
              currentTab === 'tracking' ? 'bg-amber-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>3. Tra Cứu Vận Đơn</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
