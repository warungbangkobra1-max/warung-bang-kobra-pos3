import React, { useState } from 'react';
import { 
  Search,
  Bell,
  User,
  Menu,
  X,
  HelpCircle,
  Smartphone,
  Monitor,
  QrCode
} from 'lucide-react';
import { UserRole, UserProfile } from '../../types';

interface NavigationHeaderProps {
  appMode: 'admin' | 'android' | 'customer';
  onChangeAppMode: (mode: 'admin' | 'android' | 'customer') => void;
  userRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenHelp?: () => void;
  activeOrdersCount: number;
  deliveryCount: number;
  isMobileSidebarOpen?: boolean;
  onToggleMobileSidebar?: () => void;
  activePageTitle?: string;
  onSearchGlobal?: (query: string) => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  appMode,
  onChangeAppMode,
  userRole,
  currentUser,
  onOpenAuthModal,
  onOpenHelp,
  activeOrdersCount,
  deliveryCount,
  isMobileSidebarOpen = false,
  onToggleMobileSidebar,
  activePageTitle = 'Dashboard',
  onSearchGlobal,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (onSearchGlobal) {
      onSearchGlobal(e.target.value);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 z-30 sticky top-0 shadow-sm min-h-[60px]">
      {/* LEFT ZONE: Logo & Active Page Name */}
      <div className="flex items-center gap-2.5">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition"
            title="Buka Menu"
            aria-label="Toggle menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        {/* Brand Icon + Name on Mobile, Page Title on Desktop */}
        <div className="flex items-center gap-2">
          <div className="lg:hidden w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm shrink-0">
            K
          </div>
          <div>
            <div className="font-extrabold text-sm text-slate-900 leading-tight">
              {activePageTitle}
            </div>
            <div className="text-[10px] text-slate-500 font-medium hidden xs:block lg:hidden">
              Warung Bang Kobra
            </div>
          </div>
        </div>
      </div>

      {/* CENTER ZONE: Search (Desktop/Laptop/Netbook) */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pesanan, produk, atau transaksi..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full bg-slate-100/80 border border-slate-200/90 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition shadow-inner"
          />
        </div>
      </div>

      {/* RIGHT ZONE: Notifikasi, Nama Pengguna, Role, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Customer QR Quick Switch */}
        <button
          onClick={() => onChangeAppMode(appMode === 'customer' ? 'admin' : 'customer')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition min-h-[40px] ${
            appMode === 'customer'
              ? 'bg-orange-50 border-orange-200 text-orange-700'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="Beralih ke Tampilan Pemesan (QR)"
        >
          <QrCode className="w-4 h-4 text-orange-600" />
          <span className="hidden sm:inline">Customer QR</span>
        </button>

        {/* Notifikasi Bell */}
        <div className="relative">
          <button
            onClick={() => onSearchGlobal && onSearchGlobal('')}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition"
            title={`Notifikasi: ${activeOrdersCount} antrean aktif`}
          >
            <Bell className="w-5 h-5" />
            {activeOrdersCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>

        {/* User Profile & Role (Touch Target >= 44px) */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200/90 text-xs font-medium text-slate-800 transition min-h-[44px]"
          title="Kelola Akun & Hak Akses"
        >
          {currentUser?.photoUrl ? (
            <img src={currentUser.photoUrl} alt="User" className="w-7 h-7 rounded-lg object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
              {currentUser ? currentUser.displayName[0].toUpperCase() : 'U'}
            </div>
          )}

          {/* Hidden on mobile, visible on tablet & laptop */}
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="font-bold text-slate-900 truncate max-w-[100px]">
              {currentUser ? currentUser.displayName : 'Admin'}
            </span>
            <span className="text-[10px] text-red-600 font-semibold font-mono">
              {userRole}
            </span>
          </div>
        </button>

        {/* Help Button */}
        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 min-h-[44px] min-w-[44px] items-center justify-center transition"
            title="Bantuan SOP"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};
