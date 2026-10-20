import React from 'react';
import { NavTab } from '../../types';
import {
  Bell,
  Sun,
  Moon,
  CheckCircle2,
  Menu,
  ChevronRight,
  LogOut,
  Clock,
  Layers,
  MessageSquareText,
  ShoppingCart,
  Users2,
  Settings,
  ShieldCheck,
} from 'lucide-react';

interface TopHeaderProps {
  activeTab: NavTab;
  onlineAccountsCount: number;
  totalAccountsCount: number;
  onOpenActivity: () => void;
  onSignOut: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleMobileSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onlineAccountsCount,
  totalAccountsCount,
  onOpenActivity,
  onSignOut,
  isDark,
  onToggleTheme,
  onToggleMobileSidebar,
}) => {
  const getTabConfig = (tab: NavTab) => {
    switch (tab) {
      case 'articles':
        return { label: 'Articles & Variants', icon: Layers };
      case 'conversations':
        return { label: 'Conversations & Darija Bot', icon: MessageSquareText };
      case 'orders':
        return { label: 'Orders & COD Delivery', icon: ShoppingCart };
      case 'accounts':
        return { label: 'Facebook Accounts & Proxies', icon: Users2 };
      case 'settings':
        return { label: 'Workspace Settings', icon: Settings };
      default:
        return { label: 'Dashboard', icon: Layers };
    }
  };

  const { label: breadcrumbLabel, icon: TabIcon } = getTabConfig(activeTab);

  return (
    <header
      className={`sticky top-0 z-30 h-16 w-full border-b transition-colors duration-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 backdrop-blur-md ${
        isDark
          ? 'bg-slate-950/80 border-slate-800/80 text-slate-100'
          : 'bg-white/80 border-slate-200 text-slate-800'
      }`}
    >
      {/* Left: Mobile trigger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation sidebar"
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb with Active View Icon */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-slate-400 hidden sm:inline">Workspace</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <div className="flex items-center gap-2">
            <TabIcon className="w-4 h-4 text-blue-400" />
            <span
              className={`font-semibold capitalize truncate text-sm ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {breadcrumbLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Right Zone: System badges, Time, Bell, and Logout */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        
        {/* Casablanca / Local Time indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800/60 text-slate-400 text-xs font-mono">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>Morocco GMT+1</span>
        </div>

        {/* Facebook accounts status indicator */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
            isDark
              ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-semibold whitespace-nowrap hidden sm:inline">Facebook Linked</span>
          <span className="text-slate-500 hidden sm:inline">·</span>
          <span className="font-mono font-medium">{onlineAccountsCount}/{totalAccountsCount} Active</span>
        </div>

        {/* System Activity Bell */}
        <button
          onClick={onOpenActivity}
          title="Recent System Activity Log"
          className={`p-2 rounded-xl border relative transition-colors ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </button>

        {/* Direct Sign Out Button */}
        <button
          onClick={onSignOut}
          title="Sign out of Dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/40 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>

      </div>
    </header>
  );
};
