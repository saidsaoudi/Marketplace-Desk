import React, { useState } from 'react';
import { Order, OrderStatus, ArticleListing } from '../../types';
import {
  Search,
  RefreshCw,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { OrderDetailsDrawer } from './OrderDetailsDrawer';

interface OrdersViewProps {
  orders: Order[];
  articles: ArticleListing[];
  onRefreshOrders: () => void;
  onUpdateOrder: (order: Order) => void;
  onOpenChatWithBuyer?: (buyerName: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  articles,
  onRefreshOrders,
  onUpdateOrder,
  onOpenChatWithBuyer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('In progress');
  const [articleFilter, setArticleFilter] = useState<string>('All articles');
  const [accountFilter, setAccountFilter] = useState<string>('All accounts');
  const [sortOption, setSortOption] = useState<'Newest' | 'Oldest' | 'Highest total'>('Newest');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onRefreshOrders();
    }, 600);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('In progress');
    setArticleFilter('All articles');
    setAccountFilter('All accounts');
    setSortOption('Newest');
  };

  // Filter pipeline
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      order.buyerName.toLowerCase().includes(query) ||
      (order.buyerPhone && order.buyerPhone.includes(query)) ||
      order.articleTitle.toLowerCase().includes(query) ||
      order.deliveryCity.toLowerCase().includes(query) ||
      order.orderNumber.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === 'All' || order.status === statusFilter;

    const matchesArticle =
      articleFilter === 'All articles' || order.articleTitle.includes(articleFilter);

    const matchesAccount =
      accountFilter === 'All accounts' || order.facebookAccount === accountFilter;

    return matchesSearch && matchesStatus && matchesArticle && matchesAccount;
  });

  // Sorting
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortOption === 'Highest total') {
      return b.totalAmount - a.totalAmount;
    }
    // Default newest vs oldest
    return 0; // preserve chronological order
  });

  const inProgressCount = orders.filter((o) => o.status === 'In progress').length;
  const totalVolumeDhs = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Orders</h1>
          <p className="text-sm text-slate-400 mt-1">
            Buyer details, agreed prices and cash-on-delivery (COD) dispatch.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Primary Filter Bar */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          
          {/* Search box (5 cols) */}
          <div className="md:col-span-5 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search buyer, phone, article or city"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status selector (2 cols) */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="In progress">In progress</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="All">All statuses</option>
            </select>
          </div>

          {/* Article selector (2 cols) */}
          <div className="md:col-span-2">
            <select
              value={articleFilter}
              onChange={(e) => setArticleFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer truncate"
            >
              <option value="All articles">All articles</option>
              <option value="Perceuse visseuse">Perceuse 48V</option>
              <option value="منظف زجاج">Nettoyeur vitres</option>
            </select>
          </div>

          {/* Sort selector (2 cols) */}
          <div className="md:col-span-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="Highest total">Highest total</option>
            </select>
          </div>

          {/* Reset button (1 col) */}
          <div className="md:col-span-1 flex items-center justify-end">
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Reset
            </button>
          </div>

        </div>

        {/* Secondary Sub-filter bar: Counter & Account Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">In progress orders</span>
            <span className="font-mono text-amber-400 font-bold">{inProgressCount}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Total pipeline:</span>
            <span className="font-mono text-emerald-400 font-semibold">{totalVolumeDhs} dhs</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Account:</span>
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 font-mono focus:outline-none cursor-pointer"
            >
              <option value="All accounts">All accounts</option>
              <option value="0606599967">0606599967</option>
              <option value="0606629961">0606629961</option>
              <option value="ArabePlus">ArabePlus</option>
              <option value="o25@live.fr">o25@live.fr</option>
              <option value="Mohamed.essaoudi11">Mohamed.essaoudi11</option>
            </select>
          </div>
        </div>

      </div>

      {/* Orders Data Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">Order / Buyer</th>
                <th className="py-3.5 px-5">Article</th>
                <th className="py-3.5 px-5">Delivery</th>
                <th className="py-3.5 px-5 text-right">Total</th>
                <th className="py-3.5 px-5 text-center">Status</th>
                <th className="py-3.5 px-5 text-right w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                sortedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Buyer Info */}
                    <td className="py-4 px-5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold shrink-0">
                          {order.buyerAvatarInitial}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-xs">{order.buyerName}</span>
                            <span className="font-mono text-[11px] text-blue-400 bg-blue-950/40 px-1.5 py-0.2 rounded border border-blue-900/50">
                              {order.facebookAccount}
                            </span>
                          </div>
                          <div className="font-mono text-slate-500 text-[11px]">
                            {order.orderNumber} · {order.createdAt}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Article & Quantity */}
                    <td className="py-4 px-5">
                      <div className="font-medium text-slate-200 max-w-xs truncate">
                        {order.articleTitle}
                      </div>
                      <div className="font-mono text-slate-500 text-[11px] mt-0.5">
                        {order.quantity} × {order.articlePrice} dhs
                      </div>
                    </td>

                    {/* Delivery & Method */}
                    <td className="py-4 px-5">
                      <div className={`font-medium ${order.deliveryCity === 'Not provided' ? 'text-amber-400/90' : 'text-slate-200'}`}>
                        {order.deliveryCity}
                      </div>
                      <div className="font-mono text-slate-500 text-[11px] mt-0.5">
                        {order.deliveryFee} dhs · {order.paymentMethod}
                      </div>
                    </td>

                    {/* Total (Tabular Numerals) */}
                    <td className="py-4 px-5 text-right font-mono font-bold text-sm text-white whitespace-nowrap">
                      {order.totalAmount} dhs
                    </td>

                    {/* Status & Substatus */}
                    <td className="py-4 px-5 text-center whitespace-nowrap">
                      <div className="font-medium text-amber-300 text-xs">
                        {order.status}
                      </div>
                      <div className="text-[11px] text-amber-400/80 font-normal">
                        {order.substatus}
                      </div>
                    </td>

                    {/* Action Arrow */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="p-1.5 text-slate-400 group-hover:text-white group-hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span className="font-mono">1–{sortedOrders.length} of {orders.length} orders</span>
          <div className="flex items-center gap-4">
            <span className="font-mono">Per page 25</span>
            <div className="flex items-center gap-1 font-mono">
              <button disabled className="px-2.5 py-1 text-slate-600 rounded">Previous</button>
              <span className="px-2.5 py-1 bg-blue-600/20 text-blue-400 font-semibold rounded">1 / 1</span>
              <button disabled className="px-2.5 py-1 text-slate-600 rounded">Next</button>
            </div>
          </div>
        </div>

      </div>

      {/* Order Detail Drawer */}
      <OrderDetailsDrawer
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onUpdateOrder={onUpdateOrder}
        onOpenChatWithBuyer={onOpenChatWithBuyer}
      />

    </div>
  );
};
