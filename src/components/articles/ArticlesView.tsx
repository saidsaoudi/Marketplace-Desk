import React, { useState } from 'react';
import { ArticleListing, ArticleVariant } from '../../types';
import {
  Search,
  RefreshCw,
  FileArchive,
  Filter,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ArrowUpDown,
  MoreVertical,
  Check,
  Plus,
} from 'lucide-react';
import { ManageVariantsModal } from '../modals/ManageVariantsModal';
import { ImportZipModal } from '../modals/ImportZipModal';

interface ArticlesViewProps {
  articles: ArticleListing[];
  variants: ArticleVariant[];
  onRefreshViews: () => void;
  onImportZip: (title: string, price: number, variantsCount: number) => void;
  onRepostVariant: (variantId: string) => void;
  onAddVariant: (variant: Omit<ArticleVariant, 'id' | 'views' | 'lastRepostedAt'>) => void;
  onToggleArticleStatus: (articleId: string) => void;
  onNavigateToConversations: (articleId: string) => void;
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
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft' | 'Archived'>('Published');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedArticleForVariants, setSelectedArticleForVariants] = useState<ArticleListing | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

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
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
            <span>{isRefreshing ? 'Checking...' : 'Refresh views'}</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-500/20 transition-all"
          >
            <FileArchive className="w-4 h-4" />
            <span>Import ZIP</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (Anti-slop zero-pill clean layout) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
        <div className="space-y-1">
          <span className="text-xs text-slate-400">Total Products</span>
          <p className="text-2xl font-bold font-mono text-white tracking-tight">{articles.length}</p>
          <span className="text-[11px] text-slate-500">2 active catalog articles</span>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-slate-400">Facebook Listings</span>
          <p className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">{totalAccountListings}</p>
          <span className="text-[11px] text-slate-500">Spread over 5 FB accounts</span>
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
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-950/50 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Articles Table (Clean modern data grid) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
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
                              // Resilient fallback container if image fails
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        <div className="space-y-1.5 min-w-0">
                          <h3 className="font-semibold text-white text-sm leading-snug line-clamp-1">
                            {article.title}
                          </h3>

                          {/* Zero-pill metadata line */}
                          <div className="flex items-center flex-wrap gap-2 text-slate-400 text-[11px]">
                            <span className="font-mono text-slate-300 font-medium">
                              {article.totalAccountListings} account listings
                            </span>
                            <span className="text-slate-600">·</span>
                            <span className="text-emerald-400 font-mono">Active {article.activeCount}</span>
                            <span className="text-slate-600">·</span>
                            <span className="text-blue-400 font-mono">Archived {article.archivedCount}</span>
                            <span className="text-slate-600">·</span>
                            <span className="text-slate-500 font-mono">Deleted {article.deletedCount}</span>
                          </div>

                          <div className="flex items-center gap-3 pt-0.5">
                            <span className="flex items-center gap-1 font-mono text-slate-400 text-[11px]">
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>{article.views} views</span>
                            </span>
                            <span className="text-slate-600">·</span>
                            <button
                              onClick={() => setSelectedArticleForVariants(article)}
                              className="text-blue-400 hover:text-blue-300 font-medium hover:underline text-[11px]"
                            >
                              Manage variants ({article.variantsCount})
                            </button>
                            <span className="text-slate-600">·</span>
                            <button
                              onClick={() => onNavigateToConversations(article.id)}
                              className="text-slate-400 hover:text-slate-200 text-[11px]"
                            >
                              {article.conversationsCount} conversations ({article.unreadConversationsCount} unread)
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price Column */}
                    <td className="py-4 px-5 text-right font-mono font-bold text-sm text-white whitespace-nowrap">
                      {article.price} dhs
                    </td>

                    {/* Status Column (Clean unboxed indicator) */}
                    <td className="py-4 px-5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-blue-400 font-medium text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        {article.status}
                      </span>
                    </td>

                    {/* Updated Column */}
                    <td className="py-4 px-5 font-mono text-slate-400 text-xs whitespace-nowrap">
                      {article.updatedAt}
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-5 text-right whitespace-nowrap relative">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedArticleForVariants(article)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          Variants
                        </button>

                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveActionMenuId(
                                activeActionMenuId === article.id ? null : article.id
                              )
                            }
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeActionMenuId === article.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-30 text-left">
                              <button
                                onClick={() => {
                                  setSelectedArticleForVariants(article);
                                  setActiveActionMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                              >
                                <span>Configure rotation</span>
                              </button>
                              <button
                                onClick={() => {
                                  onNavigateToConversations(article.id);
                                  setActiveActionMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                              >
                                <span>View buyer chats</span>
                              </button>
                              <button
                                onClick={() => {
                                  onToggleArticleStatus(article.id);
                                  setActiveActionMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-amber-400 hover:bg-slate-800 flex items-center gap-2"
                              >
                                <span>Archive listing</span>
                              </button>
                            </div>
                          )}
                        </div>
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
          <span className="font-mono">1–{filteredArticles.length} of {articles.length} listings</span>
          <div className="flex items-center gap-4">
            <span className="font-mono">Per page 10</span>
            <div className="flex items-center gap-1 font-mono">
              <button disabled className="px-2.5 py-1 text-slate-600 rounded">Previous</button>
              <span className="px-2.5 py-1 bg-blue-600/20 text-blue-400 font-semibold rounded">1 / 1</span>
              <button disabled className="px-2.5 py-1 text-slate-600 rounded">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Variants Modal */}
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

    </div>
  );
};
