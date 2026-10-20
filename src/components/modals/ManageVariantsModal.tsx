import React, { useState } from 'react';
import { ArticleListing, ArticleVariant } from '../../types';
import { X, Plus, RefreshCw, Eye, CheckCircle2 } from 'lucide-react';

interface ManageVariantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: ArticleListing | null;
  variants: ArticleVariant[];
  onRepostVariant: (variantId: string) => void;
  onAddVariant: (variant: Omit<ArticleVariant, 'id' | 'views' | 'lastRepostedAt'>) => void;
}

export const ManageVariantsModal: React.FC<ManageVariantsModalProps> = ({
  isOpen,
  onClose,
  article,
  variants,
  onRepostVariant,
  onAddVariant,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCity, setNewCity] = useState('Agadir & Inezgane');
  const [newTitle, setNewTitle] = useState('');
  const [newAccount, setNewAccount] = useState('0606599967');

  if (!isOpen || !article) return null;

  const articleVariants = variants.filter((v) => v.articleId === article.id);

  const handleCreateVariant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddVariant({
      articleId: article.id,
      account: newAccount,
      city: newCity,
      titleVariant: newTitle,
      status: 'Active',
    });
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">Manage Listing Variants</h2>
              <span className="text-xs font-mono text-slate-400">({article.variantsCount} total saved)</span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-xl mt-0.5">{article.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Quick Stats Strip */}
          <div className="grid grid-cols-4 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500">Active Listings</span>
              <p className="text-emerald-400 font-mono font-semibold text-sm">{article.activeCount}</p>
            </div>
            <div>
              <span className="text-slate-500">Archived</span>
              <p className="text-blue-400 font-mono font-semibold text-sm">{article.archivedCount}</p>
            </div>
            <div>
              <span className="text-slate-500">Total Views</span>
              <p className="text-slate-200 font-mono font-semibold text-sm">{article.views}</p>
            </div>
            <div>
              <span className="text-slate-500">Base Price</span>
              <p className="text-slate-200 font-mono font-semibold text-sm">{article.price} dhs</p>
            </div>
          </div>

          {/* Add Variant Form toggle */}
          {showAddForm ? (
            <form onSubmit={handleCreateVariant} className="p-4 bg-slate-950 rounded-xl border border-blue-500/40 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-400">Add New Variant for Rotation</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Variant Title (Spin syntax or alternate headline)</label>
                <input
                  type="text"
                  placeholder="e.g. Visseuse percussion 48V professionnelle..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Target City / Zone</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Assigned Account</label>
                  <select
                    value={newAccount}
                    onChange={(e) => setNewAccount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                  >
                    <option value="0606599967">0606599967</option>
                    <option value="0606629961">0606629961</option>
                    <option value="ArabePlus">ArabePlus</option>
                    <option value="o25@live.fr">o25@live.fr</option>
                    <option value="Mohamed.essaoudi11">Mohamed.essaoudi11</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
                >
                  Save Variant
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-400">Configured Title Variants</span>
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            </div>
          )}

          {/* Variants Table */}
          <div className="space-y-2">
            {articleVariants.length === 0 ? (
              <p className="text-center py-6 text-slate-500 text-xs">No specific variants registered yet.</p>
            ) : (
              articleVariants.map((variant) => (
                <div
                  key={variant.id}
                  className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-slate-700 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-200 truncate">{variant.titleVariant}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-blue-400 font-mono text-[11px] shrink-0">{variant.account}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span>{variant.city}</span>
                      <span className="text-slate-600">·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Eye className="w-3 h-3 text-slate-500" />
                        {variant.views} views
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="font-mono text-slate-500">Reposted {variant.lastRepostedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onRepostVariant(variant.id)}
                      title="Force repost now"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3 text-cyan-400" />
                      <span>Repost</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
