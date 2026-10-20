import React, { useState } from 'react';
import {
  ChatbotSettings,
  CityFee,
  UserAccount,
  NavTab,
} from '../../types';
import {
  Download,
  Upload,
  Clock,
  Users2,
  Plus,
  Shield,
  Key,
  Save,
  CheckCircle2,
  Trash2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { AddUserModal } from '../modals/AddUserModal';

interface SettingsViewProps {
  chatbotSettings: ChatbotSettings;
  cityFees: CityFee[];
  users: UserAccount[];
  onSaveChatbotSettings: (settings: ChatbotSettings) => void;
  onSaveCityFees: (fees: CityFee[]) => void;
  onAddUser: (user: UserAccount) => void;
  onOpenActivity: () => void;
  onNavigateToAccounts: () => void;
  onTriggerImportCapture: () => void;
  onToast?: (type: 'success' | 'info' | 'error', title: string, desc?: string) => void;
  onUpdatePassword?: (newPassword: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  chatbotSettings: initialSettings,
  cityFees: initialCityFees,
  users,
  onSaveChatbotSettings,
  onSaveCityFees,
  onAddUser,
  onOpenActivity,
  onNavigateToAccounts,
  onTriggerImportCapture,
  onToast,
  onUpdatePassword,
}) => {
  // Local state for chatbot form
  const [settings, setSettings] = useState<ChatbotSettings>(initialSettings);
  const [fees, setFees] = useState<CityFee[]>(initialCityFees);
  const [autoReposting, setAutoReposting] = useState(true);
  const [showMoreSalesAnswers, setShowMoreSalesAnswers] = useState(false);
  const [showStoreInstallation, setShowStoreInstallation] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // New city fee row inputs
  const [newCityAliases, setNewCityAliases] = useState('');
  const [newCityFee, setNewCityFee] = useState('30');
  const [showAddCityForm, setShowAddCityForm] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordUpdatedMessage, setPasswordUpdatedMessage] = useState(false);

  // Save handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveChatbotSettings(settings);
    onSaveCityFees(fees);
  };

  const handleAddCityFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityAliases.trim()) return;

    const newFeeItem: CityFee = {
      id: `fee-${Date.now()}`,
      cityAliases: newCityAliases.trim(),
      fee: parseInt(newCityFee, 10) || 30,
    };

    const updated = [...fees, newFeeItem];
    setFees(updated);
    onSaveCityFees(updated);
    setNewCityAliases('');
    setShowAddCityForm(false);
  };

  const handleRemoveCityFee = (id: string) => {
    const updated = fees.filter((f) => f.id !== id);
    setFees(updated);
    onSaveCityFees(updated);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      onToast?.('error', 'Weak Password', 'New password must contain at least 8 characters.');
      return;
    }
    setPasswordUpdatedMessage(true);
    onUpdatePassword?.(newPassword);
    onToast?.('success', 'Password Updated', 'New password saved for dashboard login.');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordUpdatedMessage(false), 3000);
  };

  return (
    <div className="space-y-8 w-full pb-12 text-xs">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Workspace rules, automated reposting schedules, and Darija chatbot response parameters.
        </p>
      </div>

      {/* 1. Imports & activity */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white">Imports & activity</h2>
          <p className="text-slate-400 mt-0.5">Capture Facebook Marketplace catalog and message audit logs</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onTriggerImportCapture}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium rounded-xl border border-slate-700/80 transition-colors"
          >
            Import account listings
          </button>
          <button
            type="button"
            onClick={onTriggerImportCapture}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium rounded-xl border border-slate-700/80 transition-colors"
          >
            Import conversation capture
          </button>
          <button
            type="button"
            onClick={onOpenActivity}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 font-medium rounded-xl border border-slate-700/80 transition-colors"
          >
            View activity
          </button>
        </div>
      </div>

      {/* 2. Facebook accounts shortcut banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">Facebook accounts</h2>
          <p className="text-slate-400 mt-0.5">Manage connections, proxies and chatbot switches in Accounts.</p>
        </div>
        <button
          onClick={onNavigateToAccounts}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium rounded-xl border border-slate-700 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          Open Accounts
        </button>
      </div>

      {/* 3. Automatic reposting */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-white">Automatic reposting</h2>
            <div className="flex items-center gap-2.5 pt-1">
              <label className="text-sm font-medium text-slate-200">
                Automatically repost after 24 hours without new views
              </label>
              <button
                type="button"
                onClick={() => setAutoReposting(!autoReposting)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoReposting ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoReposting ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <p className="text-slate-400 leading-relaxed max-w-3xl">
          Publish a different saved variant at random, then archive the old Facebook listing after publication is confirmed.
          Counts are checked hourly. Archived listings and listings without known views or another saved variant are skipped.
          Article details, photos, conversations and orders stay saved. In-progress reposts finish when you turn this off.
        </p>

        <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-amber-300">
          <span className="font-semibold">1 reposts need attention.</span> Review Activity before requesting another publication.
        </div>
      </div>

      {/* 4. Users */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">Users</h2>
            <p className="text-slate-400 mt-0.5">Each user has full administrator access to this workspace.</p>
          </div>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add user</span>
          </button>
        </div>

        <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
          {users.map((u) => (
            <div key={u.id} className="p-4 flex items-center justify-between gap-4 bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{u.name}</span>
                    {u.isCurrentUser && (
                      <span className="px-1.5 py-0.2 bg-blue-950 text-blue-400 font-mono text-[10px] rounded border border-blue-900">
                        You
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px] mt-0.5">
                    <span className="text-emerald-400 font-medium">Active</span>
                    <span>·</span>
                    <span>{u.role}</span>
                    <span>·</span>
                    <span>Last sign-in: {u.lastSignIn}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onToast?.('info', 'Edit User', `Admin permissions active for ${u.name}`)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700/80"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Facebook connection */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white">Facebook connection</h2>
          <p className="text-slate-400 mt-0.5">Browser session bridge & Edge extension configuration</p>
        </div>

        <button
          onClick={() => onToast?.('success', 'Extension Ready', 'Edge extension manifest package prepared for install.')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Install in Edge</span>
        </button>

        <div className="space-y-1 text-slate-400 leading-relaxed">
          <p>Download the extension and follow the Edge setup steps.</p>
          <p className="text-slate-300">
            Your Facebook session is configured. You can import articles, publish and reply from this dashboard.
          </p>
          <p className="text-slate-500 text-[11px]">
            Facebook may ask you to choose a category or confirm your location. Any unfinished step appears in Activity.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowStoreInstallation(!showStoreInstallation)}
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium pt-1"
          >
            {showStoreInstallation ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span>Enable store installation</span>
          </button>

          {showStoreInstallation && (
            <div className="p-3.5 mt-2 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 space-y-2">
              <p>For headless cloud deployment, upload packed Chrome/Edge manifest v3 extension to local storage.</p>
              <div className="font-mono text-[11px] text-slate-500">ID: cpanel-edge-ext-v2.4.9</div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Chatbot & orders configuration */}
      <form onSubmit={handleSaveSettings} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">Chatbot & orders</h2>
              <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-medium bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-900/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Automatic replies on
              </span>
            </div>
            <p className="text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Answer buyer questions and collect order details. Once enabled, the bot runs on the server even when Edge and this dashboard are closed. You can pause it in any conversation.
            </p>
          </div>
        </div>

        {/* Top Toggles */}
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-slate-200">
            <input
              type="checkbox"
              checked={settings.autoRepliesEnabled}
              onChange={(e) => setSettings({ ...settings, autoRepliesEnabled: e.target.checked })}
              className="rounded border-slate-700 text-blue-600 focus:ring-0"
            />
            <span>Enable automatic replies</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-200">
            <input
              type="checkbox"
              checked={settings.confirmOrders}
              onChange={(e) => setSettings({ ...settings, confirmOrders: e.target.checked })}
              className="rounded border-slate-700 text-blue-600 focus:ring-0"
            />
            <span>Confirm orders</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-200">
            <input
              type="checkbox"
              checked={settings.cashOnDelivery}
              onChange={(e) => setSettings({ ...settings, cashOnDelivery: e.target.checked })}
              className="rounded border-slate-700 text-blue-600 focus:ring-0"
            />
            <span>Cash on delivery</span>
          </label>
        </div>

        {/* Reply delays */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Minimum reply delay (seconds)</label>
            <input
              type="number"
              min="0"
              value={settings.minReplyDelaySeconds}
              onChange={(e) => setSettings({ ...settings, minReplyDelaySeconds: parseInt(e.target.value, 10) || 0 })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Maximum reply delay (seconds)</label>
            <input
              type="number"
              min="0"
              value={settings.maxReplyDelaySeconds}
              onChange={(e) => setSettings({ ...settings, maxReplyDelaySeconds: parseInt(e.target.value, 10) || 0 })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <p className="text-slate-500 text-[11px]">
          Wait a random time within this range before answering. Messages sent close together receive one response. Applies to all accounts. Set both to 0 for instant replies.
        </p>

        {/* Reply Language & Greeting */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Reply language</label>
            <select
              value={settings.replyLanguage}
              onChange={(e) => setSettings({ ...settings, replyLanguage: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Darija">Darija (Moroccan Arabic)</option>
              <option value="Français">Français</option>
              <option value="العربية">العربية الفصحى</option>
              <option value="English">English</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-medium mb-1.5">Greeting answer</label>
            <input
              type="text"
              value={settings.greetingAnswer}
              onChange={(e) => setSettings({ ...settings, greetingAnswer: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Delivery answer & Other cities fee */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-medium mb-1.5">Delivery answer</label>
            <textarea
              rows={2}
              value={settings.deliveryAnswer}
              onChange={(e) => setSettings({ ...settings, deliveryAnswer: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Other cities delivery fee (MAD)</label>
            <input
              type="number"
              value={settings.otherCitiesFee}
              onChange={(e) => setSettings({ ...settings, otherCitiesFee: parseInt(e.target.value, 10) || 0 })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Leave blank to ask seller. Enter 0 for free delivery.
            </span>
          </div>
        </div>

        {/* Shop location & Seller contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Shop location answer</label>
            <textarea
              rows={2}
              value={settings.shopLocationAnswer}
              onChange={(e) => setSettings({ ...settings, shopLocationAnswer: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Reply when buyer asks where your shop is or if you only deliver.
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Seller contact answer</label>
            <textarea
              rows={2}
              value={settings.sellerContactAnswer}
              onChange={(e) => setSettings({ ...settings, sellerContactAnswer: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Reply when a buyer asks for your phone number.
            </span>
          </div>
        </div>

        {/* More Sales answers accordion */}
        <div>
          <button
            type="button"
            onClick={() => setShowMoreSalesAnswers(!showMoreSalesAnswers)}
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium"
          >
            {showMoreSalesAnswers ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span>More sales answers</span>
          </button>

          {showMoreSalesAnswers && (
            <div className="p-4 mt-2 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Warranty policy response</label>
                <input
                  type="text"
                  value={settings.warrantyAnswer || ''}
                  onChange={(e) => setSettings({ ...settings, warrantyAnswer: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Stock availability response</label>
                <input
                  type="text"
                  value={settings.stockAnswer || ''}
                  onChange={(e) => setSettings({ ...settings, stockAnswer: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Discounts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="discount-toggle"
              checked={settings.offerLastPriceDiscount}
              onChange={(e) => setSettings({ ...settings, offerLastPriceDiscount: e.target.checked })}
              className="rounded border-slate-700 text-blue-600 focus:ring-0"
            />
            <label htmlFor="discount-toggle" className="text-slate-300 cursor-pointer">
              Offer a last-price discount
            </label>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Last-price discount (%)</label>
            <input
              type="number"
              value={settings.lastPriceDiscountPercent}
              onChange={(e) => setSettings({ ...settings, lastPriceDiscountPercent: parseInt(e.target.value, 10) || 0 })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Discount price rounding</label>
            <select
              value={settings.discountRounding}
              onChange={(e) => setSettings({ ...settings, discountRounding: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Whole dhs (round up)">Whole dhs (round up)</option>
              <option value="Exact (2 decimals)">Exact (2 decimals)</option>
            </select>
          </div>
        </div>

        {/* City Delivery Fees Table */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white">City delivery fees</h3>
            <p className="text-slate-400 mt-0.5">
              These override the fee for other cities. Add alternate city names separated by commas.
            </p>
          </div>

          <div className="space-y-2">
            {fees.map((feeItem) => (
              <div
                key={feeItem.id}
                className="flex items-center justify-between gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-slate-200">{feeItem.cityAliases}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono font-bold text-white text-sm">{feeItem.fee} MAD</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCityFee(feeItem.id)}
                    className="px-2.5 py-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors border border-rose-900/40 text-[11px]"
                  >
                    Remove city fee
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showAddCityForm ? (
            <div className="p-3 bg-slate-950 rounded-xl border border-blue-500/40 space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">City / aliases (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Marrakech, مراكش, Gueliz"
                  value={newCityAliases}
                  onChange={(e) => setNewCityAliases(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32">
                  <label className="block text-slate-400 mb-1">Fee (MAD)</label>
                  <input
                    type="number"
                    value={newCityFee}
                    onChange={(e) => setNewCityFee(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <div className="flex items-end gap-2 pt-5">
                  <button
                    type="button"
                    onClick={handleAddCityFee}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCityForm(false)}
                    className="px-3 py-1.5 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddCityForm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add city fee</span>
            </button>
          )}
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-sm shadow-blue-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save chatbot settings</span>
          </button>
        </div>

      </form>

      {/* 7. Your password */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white">Your password</h2>
          <p className="text-slate-400 mt-0.5">Secure your administrator credentials</p>
        </div>

        {passwordUpdatedMessage && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Your password has been successfully updated.</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label className="block text-slate-300 font-medium mb-1.5">Current password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-slate-300 font-medium mb-1.5">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="At least 12 characters"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium rounded-xl border border-slate-700 transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={onAddUser}
      />

    </div>
  );
};
