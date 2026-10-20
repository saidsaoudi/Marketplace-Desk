import React from 'react';
import { NavTab } from '../../types';
import {
  Layers,
  MessageSquareText,
  ShoppingCart,
  Users2,
  Settings,
  Bot,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Sparkles,
  Wifi,
  Activity,
  Flame,
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onlineAccountsCount: number;
  totalAccountsCount: number;
  unreadConversationsCount: number;
  pendingOrdersCount: number;
  onOpenActivity: () => void;
  onSignOut: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onlineAccountsCount,
  totalAccountsCount,
  unreadConversationsCount,
  pendingOrdersCount,
  onOpenActivity,
  onSignOut,
  isDark,
  onToggleTheme,
}) => {
  const navItems = [
    {
      id: 'articles' as NavTab,
      label: 'Articles',
      icon: Layers,
      count: null,
      desc: 'Catalog & title variants',
    },
    {
      id: 'conversations' as NavTab,
      label: 'Conversations',
      icon: MessageSquareText,
      count: unreadConversationsCount > 0 ? unreadConversationsCount : null,
      badgeColor: 'bg-blue-500 text-white shadow-xs shadow-blue-500/50',
      desc: 'Darija chat & sentiment',
    },
    {
      id: 'orders' as NavTab,
      label: 'Orders',
      icon: ShoppingCart,
      count: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      desc: 'COD delivery & cities',
    },
    {
      id: 'accounts' as NavTab,
      label: 'Accounts',
      icon: Users2,
      count: null,
      desc: `${onlineAccountsCount}/${totalAccountsCount} connected`,
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      icon: Settings,
      count: null,
      desc: 'Bot rules & security',
    },
  ];

  return (
    <aside
      className="w-64 h-screen fixed top-0 bottom-0 left-0 z-40 shrink-0 flex flex-col justify-between border-r border-slate-800/80 bg-slate-950 text-slate-100 select-none shadow-xl transition-colors duration-200"
    >
      {/* Top Brand Section */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xs">
        <button
          onClick={() => onTabChange('articles')}
          className="flex items-center gap-3 text-left w-full group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/15 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-sm tracking-wider font-mono">MD</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors truncate">
                Marketplace Desk
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="truncate">Morocco COD Hub</span>
            </div>
          </div>
        </button>
      </div>

      {/* Main Navigation Items (with internal smooth scroll) */}
      <div className="p-3 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
          <span>Command Center</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">v2.4</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-semibold ring-1 ring-blue-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-900 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-950/40'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                </div>
                <div className="text-left truncate">
                  <div className="truncate leading-tight font-medium">{item.label}</div>
                  <div
                    className={`text-[10px] font-normal truncate ${
                      isActive ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {item.desc}
                  </div>
                </div>
              </div>

              {item.count !== null && (
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold shrink-0 ${
                    isActive ? 'bg-white text-blue-700' : item.badgeColor
                  }`}
                >
                  {item.count}
                </span>
              )}

              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-l-full" />
              )}
            </button>
          );
        })}

        {/* Live Proxy Network Health Widget */}
        <div className="pt-3 px-1">
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/90 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Proxy Mesh Health
              </span>
              <span className="text-emerald-400 font-mono font-bold">100%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full w-full" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-400" />
                5 Residential Nodes
              </span>
              <span>32ms avg</span>
            </div>
          </div>
        </div>

        {/* Darija AI Bot Widget */}
        <div className="pt-1 px-1">
          <div className="p-3 bg-gradient-to-b from-purple-950/20 to-slate-900/60 rounded-xl border border-purple-900/30 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-purple-300 flex items-center gap-1.5 font-medium">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                Darija Auto-Reply
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-900/40 text-purple-300 font-mono border border-purple-700/40">
                Live
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              Instant responses with price discounts & city fees active.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Profile & Actions */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/90 space-y-2">
        {/* User Card with Quick Sign Out */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/40 flex items-center justify-center font-bold text-white text-xs shrink-0 font-mono shadow-xs">
              AD
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate leading-tight">admin</div>
              <div className="text-[10px] text-emerald-400 font-mono leading-tight flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Administrator
              </div>
            </div>
          </div>

          <button
            onClick={onSignOut}
            title="Sign out of Dashboard"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 hover:border-rose-800/40 rounded-lg border border-transparent transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
