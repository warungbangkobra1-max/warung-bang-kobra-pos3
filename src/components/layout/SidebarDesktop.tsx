import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  ListOrdered, 
  Bike, 
  UtensilsCrossed, 
  Tags, 
  Boxes, 
  Users, 
  Wallet, 
  FileBarChart, 
  UserCog,
  QrCode, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  X
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { UserRole } from '../../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onOpenCustomerView: () => void;
  activeOrderCount: number;
  deliveryCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SidebarDesktop: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  onSwitchRole,
  onOpenCustomerView,
  activeOrderCount,
  deliveryCount,
  isOpenMobile = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['OWNER', 'KASIR'] },
    { id: 'pos', label: 'Kasir', icon: Receipt, roles: ['OWNER', 'KASIR'] },
    { id: 'antrian', label: 'Pesanan', icon: ListOrdered, badge: activeOrderCount, roles: ['OWNER', 'KASIR', 'DELIVERY'] },
    { id: 'delivery-dqm', label: 'Delivery DQM', icon: Bike, badge: deliveryCount, roles: ['OWNER', 'KASIR', 'DELIVERY'] },
    { id: 'produk', label: 'Produk', icon: UtensilsCrossed, roles: ['OWNER'] },
    { id: 'kategori', label: 'Kategori', icon: Tags, roles: ['OWNER'] },
    { id: 'stok', label: 'Stok', icon: Boxes, roles: ['OWNER', 'KASIR'] },
    { id: 'pelanggan', label: 'Pelanggan', icon: Users, roles: ['OWNER'] },
    { id: 'pengeluaran', label: 'Pengeluaran', icon: Wallet, roles: ['OWNER'] },
    { id: 'laporan', label: 'Laporan', icon: FileBarChart, roles: ['OWNER'] },
    { id: 'pengguna', label: 'Pengguna', icon: UserCog, roles: ['OWNER'] },
    { id: 'qr-code', label: 'QR Code', icon: QrCode, roles: ['OWNER', 'KASIR'] },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings, roles: ['OWNER'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(userRole));

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar (Drawer on mobile, collapsible on desktop/netbook) */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col h-full select-none shrink-0 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between min-h-[64px]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm shrink-0">
              K
            </div>
            {(!isCollapsed || isOpenMobile) && (
              <div className="leading-tight overflow-hidden">
                <div className="text-[10px] tracking-wider uppercase font-extrabold text-red-600">
                  WARUNG
                </div>
                <div className="font-extrabold text-slate-900 text-sm tracking-tight truncate">
                  BANG KOBRA
                </div>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Switcher Pill */}
        {(!isCollapsed || isOpenMobile) ? (
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <div className="text-[11px] font-semibold text-slate-500 mb-1 flex justify-between items-center">
              <span>HAK AKSES</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-red-50 text-red-700 border border-red-200 font-mono">
                {userRole}
              </span>
            </div>
            <select
              value={userRole}
              onChange={(e) => onSwitchRole(e.target.value as UserRole)}
              className="w-full bg-white text-slate-800 text-xs font-medium rounded-lg px-2.5 py-2 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 cursor-pointer shadow-sm"
            >
              <option value="OWNER">Owner (Akses Penuh)</option>
              <option value="KASIR">Kasir (POS & Pesanan)</option>
              <option value="DELIVERY">Kurir DQM (Pengantaran)</option>
            </select>
          </div>
        ) : (
          <div className="py-2.5 flex justify-center border-b border-slate-100 bg-slate-50">
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-red-50 text-red-700 border border-red-200 font-mono">
              {userRole[0]}
            </span>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 scrollbar-thin">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  isCollapsed && !isOpenMobile ? 'justify-center px-2' : 'justify-between px-3'
                } py-2.5 rounded-xl text-xs font-semibold transition-all group min-h-[44px] ${
                  isActive
                    ? 'bg-red-50 text-red-600 shadow-sm border border-red-100 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-red-600' : 'text-slate-500 group-hover:text-slate-800'}`} />
                  {(!isCollapsed || isOpenMobile) && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>
                {item.badge !== undefined && item.badge > 0 && (!isCollapsed || isOpenMobile) && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions & Collapse Toggle */}
        <div className="p-3 border-t border-slate-200 space-y-2 bg-slate-50/70">
          {/* Customer Web Switch */}
          {(!isCollapsed || isOpenMobile) && (
            <button
              onClick={() => {
                onOpenCustomerView();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-900 text-xs font-semibold hover:bg-orange-100 transition"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-orange-600 shrink-0" />
                <div className="text-left">
                  <div className="font-bold">Customer QR</div>
                  <div className="text-[10px] text-orange-700">Tampilan Pemesan</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-orange-600" />
            </button>
          )}

          {/* Desktop/Laptop/Netbook Collapse & Expand Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex w-full items-center justify-center gap-2 py-2 px-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition"
              title={isCollapsed ? "Lebarkan Sidebar" : "Kecilkan Sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kecilkan Menu</span>
                </>
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
