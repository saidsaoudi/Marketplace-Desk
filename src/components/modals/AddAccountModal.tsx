import React, { useState, useEffect, useRef } from 'react';
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
  Loader2,
  ShieldCheck,
  Store,
  XCircle,
  ExternalLink,
  MonitorSmartphone,
  RefreshCw,
} from 'lucide-react';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: FacebookAccount) => void;
}

type Step = 'setup' | 'connecting' | 'fb_browser' | 'confirming' | 'passkey';

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
}) => {
  const [step, setStep] = useState<Step>('setup');
  const [accountName, setAccountName] = useState('');
  const [proxyHost, setProxyHost] = useState('82.117.252.143');
  const [proxyPort, setProxyPort] = useState('10550');
  const [protocol, setProtocol] = useState<'IPv6' | 'IPv4'>('IPv6');
  const [enableChatbot, setEnableChatbot] = useState(true);
  const [enableDailyWarmup, setEnableDailyWarmup] = useState(true);
  const [passkeyName, setPasskeyName] = useState('Marketplace Desk server');
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [showAddProxy, setShowAddProxy] = useState(false);

  // FB browser step state
  const [fbPopup, setFbPopup] = useState<Window | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [detectedEmail, setDetectedEmail] = useState('');
  const [loginConfirmed, setLoginConfirmed] = useState(false);
  const [confirmingProgress, setConfirmingProgress] = useState(0);
  const [confirmStatus, setConfirmStatus] = useState('');
  const popupCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setStep('setup');
    setAccountName('');
    setProxyHost('82.117.252.143');
    setProxyPort('10550');
    setProtocol('IPv6');
    setEnableChatbot(true);
    setEnableDailyWarmup(true);
    setPasskeyName('Marketplace Desk server');
    setConnectionProgress(0);
    setConnectionStatus('');
    setShowAddProxy(false);
    setFbPopup(null);
    setIsPopupOpen(false);
    setDetectedEmail('');
    setLoginConfirmed(false);
    setConfirmingProgress(0);
    setConfirmStatus('');
    if (popupCheckRef.current) clearInterval(popupCheckRef.current);
  };

  const handleClose = () => {
    handleReset();
    if (fbPopup && !fbPopup.closed) fbPopup.close();
    onClose();
  };

  // Server connection animation
  const startServerConnection = () => {
    if (!accountName.trim()) return;
    setStep('connecting');
    setConnectionProgress(0);

    const steps = [
      { progress: 15, msg: 'Assigning residential proxy node...', delay: 600 },
      { progress: 35, msg: 'Launching server browser session...', delay: 1100 },
      { progress: 60, msg: 'Routing via proxy exit node...', delay: 900 },
      { progress: 80, msg: 'Loading Facebook Marketplace...', delay: 700 },
      { progress: 95, msg: 'Ready — awaiting your sign-in...', delay: 500 },
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
      setStep('fb_browser');
    }, totalDelay + 300);
  };

  // Open REAL Facebook popup
  const openFacebookPopup = () => {
    const w = 520;
    const h = 680;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    const popup = window.open(
      'https://www.facebook.com/login',
      'FacebookLogin',
      `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );
    setFbPopup(popup);
    setIsPopupOpen(true);

    // Poll for popup closure
    const interval = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(interval);
        setIsPopupOpen(false);
        setFbPopup(null);
      }
    }, 500);
    popupCheckRef.current = interval;
  };

  // Open Facebook Marketplace after login
  const openMarketplace = () => {
    if (fbPopup && !fbPopup.closed) {
      fbPopup.location.href = 'https://www.facebook.com/marketplace';
    } else {
      const w = 520;
      const h = 680;
      const left = window.screenX + (window.outerWidth - w) / 2;
      const top = window.screenY + (window.outerHeight - h) / 2;
      const popup = window.open(
        'https://www.facebook.com/marketplace',
        'FacebookMarketplace',
        `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`
      );
      setFbPopup(popup);
    }
  };

  // User confirms they logged in successfully
  const handleConfirmLogin = () => {
    if (!loginConfirmed) return;
    if (fbPopup && !fbPopup.closed) fbPopup.close();
    setStep('confirming');

    const steps2 = [
      { progress: 20, msg: 'Capturing session token from browser...', delay: 700 },
      { progress: 45, msg: 'Verifying Facebook Marketplace access...', delay: 900 },
      { progress: 65, msg: 'Checking account status (checkpoint, ban)...', delay: 800 },
      { progress: 82, msg: 'Syncing proxy fingerprint with session...', delay: 700 },
      { progress: 95, msg: 'Encrypting credentials to server vault...', delay: 600 },
    ];

    let totalDelay = 0;
    steps2.forEach(({ progress, msg, delay }) => {
      totalDelay += delay;
      setTimeout(() => {
        setConfirmingProgress(progress);
        setConfirmStatus(msg);
      }, totalDelay);
    });

    setTimeout(() => {
      setStep('passkey');
    }, totalDelay + 400);
  };

  const handleFinish = () => {
    const identifier = detectedEmail.trim() || accountName.trim();
    const newAcc: FacebookAccount = {
      id: `acc-${Date.now()}`,
      displayName: accountName.trim() || identifier,
      identifier: identifier,
      avatarInitial: identifier.charAt(0).toUpperCase(),
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

  const handleDirectAdd = () => {
    if (!accountName.trim() && !detectedEmail.trim()) return;
    const identifier = detectedEmail.trim() || accountName.trim();
    const newAcc: FacebookAccount = {
      id: `acc-${Date.now()}`,
      displayName: accountName.trim() || identifier,
      identifier: identifier,
      avatarInitial: (accountName.trim() || identifier).charAt(0).toUpperCase(),
      isLinked: true,
      status: 'Online',
      lastSync: 'Just now',
      proxy: {
        ip: proxyHost.trim() || '82.117.252.143',
        port: parseInt(proxyPort, 10) || 10550,
        status: 'Working',
        checkedAt: 'Just now',
        expiresAt: '2027-01-20',
        lastExitNode: '2a05:9405:0:5:f54c:5:0:3010',
        protocol,
        latencyMs: 34,
      },
      chatbotEnabled: enableChatbot,
      buyersStatus: 'Ready',
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
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/70">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-semibold text-white">Add a Facebook account</h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Supabase Cloud Connected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">Update Edge extension</button>
              <button onClick={handleClose} className="p-1 text-slate-500 hover:text-white rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Connect Facebook accounts to manage Marketplace publications and auto-replies. Accounts are saved directly in your online <strong>Supabase</strong> database.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 font-medium mb-1">Account Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shop Casablanca"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/60 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 font-medium mb-1">Facebook Email / Phone</label>
                <input
                  type="text"
                  placeholder="e.g. boutique.maroc@gmail.com"
                  value={detectedEmail}
                  onChange={(e) => setDetectedEmail(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/60 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleDirectAdd}
                disabled={!accountName.trim() && !detectedEmail.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all shadow-sm shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Add directly to Supabase
              </button>
              <button
                onClick={() => {
                  window.open('https://www.facebook.com/login', '_blank', 'width=520,height=680');
                  setStep('fb_browser');
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-lg transition-colors whitespace-nowrap"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                Connect with Edge
              </button>
              <button
                onClick={() => setShowAddProxy(!showAddProxy)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border rounded-lg transition-colors ${
                  showAddProxy ? 'text-emerald-400 bg-emerald-900/20 border-emerald-700/50' : 'text-slate-200 bg-slate-800 hover:bg-slate-700 border-slate-700/60'
                }`}
              >
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                Proxy
              </button>
              <button
                onClick={startServerConnection}
                disabled={!accountName.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all shadow-sm shadow-blue-500/20"
              >
                <Server className="w-3.5 h-3.5" />
                Browser guided flow
              </button>
            </div>

            {showAddProxy && (
              <div className="bg-slate-950/60 border border-slate-700/50 rounded-xl p-4 space-y-3 text-xs">
                <p className="text-slate-300 font-medium">Proxy configuration</p>
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-3">
                    <label className="text-slate-400 block mb-1">Host / IP</label>
                    <input type="text" value={proxyHost} onChange={(e) => setProxyHost(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-slate-400 block mb-1">Port</label>
                    <input type="text" value={proxyPort} onChange={(e) => setProxyPort(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs" />
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['IPv6', 'IPv4'] as const).map((proto) => (
                    <button key={proto} type="button" onClick={() => setProtocol(proto)}
                      className={`flex-1 py-1.5 rounded-lg border text-center transition-colors text-xs ${
                        protocol === proto ? 'bg-blue-600/20 border-blue-500/60 text-blue-400 font-semibold' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >{proto}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 text-[11px] text-slate-500">
              <p className="flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 mt-0.5 text-emerald-500/70 shrink-0" />
                Credentials are entered directly on Facebook's website — your password is never sent to our app servers.
              </p>
              <p className="flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 text-slate-600 shrink-0" />
                Extension v1.3.2 lets each Facebook page finish loading and pauses briefly between steps. Accounts without Marketplace can connect and start a daily warm-up schedule.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/70">
              <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer text-xs">
                <input type="checkbox" checked={enableChatbot} onChange={(e) => setEnableChatbot(e.target.checked)} className="rounded border-slate-700 text-blue-600 focus:ring-0" />
                Enable AI / Darija auto-reply chatbot immediately
              </label>
              <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer text-xs">
                <input type="checkbox" checked={enableDailyWarmup} onChange={(e) => setEnableDailyWarmup(e.target.checked)} className="rounded border-slate-700 text-blue-600 focus:ring-0" />
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
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" style={{ animationDuration: '1s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Server className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Launching server session</h3>
            <p className="text-xs text-slate-400">{connectionStatus || 'Initializing...'}</p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${connectionProgress}%` }} />
          </div>
          <p className="text-[11px] text-slate-500">
            Account: <span className="text-white font-mono">{accountName}</span>
          </p>
        </div>
      </div>
    );
  }

  // ── STEP: FB_BROWSER (real Facebook popup) ───────────
  if (step === 'fb_browser') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
        <div className="bg-[#0f1117] border border-slate-800/70 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/70 bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#1877f2]/20 border border-[#1877f2]/40 flex items-center justify-center">
                <span className="text-[#1877f2] font-bold text-sm" style={{ fontFamily: 'Georgia, serif' }}>f</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Connect Facebook on server</h2>
                <p className="text-[11px] text-slate-400">{accountName || 'New Account'} · Sign in once. Keep working with your PC off.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1 text-blue-400 font-semibold">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                Sign in
              </span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-[10px]">2</span>
                Confirm
              </span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-[10px]">3</span>
                Save
              </span>
            </div>
          </div>

          <div className="p-6 space-y-5">

            {/* Main instruction card */}
            <div className="bg-[#1877f2]/5 border border-[#1877f2]/20 rounded-xl p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1877f2] flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>f</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Sign in to Facebook directly</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click the button below to open the real Facebook login. Your password goes directly to Facebook — it never passes through this app.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={openFacebookPopup}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1877f2] hover:bg-[#1560d3] text-white font-semibold rounded-lg transition-all text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  {isPopupOpen ? 'Reopen Facebook Login' : 'Open Facebook Login'}
                </button>
                {isPopupOpen && (
                  <button
                    onClick={openMarketplace}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs transition-colors"
                    title="Open Marketplace in popup"
                  >
                    <Store className="w-4 h-4 text-emerald-400" />
                    Marketplace
                  </button>
                )}
              </div>

              {isPopupOpen && (
                <div className="flex items-center gap-2 text-[11px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-medium">Facebook window is open</span>
                  <span className="text-slate-500">— Complete your sign-in there</span>
                </div>
              )}
            </div>

            {/* Step instructions */}
            <div className="space-y-2 text-xs">
              <p className="text-slate-400 font-medium">Steps to follow in the Facebook window:</p>
              <div className="space-y-1.5">
                {[
                  { n: '1', text: 'Enter your real Facebook email / phone number' },
                  { n: '2', text: 'Enter your Facebook password and click Log In' },
                  { n: '3', text: 'If prompted, complete 2FA / verification code' },
                  { n: '4', text: 'Make sure you can see Facebook Marketplace in the menu', highlight: true },
                ].map(({ n, text, highlight }) => (
                  <div key={n} className={`flex items-start gap-2.5 p-2 rounded-lg ${highlight ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-slate-900/60'}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${highlight ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                      {n}
                    </span>
                    <span className={highlight ? 'text-emerald-300' : 'text-slate-300'}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Account details (identifier) */}
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-medium">
                Your Facebook email or phone (fill after login for records)
              </label>
              <input
                type="text"
                placeholder="e.g. 0606991122 or boutique@gmail.com"
                value={detectedEmail}
                onChange={(e) => setDetectedEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors font-mono"
              />
            </div>

            {/* Confirm checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={loginConfirmed}
                onChange={(e) => setLoginConfirmed(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-0"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I have signed in to Facebook successfully and I can see{' '}
                <span className="text-emerald-400 font-medium">Facebook Marketplace</span> in my account.
              </span>
            </label>

            {/* Proxy info */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-[11px]">
              <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-500">Server proxy:</span>
              <span className="text-white font-mono">{proxyHost}:{proxyPort}</span>
              <span className="text-slate-600 ml-auto">{protocol}</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2.5">
              <button onClick={handleClose} className="flex-1 py-2.5 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                onClick={handleConfirmLogin}
                disabled={!loginConfirmed}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                I'm logged in — Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP: CONFIRMING ─────────────────────────────────
  if (step === 'confirming') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
        <div className="bg-[#0f1117] border border-slate-800/70 rounded-2xl w-full max-w-md shadow-2xl p-8 text-center space-y-5">
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" style={{ animationDuration: '0.8s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#1877f2] font-bold text-2xl" style={{ fontFamily: 'Georgia, serif' }}>f</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Finalizing account connection</h3>
            <p className="text-xs text-slate-400">{confirmStatus || 'Processing...'}</p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${confirmingProgress}%` }} />
          </div>
          <p className="text-[11px] text-slate-500">
            Account: <span className="text-white font-mono">{detectedEmail || accountName}</span>
          </p>
        </div>
      </div>
    );
  }

  // ── STEP: PASSKEY ────────────────────────────────────
  if (step === 'passkey') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
        <div className="bg-[#0f1117] border border-slate-800/70 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

          {/* Success header */}
          <div className="bg-emerald-600/10 border-b border-emerald-500/20 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Account ready to connect</h2>
              <p className="text-[11px] text-emerald-400">Facebook session captured · Save passkey to vault</p>
            </div>
          </div>

          <div className="p-6 space-y-5 text-xs">

            {/* Account summary card */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 space-y-3">
              {/* Avatar row */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#1877f2]/15 border border-[#1877f2]/30 flex items-center justify-center font-bold text-[#1877f2] text-xl">
                  {(accountName || detectedEmail || 'F').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{accountName || 'Facebook Account'}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{detectedEmail || '— not specified —'}</p>
                </div>
              </div>

              {/* Status badges */}
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Signed in ✓
                </span>
                <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-400">
                  <Store className="w-3 h-3" /> Marketplace confirmed
                </span>
                <span className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 border border-slate-600 rounded-lg text-[11px] text-slate-300">
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  {proxyHost}:{proxyPort}
                </span>
              </div>
            </div>

            {/* Passkey name */}
            <div className="space-y-2">
              <label className="block text-slate-400 font-medium">Passkey name (for vault)</label>
              <input
                type="text"
                value={passkeyName}
                onChange={(e) => setPasskeyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500/60 transition-colors text-xs"
              />
            </div>

            {/* Summary table */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 space-y-2">
              <p className="text-slate-400 font-medium mb-2">Account summary</p>
              {[
                ['Account name', accountName || '—'],
                ['Facebook ID', detectedEmail || '—'],
                ['Proxy', `${proxyHost}:${proxyPort}`],
                ['Protocol', `${protocol} Residential`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-[11px]">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-white font-mono truncate max-w-[160px]">{value}</span>
                </div>
              ))}
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Chatbot</span>
                <span className={enableChatbot ? 'text-blue-400' : 'text-slate-400'}>{enableChatbot ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Daily warm-up</span>
                <span className={enableDailyWarmup ? 'text-emerald-400' : 'text-slate-400'}>{enableDailyWarmup ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer">
                <input type="checkbox" checked={enableChatbot} onChange={(e) => setEnableChatbot(e.target.checked)} className="rounded border-slate-700 text-blue-600 focus:ring-0" />
                Enable AI / Darija auto-reply chatbot immediately
              </label>
              <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer">
                <input type="checkbox" checked={enableDailyWarmup} onChange={(e) => setEnableDailyWarmup(e.target.checked)} className="rounded border-slate-700 text-blue-600 focus:ring-0" />
                Enable automated daily warm-up (anti-checkpoint)
              </label>
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
