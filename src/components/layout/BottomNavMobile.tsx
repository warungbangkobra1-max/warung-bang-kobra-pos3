import React from 'react';
import { 
  Home, 
  Receipt, 
  ListOrdered, 
  UtensilsCrossed, 
  Menu
} from 'lucide-react';

export type MobileNavTab = 'dashboard' | 'pos' | 'antrian' | 'produk' | 'menu';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeOrderCount: number;
  onToggleDrawer: () => void;
}

export const BottomNavMobile: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  activeOrderCount,
  onToggleDrawer,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'pos', label: 'Kasir', icon: Receipt },
    { id: 'antrian', label: 'Pesanan', icon: ListOrdered, badge: activeOrderCount },
    { id: 'produk', label: 'Produk', icon: UtensilsCrossed },
    { id: 'more-menu', label: 'Menu', icon: Menu, isAction: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around select-none shadow-[0_-4px_12px_rgba(0,0,0,0.05)] lg:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.isAction) {
                onToggleDrawer();
              } else {
                onSelectTab(tab.id);
              }
            }}
            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[56px] py-1 px-2 relative transition-all ${
              isActive ? 'text-red-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[1.8px]'} transition-transform`} />
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-red-600 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-1 ${isActive ? 'font-extrabold text-red-600' : 'font-medium text-slate-500'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
