import React from 'react';
import { NavTab } from '../../types';
import { Bell, Layers, MessageSquareText, ShoppingCart, Users2, Settings, ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onlineAccountsCount: number;
  totalAccountsCount: number;
  unreadConversationsCount: number;
  pendingOrdersCount: number;
  onOpenActivity: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onlineAccountsCount,
  totalAccountsCount,
  unreadConversationsCount,
  pendingOrdersCount,
  onOpenActivity,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => onTabChange('articles')}
              className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                <span className="font-extrabold text-sm tracking-wider">MD</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors whitespace-nowrap">
                  Marketplace Desk
                </span>
                <span className="text-[11px] font-mono text-slate-400 leading-none">
                  fb-cpanel-ma
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single line, quiet indicators) */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onTabChange('articles')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'articles'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Articles</span>
            </button>

            <button
              onClick={() => onTabChange('conversations')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 relative ${
                activeTab === 'conversations'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Conversations</span>
              {unreadConversationsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono font-semibold bg-blue-500 text-white rounded-full">
                  {unreadConversationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('orders')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 relative ${
                activeTab === 'orders'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
              {pendingOrdersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('accounts')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'accounts'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Users2 className="w-4 h-4" />
              <span>Accounts</span>
            </button>

            <button
              onClick={() => onTabChange('settings')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Zone 3: Account Status, Activity Bell & Profile Actions */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Live Facebook Connection Status */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium whitespace-nowrap">Facebook linked</span>
              <span className="text-slate-500">·</span>
              <span className="font-mono text-emerald-300/80">{onlineAccountsCount}/{totalAccountsCount} active</span>
            </div>

            {/* Activity Log Trigger Button */}
            <button
              onClick={onOpenActivity}
              title="Recent Activity & Logs"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
            </button>

            {/* User / Sign Out button */}
            <button
              onClick={onSignOut}
              title="Sign out of admin session"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-rose-400 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/40 rounded-lg transition-colors whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
