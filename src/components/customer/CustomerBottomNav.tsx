import React from 'react';
import { 
  Home, 
  UtensilsCrossed, 
  ShoppingBag, 
  ReceiptText, 
  User 
} from 'lucide-react';

interface CustomerBottomNavProps {
  currentTab: 'home' | 'menu' | 'cart' | 'orders' | 'profile';
  onSelectTab: (tab: 'home' | 'menu' | 'cart' | 'orders' | 'profile') => void;
  cartCount: number;
  activeOrderCount: number;
}

export const CustomerBottomNav: React.FC<CustomerBottomNavProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
  activeOrderCount,
}) => {
  const tabs = [
    { id: 'home' as const, label: 'Beranda', icon: Home },
    { id: 'menu' as const, label: 'Menu', icon: UtensilsCrossed },
    { id: 'cart' as const, label: 'Keranjang', icon: ShoppingBag, badge: cartCount },
    { id: 'orders' as const, label: 'Pesanan', icon: ReceiptText, badge: activeOrderCount },
    { id: 'profile' as const, label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 max-w-md mx-auto px-4 py-2 flex items-center justify-around select-none shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center min-h-[44px] py-1 px-3 relative transition-colors ${
              isActive ? 'text-red-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[1.75px]'} transition-transform`} />
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-red-600 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-1 ${isActive ? 'font-extrabold text-red-600' : 'text-slate-500'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
