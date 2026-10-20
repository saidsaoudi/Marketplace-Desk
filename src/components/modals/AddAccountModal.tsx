import React, { useState } from 'react';
import { FacebookAccount } from '../../types';
import { X, ShieldCheck } from 'lucide-react';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: FacebookAccount) => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [proxyHost, setProxyHost] = useState('82.117.252.143');
  const [proxyPort, setProxyPort] = useState('10550');
  const [protocol, setProtocol] = useState<'IPv6' | 'IPv4'>('IPv6');
  const [enableChatbot, setEnableChatbot] = useState(true);
  const [enableDailyWarmup, setEnableDailyWarmup] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    const newAcc: FacebookAccount = {
      id: `acc-${Date.now()}`,
      displayName: identifier.trim(),
      identifier: identifier.trim(),
      avatarInitial: identifier.trim().charAt(0).toUpperCase(),
      isLinked: true,
      status: 'Online',
      lastSync: 'Just now',
      proxy: {
        ip: proxyHost.trim(),
        port: parseInt(proxyPort, 10) || 1080,
        status: 'Working',
        checkedAt: 'Just now',
        expiresAt: '2026-11-20',
        lastExitNode: '2a05:9405:0:5:f54c:5:0:3010',
        protocol,
        latencyMs: 41,
      },
      chatbotEnabled: enableChatbot,
      buyersStatus: 'No waiting buyers or reply failures',
      marketplaceAvailable: true,
      marketplaceCheckedAt: 'Just now',
      marketplaceNextCheckAt: 'Tomorrow, 02:30 AM',
      dailyWarmupEnabled: enableDailyWarmup,
    };

    onAddAccount(newAcc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Add Facebook Account</h2>
              <p className="text-xs text-slate-400">Connect account session and bind dedicated proxy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Account Identifier (Phone or Email)
            </label>
            <input
              type="text"
              placeholder="e.g. 0606991122 or boutique.maroc@gmail.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Proxy Host / IP</label>
              <input
                type="text"
                value={proxyHost}
                onChange={(e) => setProxyHost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Proxy Port</label>
              <input
                type="text"
                value={proxyPort}
                onChange={(e) => setProxyPort(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">IP Protocol Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProtocol('IPv6')}
                className={`py-2 px-3 rounded-lg border text-center transition-colors ${
                  protocol === 'IPv6'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                IPv6 (Recommended for FB)
              </button>
              <button
                type="button"
                onClick={() => setProtocol('IPv4')}
                className={`py-2 px-3 rounded-lg border text-center transition-colors ${
                  protocol === 'IPv4'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                IPv4 Dedicated
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={enableChatbot}
                onChange={(e) => setEnableChatbot(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>Enable AI / Darija auto-reply chatbot immediately</span>
            </label>

            <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={enableDailyWarmup}
                onChange={(e) => setEnableDailyWarmup(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>Enable automated daily warm-up (anti-checkpoint)</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
            >
              Connect Account
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
