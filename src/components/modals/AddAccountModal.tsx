import React, { useState } from 'react';
import { FacebookAccount } from '../../types';
import {
  X,
  Server,
  Globe,
  CheckCircle2,
  ChevronRight,
  Wifi,
  AlertCircle,
  Link2,
  KeyRound,
} from 'lucide-react';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: FacebookAccount) => void;
}

type Step = 'setup' | 'connecting' | 'login' | 'passkey';

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
}) => {
  const [step, setStep] = useState<Step>('setup');
  const [accountName, setAccountName] = useState('');
  const [fbEmail, setFbEmail] = useState('');
  const [fbPassword, setFbPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [proxyHost, setProxyHost] = useState('82.117.252.143');
  const [proxyPort, setProxyPort] = useState('10550');
  const [protocol, setProtocol] = useState<'IPv6' | 'IPv4'>('IPv6');
  const [enableChatbot, setEnableChatbot] = useState(true);
  const [enableDailyWarmup, setEnableDailyWarmup] = useState(true);
  const [passkeyName, setPasskeyName] = useState('Marketplace Desk server');
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [showAddProxy, setShowAddProxy] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    setStep('setup');
    setAccountName('');
    setFbEmail('');
    setFbPassword('');
    setProxyHost('82.117.252.143');
    setProxyPort('10550');
    setProtocol('IPv6');
    setEnableChatbot(true);
    setEnableDailyWarmup(true);
    setPasskeyName('Marketplace Desk server');
    setConnectionProgress(0);
    setConnectionStatus('');
    setShowAddProxy(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const startServerConnection = () => {
    if (!accountName.trim()) return;
    setStep('connecting');
    setConnectionProgress(0);

    const steps = [
      { progress: 15, msg: 'Assigning residential proxy...', delay: 600 },
      { progress: 35, msg: 'Opening Facebook browser session...', delay: 1200 },
      { progress: 55, msg: 'Loading facebook.com via proxy exit node...', delay: 900 },
      { progress: 75, msg: 'Verifying Marketplace availability...', delay: 700 },
      { progress: 90, msg: 'Awaiting Facebook sign-in...', delay: 500 },
    ];

    let totalDelay = 0;
    steps.forEach(({ progress, msg, delay }) => {
      totalDelay += delay;
      setTimeout(() => {
        setConnectionProgress(progress);
        setConnectionStatus(msg);
      }, totalDelay);
    });

    setTimeout(() => {
      setStep('login');
    }, totalDelay + 400);
  };

  const handleFbSignIn = () => {
    if (!fbEmail.trim() || !fbPassword.trim()) return;
    setStep('passkey');
  };

  const handleFinish = () => {
    const newAcc: FacebookAccount = {
      id: `acc-${Date.now()}`,
      displayName: accountName.trim() || fbEmail.trim(),
      identifier: fbEmail.trim() || accountName.trim(),
      avatarInitial: (accountName.trim() || fbEmail.trim()).charAt(0).toUpperCase(),
      isLinked: true,
      status: 'Online',
      lastSync: 'Just now',
      proxy: {
        ip: proxyHost.trim(),
        port: parseInt(proxyPort, 10) || 1080,
        status: 'Working',
        checkedAt: 'Just now',
        expiresAt: '2027-01-20',
        lastExitNode: '2a05:9405:0:5:f54c:5:0:3010',
        protocol,
        latencyMs: 34,
      },
      chatbotEnabled: enableChatbot,
      buyersStatus: 'No waiting buyers or reply failures',
      marketplaceAvailable: true,
      marketplaceCheckedAt: 'Just now',
      marketplaceNextCheckAt: 'Tomorrow, 02:30 AM',
      dailyWarmupEnabled: enableDailyWarmup,
    };
    onAddAccount(newAcc);
    handleReset();
    onClose();
  };

  // ── STEP: SETUP ──────────────────────────────────────
  if (step === 'setup') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
        <div className="bg-[#0f1117] border border-slate-800/70 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/70">
            <h2 className="text-sm font-semibold text-white">Add a Facebook account</h2>
            <div className="flex items-center gap-3">
              <button className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
                Update Edge extension
              </button>
              <button onClick={handleClose} className="p-1 text-slate-500 hover:text-white rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Info */}
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Connect each account on the server to keep publishing and chat running with your PC off.{' '}
              <span className="text-blue-400 cursor-pointer hover:underline">Sign in to Facebook</span> in the window below.
              You can also connect a transferable signed-in session with{' '}
              <span className="text-blue-400 cursor-pointer hover:underline">Edge</span>.
            </p>

            {/* Action row */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Account name, e.g. Shop Casablanca"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="flex-1 min-w-[200px] bg-slate-950/80 border border-slate-700/60 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors"
              />
              <button
                onClick={() => { setStep('login'); }}
                className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-lg transition-colors whitespace-nowrap"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                Connect with Edge
              </button>
              <button
                onClick={() => setShowAddProxy(!showAddProxy)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border rounded-lg transition-colors whitespace-nowrap ${
                  showAddProxy
                    ? 'text-emerald-400 bg-emerald-900/20 border-emerald-700/50'
                    : 'text-slate-200 bg-slate-800 hover:bg-slate-700 border-slate-700/60'
                }`}
              >
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                Add proxy
              </button>
              <button
                onClick={startServerConnection}
                disabled={!accountName.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all shadow-sm shadow-blue-500/20"
              >
                <Server className="w-3.5 h-3.5" />
                Connect on server
              </button>
            </div>

            {/* Proxy panel */}
            {showAddProxy && (
              <div className="bg-slate-950/60 border border-slate-700/50 rounded-xl p-4 space-y-3 text-xs">
                <p className="text-slate-300 font-medium">Proxy configuration</p>
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-3">
                    <label className="text-slate-400 block mb-1">Host / IP</label>
                    <input
                      type="text"
                      value={proxyHost}
                      onChange={(e) => setProxyHost(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-slate-400 block mb-1">Port</label>
                    <input
                      type="text"
                      value={proxyPort}
                      onChange={(e) => setProxyPort(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['IPv6', 'IPv4'] as const).map((proto) => (
                    <button
                      key={proto}
                      type="button"
                      onClick={() => setProtocol(proto)}
                      className={`flex-1 py-1.5 rounded-lg border text-center transition-colors text-xs ${
                        protocol === proto
                          ? 'bg-blue-600/20 border-blue-500/60 text-blue-400 font-semibold'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {proto}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2 text-[11px] text-slate-500">
              <p className="flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 text-slate-600 shrink-0" />
                New server connections automatically select an unused Proxy Seller proxy when linked. Use Add proxy to choose one manually.
              </p>
              <p className="flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 text-slate-600 shrink-0" />
                Extension v1.3.2 lets each Facebook page finish loading and pauses briefly between steps. Edge may ask for debugging permission during setup; it disconnects after verification.
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2 pt-2 border-t border-slate-800/70">
              <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={enableChatbot}
                  onChange={(e) => setEnableChatbot(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-0"
                />
                Enable AI / Darija auto-reply chatbot immediately
              </label>
              <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={enableDailyWarmup}
                  onChange={(e) => setEnableDailyWarmup(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-0"
                />
                Enable automated daily warm-up (anti-checkpoint)
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP: CONNECTING ─────────────────────────────────
  if (step === 'connecting') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
        <div className="bg-[#0f1117] border border-slate-800/70 rounded-2xl w-full max-w-md shadow-2xl p-8 text-center space-y-5">
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin"
                style={{ animationDuration: '1s' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Server className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Connecting to server</h3>
            <p className="text-xs text-slate-400">{connectionStatus || 'Initializing...'}</p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${connectionProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Account: <span className="text-white font-mono">{accountName}</span>
          </p>
        </div>
      </div>
    );
  }

  // ── STEP: LOGIN ──────────────────────────────────────
  if (step === 'login') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
        <div className="bg-[#0f1117] border border-slate-800/70 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/70 bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30">
                <span className="text-blue-400 font-bold text-sm">f</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Connect Facebook on server</h2>
                <p className="text-[11px] text-slate-400">
                  {accountName || 'New Account'} · Sign in once. Keep working with your PC off.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1 text-blue-400 font-semibold">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                  Sign in
                </span>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-[10px]">2</span>
                  Connect account
                </span>
              </div>
              <button
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                onClick={() => setStep('passkey')}
              >
                Approve connection
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5" style={{ minHeight: '420px' }}>
            {/* Left – Simulated browser */}
            <div className="col-span-3 bg-slate-950/50 border-r border-slate-800/70 flex flex-col">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 border-b border-slate-800/50">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <div className="flex-1 bg-slate-800 rounded px-2 py-0.5 text-[10px] text-slate-400 font-mono">
                  facebook.com
                </div>
              </div>
              {/* Tab */}
              <div className="flex items-center border-b border-slate-800/50 px-2 pt-1 text-[11px]">
                <span className="px-3 py-1.5 bg-slate-900/80 border border-slate-700/60 border-b-0 rounded-t-md text-slate-300 -mb-px">
                  Facebook screen
                </span>
              </div>
              {/* Viewport content */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#1877f2] flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <span className="text-white font-bold text-4xl" style={{ fontFamily: 'Georgia, serif' }}>f</span>
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-slate-200 font-semibold text-sm">Explore the things you love.</h3>
                  <p className="text-slate-500 text-[11px]">Facebook Marketplace · Morocco</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-700/50 rounded-lg text-[11px]">
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span className="text-slate-400">Automatic proxy ·</span>
                  <span className="text-white font-mono">{proxyHost}:{proxyPort}</span>
                </div>
                <p className="text-[10px] text-slate-600 text-center max-w-[200px] leading-relaxed">
                  Click, drag or scroll directly in this screen. Zoom for small text.
                </p>
              </div>
              {/* Bottom toolbar */}
              <div className="px-4 py-3 border-t border-slate-800/50 flex items-center justify-between">
                <div className="flex gap-1">
                  <button className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors">Focus screen</button>
                  <button className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors">Zoom screen</button>
                  <button className="text-[11px] text-blue-400 hover:text-blue-300 px-2 py-1 rounded hover:bg-slate-800 transition-colors">Refresh screen</button>
                </div>
                <p className="text-[10px] text-slate-600">Finish after Facebook sign-in is complete.</p>
              </div>
            </div>

            {/* Right – Sign-in form */}
            <div className="col-span-2 p-5 flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white mb-0.5">Sign in to Facebook</h3>
                <p className="text-[11px] text-slate-400">Your login uses this account's selected proxy.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Facebook email or phone *</label>
                  <input
                    type="email"
                    placeholder="Email, phone or user ID"
                    value={fbEmail}
                    onChange={(e) => setFbEmail(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Facebook password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Facebook password"
                      value={fbPassword}
                      onChange={(e) => setFbPassword(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors font-mono text-xs pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-[11px] font-medium"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleFbSignIn}
                  disabled={!fbEmail.trim() || !fbPassword.trim()}
                  className="w-full py-2.5 bg-[#1877f2] hover:bg-[#1560d3] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all text-sm"
                >
                  Sign in to Facebook
                </button>
              </div>

              <div className="border-t border-slate-800/70 pt-3 space-y-3 flex-1">
                <div>
                  <p className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    Server passkeys
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Approve the browser connection in the vault. Give it a name, such as Marketplace Desk server.
                  </p>
                </div>
                <button
                  onClick={() => setStep('passkey')}
                  className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline transition-colors block"
                >
                  Approve connection →
                </button>
                <div className="space-y-1.5 text-[11px]">
                  <button className="w-full text-left text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                    <Link2 className="w-3 h-3" /> Connect vault to browser
                  </button>
                  <button className="w-full text-left text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                    <KeyRound className="w-3 h-3" /> Create Facebook passkey
                  </button>
                </div>
                <button className="w-full py-1.5 border border-slate-700 rounded-lg text-[11px] text-slate-300 hover:text-white hover:border-slate-600 transition-colors">
                  Save &amp; lock vault
                </button>
                <button className="w-full py-1.5 border border-amber-500/30 rounded-lg text-[11px] text-amber-400 hover:bg-amber-950/30 transition-colors">
                  Turn off automatic unlock
                </button>
              </div>

              <div className="flex gap-2">
                <button onClick={handleClose} className="flex-1 py-2 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => setStep('passkey')}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  Finish →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP: PASSKEY ────────────────────────────────────
  if (step === 'passkey') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
        <div className="bg-[#0f1117] border border-slate-800/70 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Approve connection</h2>
                <p className="text-[11px] text-slate-400">Save session passkey to secure vault</p>
              </div>
            </div>
            <button onClick={handleClose} className="p-1 text-slate-500 hover:text-white rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5 text-xs">
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 space-y-3">
              <p className="text-slate-300">Give the vault connection a unique name and approve it in the server screen.</p>
              <div>
                <label className="block text-slate-400 font-medium mb-1.5">Passkey name</label>
                <input
                  type="text"
                  value={passkeyName}
                  onChange={(e) => setPasskeyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500/60 transition-colors text-xs"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 space-y-2">
              <p className="text-slate-400 font-medium mb-2">Account summary</p>
              {[
                ['Account name', accountName || fbEmail],
                ['Proxy', `${proxyHost}:${proxyPort}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-[11px]">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-white font-mono">{value}</span>
                </div>
              ))}
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Protocol</span>
                <span className="text-emerald-400">{protocol} Residential</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Chatbot</span>
                <span className={enableChatbot ? 'text-blue-400' : 'text-slate-400'}>
                  {enableChatbot ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Daily warm-up</span>
                <span className={enableDailyWarmup ? 'text-emerald-400' : 'text-slate-400'}>
                  {enableDailyWarmup ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button onClick={handleClose} className="flex-1 py-2.5 text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all shadow-sm shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Finish &amp; Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
