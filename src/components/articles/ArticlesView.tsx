import React, { useState } from 'react';
import { ArticleListing, ArticleVariant } from '../../types';
import {
  Search,
  RefreshCw,
  FileArchive,
  Eye,
  ChevronDown,
} from 'lucide-react';
import { ManageVariantsModal } from '../modals/ManageVariantsModal';
import { ImportZipModal } from '../modals/ImportZipModal';
import { EditArticleModal } from '../modals/EditArticleModal';
import { ConfirmActionModal } from '../modals/ConfirmActionModal';

interface ArticlesViewProps {
  articles: ArticleListing[];
  variants: ArticleVariant[];
  onRefreshViews: () => void;
  onImportZip: (title: string, price: number, variantsCount: number) => void;
  onRepostVariant: (variantId: string) => void;
  onAddVariant: (variant: Omit<ArticleVariant, 'id' | 'views' | 'lastRepostedAt'>) => void;
  onToggleArticleStatus: (articleId: string) => void;
  onNavigateToConversations: (articleId: string) => void;
  onUpdateArticle?: (updatedArticle: ArticleListing) => void;
  onArchiveOnFacebook?: (articleId: string) => void;
  onDeleteFromFacebook?: (articleId: string) => void;
  onDeleteFromWorkspace?: (articleId: string) => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({
  articles,
  variants,
  onRefreshViews,
  onImportZip,
  onRepostVariant,
  onAddVariant,
  onToggleArticleStatus,
  onNavigateToConversations,
  onUpdateArticle,
  onArchiveOnFacebook,
  onDeleteFromFacebook,
  onDeleteFromWorkspace,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft' | 'Archived'>('Published');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedArticleForVariants, setSelectedArticleForVariants] = useState<ArticleListing | null>(null);
  const [selectedArticleForEdit, setSelectedArticleForEdit] = useState<ArticleListing | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);
  const [perPage, setPerPage] = useState<number>(10);

  // Confirm Action Dialog State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmVariant: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmVariant: 'danger',
    onConfirm: () => {},
  });

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onRefreshViews();
    }, 800);
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalViews = articles.reduce((acc, a) => acc + a.views, 0);
  const totalAccountListings = articles.reduce((acc, a) => acc + a.totalAccountListings, 0);

  // Action handlers
  const handleArchiveOnFB = (article: ArticleListing) => {
    if (onArchiveOnFacebook) {
      onArchiveOnFacebook(article.id);
    } else {
      onToggleArticleStatus(article.id);
    }
  };

  const promptDeleteFromFB = (article: ArticleListing) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete from Facebook Marketplace',
      message: `Are you sure you want to delete "${article.title}" from Facebook Marketplace? This will remove all ${article.totalAccountListings} active listings across linked accounts.`,
      confirmText: 'Delete from Facebook',
      confirmVariant: 'danger',
      onConfirm: () => {
        if (onDeleteFromFacebook) {
          onDeleteFromFacebook(article.id);
        }
      },
    });
  };

  const promptDeleteFromWorkspace = (article: ArticleListing) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete from Workspace',
      message: `Are you sure you want to remove "${article.title}" from your workspace? This will permanently erase the product, its rotation variants, and settings.`,
      confirmText: 'Delete from workspace',
      confirmVariant: 'danger',
      onConfirm: () => {
        if (onDeleteFromWorkspace) {
          onDeleteFromWorkspace(article.id);
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Articles</h1>
          <p className="text-sm text-slate-400 mt-1">Manage what you sell across multi-account Facebook Marketplace.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
            <span>{isRefreshing ? 'Checking...' : 'Refresh views'}</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <FileArchive className="w-4 h-4" />
            <span>Import ZIP</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
        <div className="space-y-1">
          <span className="text-xs text-slate-400">Total Products</span>
          <p className="text-2xl font-bold font-mono text-white tracking-tight">{articles.length}</p>
          <span className="text-[11px] text-slate-500">{articles.length} active catalog articles</span>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-slate-400">Facebook Listings</span>
          <p className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">{totalAccountListings}</p>
          <span className="text-[11px] text-slate-500">Spread over multi-account network</span>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-slate-400">Total Marketplace Views</span>
          <p className="text-2xl font-bold font-mono text-blue-400 tracking-tight">{totalViews}</p>
          <span className="text-[11px] text-slate-500">Synchronized hourly</span>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-slate-400">Title Variants Generated</span>
          <p className="text-2xl font-bold font-mono text-purple-400 tracking-tight">
            {articles.reduce((acc, a) => acc + a.variantsCount, 0)}
          </p>
          <span className="text-[11px] text-slate-500">Auto-repost pool</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-2 bg-slate-900/90 border border-slate-800 rounded-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search listings by title, keyword or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Status Dropdown & Filters */}
        <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="Published" className="bg-slate-900 text-white">Published</option>
              <option value="Draft" className="bg-slate-900 text-white">Draft</option>
              <option value="Archived" className="bg-slate-900 text-white">Archived</option>
              <option value="All" className="bg-slate-900 text-white">All listings</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
            }}
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-950/50 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Articles Table (Matching exact design from reference) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-sm min-h-[360px] flex flex-col justify-between">
        <div className="overflow-x-auto sm:overflow-visible flex-1 pb-16">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">Listing</th>
                <th className="py-3.5 px-5 text-right">Price</th>
                <th className="py-3.5 px-5 text-center">Status</th>
                <th className="py-3.5 px-5">Updated</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No listings match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    {/* Listing Column */}
                    <td className="py-4 px-5">
                      <div className="flex items-start gap-3.5">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 relative">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        <div className="space-y-1.5 min-w-0">
                          <h3 className="font-semibold text-white text-sm leading-snug line-clamp-1">
                            {article.title}
                          </h3>

                          {/* Subtitle & Pill Badges: Active, Archived, Deleted */}
                          <div className="flex items-center flex-wrap gap-2 text-[11px]">
                            <span className="text-slate-400 font-medium">
                              {article.totalAccountListings} account listings
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              Active {article.activeCount}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                              Archived {article.archivedCount}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              Deleted {article.deletedCount}
                            </span>
                          </div>

                          {/* Views & Manage variants link */}
                          <div className="flex items-center gap-3 pt-0.5">
                            <span className="flex items-center gap-1 font-mono text-slate-400 text-[11px]">
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>{article.views} views</span>
                            </span>
                            <span className="text-slate-600">·</span>
                            <button
                              onClick={() => setSelectedArticleForVariants(article)}
                              className="text-blue-400 hover:text-blue-300 font-medium hover:underline text-[11px] cursor-pointer"
                            >
                              Manage variants ({article.variantsCount})
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price Column */}
                    <td className="py-4 px-5 text-right font-mono font-bold text-sm text-white whitespace-nowrap">
                      {article.price} dhs
                    </td>

                    {/* Status Column (Pill Badge) */}
                    <td className="py-4 px-5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        {article.status}
                      </span>
                    </td>

                    {/* Updated Column */}
                    <td className="py-4 px-5 font-mono text-slate-400 text-xs whitespace-nowrap">
                      {article.updatedAt}
                    </td>

                    {/* Actions Column (Actions ▾ Dropdown) */}
                    <td className="py-4 px-5 text-right whitespace-nowrap relative">
                      <div className="inline-block relative text-left">
                        <button
                          onClick={() =>
                            setActiveActionMenuId(
                              activeActionMenuId === article.id ? null : article.id
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700/80 rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          <span>Actions</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeActionMenuId === article.id && (
                          <>
                            {/* Backdrop click dismiss */}
                            <div
                              className="fixed inset-0 z-20"
                              onClick={() => setActiveActionMenuId(null)}
                            />

                            {/* Menu Container */}
                            <div className="absolute right-0 top-full mt-1.5 w-48 bg-slate-900 border border-slate-700/90 rounded-xl shadow-2xl py-1 z-30 text-left divide-y divide-slate-800/80 animate-in fade-in duration-100">
                              <div className="py-1">
                                {/* 1. Edit details */}
                                <button
                                  onClick={() => {
                                    setSelectedArticleForEdit(article);
                                    setActiveActionMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/90 flex items-center transition-colors cursor-pointer"
                                >
                                  <span>Edit details</span>
                                </button>

                                {/* 2. Conversations */}
                                <button
                                  onClick={() => {
                                    onNavigateToConversations(article.id);
                                    setActiveActionMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/90 flex items-center transition-colors cursor-pointer"
                                >
                                  <span>Conversations</span>
                                </button>

                                {/* 3. Account listings */}
                                <button
                                  onClick={() => {
                                    setSelectedArticleForVariants(article);
                                    setActiveActionMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/90 flex items-center transition-colors cursor-pointer"
                                >
                                  <span>Account listings</span>
                                </button>

                                {/* 4. Archive on Facebook */}
                                <button
                                  onClick={() => {
                                    handleArchiveOnFB(article);
                                    setActiveActionMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/90 flex items-center transition-colors cursor-pointer"
                                >
                                  <span>Archive on Facebook</span>
                                </button>

                                {/* 5. Delete from Facebook */}
                                <button
                                  onClick={() => {
                                    promptDeleteFromFB(article);
                                    setActiveActionMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center transition-colors cursor-pointer"
                                >
                                  <span>Delete from Facebook</span>
                                </button>
                              </div>

                              {/* 6. Delete from workspace */}
                              <div className="pt-1">
                                <button
                                  onClick={() => {
                                    promptDeleteFromWorkspace(article);
                                    setActiveActionMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center transition-colors cursor-pointer"
                                >
                                  <span>Delete from workspace</span>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span className="font-mono">
            1–{filteredArticles.length} of {articles.length} listings
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Per page</span>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="bg-slate-900 border border-slate-800 text-slate-300 rounded-md px-2 py-1 text-xs focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <button disabled className="px-2.5 py-1 text-slate-600 rounded cursor-not-allowed">
                Previous
              </button>
              <span className="px-2.5 py-1 bg-blue-600/20 text-blue-400 font-semibold rounded">
                1
              </span>
              <button disabled className="px-2.5 py-1 text-slate-600 rounded cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Details Modal */}
      <EditArticleModal
        isOpen={Boolean(selectedArticleForEdit)}
        onClose={() => setSelectedArticleForEdit(null)}
        article={selectedArticleForEdit}
        onSave={(updated) => {
          if (onUpdateArticle) {
            onUpdateArticle(updated);
          }
        }}
      />

      {/* Manage Variants / Account Listings Modal */}
      <ManageVariantsModal
        isOpen={Boolean(selectedArticleForVariants)}
        onClose={() => setSelectedArticleForVariants(null)}
        article={selectedArticleForVariants}
        variants={variants}
        onRepostVariant={onRepostVariant}
        onAddVariant={onAddVariant}
      />

      {/* Import ZIP Archive Modal */}
      <ImportZipModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={onImportZip}
      />

      {/* Confirmation Modal */}
      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmVariant={confirmModal.confirmVariant}
      />

    </div>
  );
};
