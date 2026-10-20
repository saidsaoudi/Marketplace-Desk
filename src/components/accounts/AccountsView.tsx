import React, { useState } from 'react';
import { FacebookAccount } from '../../types';
import {
  Users2,
  Search,
  KeyRound,
  RefreshCw,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Wifi,
  Sliders,
  Flame,
  ArrowRight,
  Link2,
} from 'lucide-react';
import { AddAccountModal } from '../modals/AddAccountModal';

interface AccountsViewProps {
  accounts: FacebookAccount[];
  onAddAccount: (acc: FacebookAccount) => void;
  onDeleteAccount: (id: string) => void;
  onToggleChatbot: (id: string) => void;
  onToggleWarmup: (id: string) => void;
  onCheckProxy: (id: string) => void;
  onCheckMarketplace: (id: string) => void;
  onSyncPasskeys: () => void;
  onRefreshAllStatus: () => void;
  onActionNotice?: (title: string, desc?: string) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  onAddAccount,
  onDeleteAccount,
  onToggleChatbot,
  onToggleWarmup,
  onCheckProxy,
  onCheckMarketplace,
  onSyncPasskeys,
  onRefreshAllStatus,
  onActionNotice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All accounts');
  const [sortOption, setSortOption] = useState<'Attention first' | 'Identifier A–Z'>('Attention first');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [checkingProxyId, setCheckingProxyId] = useState<string | null>(null);
  const [checkingMarketplaceId, setCheckingMarketplaceId] = useState<string | null>(null);

  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onSyncPasskeys();
    }, 700);
  };

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onRefreshAllStatus();
    }, 700);
  };

  const handleProxyTest = (id: string) => {
    setCheckingProxyId(id);
    setTimeout(() => {
      setCheckingProxyId(null);
      onCheckProxy(id);
    }, 900);
  };

  const handleMarketplaceTest = (id: string) => {
    setCheckingMarketplaceId(id);
    setTimeout(() => {
      setCheckingMarketplaceId(null);
      onCheckMarketplace(id);
    }, 900);
  };

  const filteredAccounts = accounts.filter((acc) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      acc.identifier.toLowerCase().includes(query) ||
      acc.proxy.ip.includes(query);

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Accounts</h1>
          <p className="text-sm text-slate-400 mt-1">
            Connections, proxies and buyers needing attention.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <KeyRound className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
            <span>Sync passkeys</span>
          </button>

          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
            <span>Refresh status</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add account</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-slate-900/90 border border-slate-800 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search accounts by phone, email, IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="All accounts">All accounts</option>
            <option value="Online">Online only</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="Attention first">Attention first</option>
            <option value="Identifier A–Z">Identifier A–Z</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery('');
              setFilterType('All accounts');
              setSortOption('Attention first');
            }}
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Account Cards Stack (Exact elements from screenshot 4) */}
      <div className="space-y-4">
        {filteredAccounts.map((account) => {
          const isProxyChecking = checkingProxyId === account.id;
          const isMarketplaceChecking = checkingMarketplaceId === account.id;

          return (
            <div
              key={account.id}
              className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all shadow-sm space-y-4 text-xs"
            >
              {/* Row 1: Identity & Proxy & Chatbot Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Account Identity (4 cols) */}
                <div className="lg:col-span-4 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 font-mono text-sm shrink-0">
                    {account.avatarInitial}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm font-mono truncate">
                        {account.identifier}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Facebook linked
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-emerald-400">Online</span>
                    </div>

                    <p className="text-[11px] font-mono text-slate-500">
                      Last sync: {account.lastSync}
                    </p>
                  </div>
                </div>

                {/* Proxy Section (4 cols) */}
                <div className="lg:col-span-4 space-y-1.5 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Working
                    </span>
                    <span className="font-mono text-slate-200 font-medium">
                      {account.proxy.ip}:{account.proxy.port}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-mono leading-tight">
                    Checked: {account.proxy.checkedAt} · Expires {account.proxy.expiresAt}
                  </p>

                  <p className="text-[11px] text-slate-500 font-mono leading-tight truncate">
                    Last working exit: {account.proxy.lastExitNode} · {account.proxy.protocol}
                  </p>

                  <button
                    onClick={() => handleProxyTest(account.id)}
                    disabled={isProxyChecking}
                    className="text-blue-400 hover:text-blue-300 font-medium text-[11px] hover:underline inline-flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isProxyChecking ? 'animate-spin' : ''}`} />
                    <span>{isProxyChecking ? 'Pinging IP exit...' : 'Check proxy now'}</span>
                  </button>
                </div>

                {/* Chatbot Switch & Actions (4 cols) */}
                <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800/80">
                  
                  {/* Chatbot On / Off Toggle */}
                  <div className="flex items-center gap-2.5">
                    <label className="text-xs font-medium text-slate-300">
                      Chatbot {account.chatbotEnabled ? 'on' : 'off'}
                    </label>
                    <button
                      type="button"
                      onClick={() => onToggleChatbot(account.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        account.chatbotEnabled ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          account.chatbotEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Actions Button Strip */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => onActionNotice?.('Edit Account', `Account parameters active for ${account.identifier}`)}
                      className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700/60"
                    >
                      Edit details
                    </button>
                    <button
                      onClick={() => handleProxyTest(account.id)}
                      className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700/60"
                    >
                      Proxy
                    </button>
                    <button
                      onClick={() => onActionNotice?.('Direct Import', `Catalog push active for ${account.identifier}`)}
                      className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700/60"
                    >
                      Import
                    </button>
                    <button
                      onClick={() => handleRefreshClick()}
                      className="px-2.5 py-1 text-blue-400 hover:text-blue-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700/60"
                    >
                      Refresh
                    </button>
                    <button
                      onClick={() => onDeleteAccount(account.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
                      title="Delete account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Buyers status text */}
                  <span className="text-[11px] text-slate-400">
                    Buyers: {account.buyersStatus}
                  </span>

                </div>

              </div>

              {/* Row 2: Marketplace Availability & Warm-up Strip */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-400">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Marketplace available
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      Checked: {account.marketplaceCheckedAt} · Next: {account.marketplaceNextCheckAt}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    No warm-up activity while Marketplace is available.
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={account.dailyWarmupEnabled}
                      onChange={() => onToggleWarmup(account.id)}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span>Daily warm-up</span>
                  </label>

                  <button
                    onClick={() => handleMarketplaceTest(account.id)}
                    disabled={isMarketplaceChecking}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 transition-colors"
                  >
                    {isMarketplaceChecking ? 'Checking...' : 'Check Marketplace'}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAccount={onAddAccount}
      />

    </div>
  );
};
