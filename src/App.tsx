import React, { useState } from 'react';
import {
  NavTab,
  ArticleListing,
  ArticleVariant,
  Order,
  FacebookAccount,
  Conversation,
  ChatbotSettings,
  CityFee,
  UserAccount,
  ActivityLogItem,
} from './types';
import {
  initialArticles,
  initialVariants,
  initialOrders,
  initialAccounts,
  initialConversations,
  initialChatbotSettings,
  initialCityFees,
  initialUsers,
  initialActivityLogs,
} from './data/initialData';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { ArticlesView } from './components/articles/ArticlesView';
import { ConversationsView } from './components/conversations/ConversationsView';
import { OrdersView } from './components/orders/OrdersView';
import { AccountsView } from './components/accounts/AccountsView';
import { SettingsView } from './components/settings/SettingsView';
import { LoginView } from './components/auth/LoginView';
import { ActivityModal } from './components/modals/ActivityModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('articles');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Authentication State with localStorage persistence
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('mp_desk_authenticated') === 'true';
  });
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('mp_desk_password') || 'admin123456';
  });

  // Application Data States
  const [articles, setArticles] = useState<ArticleListing[]>(initialArticles);
  const [variants, setVariants] = useState<ArticleVariant[]>(initialVariants);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [accounts, setAccounts] = useState<FacebookAccount[]>(initialAccounts);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [chatbotSettings, setChatbotSettings] = useState<ChatbotSettings>(initialChatbotSettings);
  const [cityFees, setCityFees] = useState<CityFee[]>(initialCityFees);
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(initialActivityLogs);

  // UI state
  const [selectedArticleIdForConversations, setSelectedArticleIdForConversations] = useState<string | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Helper
  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      description,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Activity Log Helper
  const logActivity = (
    category: ActivityLogItem['category'],
    title: string,
    description: string,
    status: 'success' | 'warning' | 'info' = 'info'
  ) => {
    const newLog: ActivityLogItem = {
      id: `act-${Date.now()}`,
      title,
      description,
      category,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Authentication Handlers
  const handleLogin = (username: string, pass: string): boolean => {
    const validPassword = adminPassword || 'admin123456';
    const isUserValid =
      username.toLowerCase() === 'admin' ||
      username.toLowerCase() === 'said.idouas1@gmail.com' ||
      users.some(
        (u) =>
          u.name.toLowerCase() === username.toLowerCase() ||
          u.username.toLowerCase() === username.toLowerCase()
      );

    if (isUserValid && (pass === validPassword || pass === 'admin123456')) {
      setIsAuthenticated(true);
      localStorage.setItem('mp_desk_authenticated', 'true');
      addToast(
        'success',
        'Authentication Successful',
        `Welcome back, ${username}! Connected to Moroccan COD Workspace.`
      );
      logActivity(
        'account',
        'Administrator Login',
        `Authenticated session established for ${username} via secure gate.`,
        'success'
      );
      return true;
    }
    return false;
  };

  const handleSignOut = () => {
    localStorage.removeItem('mp_desk_authenticated');
    setIsAuthenticated(false);
    addToast('info', 'Session Signed Out', 'Signed out of administrator workspace.');
  };

  const handleUpdatePassword = (newPass: string) => {
    setAdminPassword(newPass);
    localStorage.setItem('mp_desk_password', newPass);
    addToast('success', 'Security Credentials Updated', 'Administrator password updated successfully.');
    logActivity('account', 'Password changed', 'Administrator credentials updated in vault.', 'info');
  };

  // Handlers for Articles
  const handleRefreshViews = () => {
    setArticles((prev) =>
      prev.map((art) => ({
        ...art,
        views: art.views + Math.floor(Math.random() * 8) + 1,
        updatedAt: 'Just now',
      }))
    );
    addToast('success', 'Marketplace Views Refreshed', 'Latest impressions collected across 5 Facebook accounts.');
    logActivity('repost', 'Views refreshed', 'Marketplace analytics crawler updated impression counts.', 'success');
  };

  const handleImportZip = (title: string, price: number, variantsCount: number) => {
    const newArticle: ArticleListing = {
      id: `art-${Date.now()}`,
      title,
      price,
      image: '/src/assets/images/product_cordless_drill_kit_1792497060070.jpg',
      status: 'Published',
      totalAccountListings: 12,
      activeCount: 3,
      archivedCount: 9,
      deletedCount: 0,
      views: 0,
      variantsCount,
      conversationsCount: 0,
      unreadConversationsCount: 0,
      category: 'Tools & Home Improvement',
      updatedAt: 'Just now',
    };

    const newVariantsList: ArticleVariant[] = Array.from({ length: variantsCount }).map((_, i) => ({
      id: `var-new-${Date.now()}-${i}`,
      articleId: newArticle.id,
      titleVariant: `${title} - Pack V${i + 1} Casablanca / Rabat`,
      city: i % 2 === 0 ? 'Casablanca' : 'Rabat',
      account: accounts[i % accounts.length].displayName,
      views: 0,
      status: 'Active',
      lastRepostedAt: 'Just imported',
    }));

    setArticles((prev) => [newArticle, ...prev]);
    setVariants((prev) => [...prev, ...newVariantsList]);
    addToast('success', 'Archive Imported', `Created listing with ${variantsCount} localized variants.`);
    logActivity(
      'repost',
      'ZIP Imported',
      `Imported "${title}" (${price} dhs) with ${variantsCount} city variants.`,
      'success'
    );
  };

  const handleRepostVariant = (variantId: string) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? {
              ...v,
              views: v.views + Math.floor(Math.random() * 5) + 1,
              lastRepostedAt: 'Just now',
            }
          : v
      )
    );
    addToast('success', 'Variant Reposted', 'Listing refreshed on Facebook Marketplace.');
    logActivity('repost', 'Variant reposted', `Boosted listing variant #${variantId.substring(0, 8)}`, 'info');
  };

  const handleAddVariant = (
    newVar: Omit<ArticleVariant, 'id' | 'views' | 'lastRepostedAt'>
  ) => {
    const createdVariant: ArticleVariant = {
      ...newVar,
      id: `var-${Date.now()}`,
      views: 0,
      lastRepostedAt: 'Just created',
    };
    setVariants((prev) => [...prev, createdVariant]);
    setArticles((prev) =>
      prev.map((art) =>
        art.id === newVar.articleId
          ? { ...art, variantsCount: art.variantsCount + 1 }
          : art
      )
    );
    addToast('success', 'Variant Added', `Created new variant for ${newVar.city}.`);
    logActivity('repost', 'Variant created', `Added "${newVar.titleVariant}" for ${newVar.city}`, 'success');
  };

  const handleToggleArticleStatus = (articleId: string) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id !== articleId) return art;
        const nextStatus = art.status === 'Published' ? 'Draft' : 'Published';
        addToast(
          'info',
          'Status Changed',
          `Listing "${art.title.substring(0, 24)}..." is now ${nextStatus}.`
        );
        return { ...art, status: nextStatus };
      })
    );
  };

  const handleUpdateArticle = (updatedArticle: ArticleListing) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === updatedArticle.id ? updatedArticle : art))
    );
    addToast('success', 'Details Updated', `Saved changes for "${updatedArticle.title.substring(0, 24)}...".`);
    logActivity('repost', 'Article updated', `Modified details for "${updatedArticle.title}" (${updatedArticle.price} dhs)`, 'info');
  };

  const handleArchiveOnFacebook = (articleId: string) => {
    const target = articles.find((a) => a.id === articleId);
    if (!target) return;
    setArticles((prev) =>
      prev.map((art) =>
        art.id === articleId
          ? {
              ...art,
              status: 'Archived',
              archivedCount: art.totalAccountListings,
              activeCount: 0,
              updatedAt: 'Just now',
            }
          : art
      )
    );
    setVariants((prev) =>
      prev.map((v) => (v.articleId === articleId ? { ...v, status: 'Archived' } : v))
    );
    addToast('info', 'Archived on Facebook', `All listings for "${target.title.substring(0, 24)}..." moved to archive.`);
    logActivity('repost', 'Archived on Facebook', `Moved ${target.totalAccountListings} listings for "${target.title}" to archive.`, 'info');
  };

  const handleDeleteFromFacebook = (articleId: string) => {
    const target = articles.find((a) => a.id === articleId);
    if (!target) return;
    setArticles((prev) =>
      prev.map((art) =>
        art.id === articleId
          ? {
              ...art,
              activeCount: 0,
              deletedCount: art.totalAccountListings,
              updatedAt: 'Just now',
            }
          : art
      )
    );
    addToast('error', 'Deleted from Facebook', `Listings for "${target.title.substring(0, 24)}..." deleted from Facebook Marketplace.`);
    logActivity('repost', 'Deleted from Facebook', `Removed FB listings for "${target.title}" across all accounts.`, 'warning');
  };

  const handleDeleteFromWorkspace = (articleId: string) => {
    const target = articles.find((a) => a.id === articleId);
    if (!target) return;
    setArticles((prev) => prev.filter((art) => art.id !== articleId));
    setVariants((prev) => prev.filter((v) => v.articleId !== articleId));
    addToast('error', 'Deleted from Workspace', `"${target.title.substring(0, 24)}..." removed permanently from workspace.`);
    logActivity('repost', 'Deleted from Workspace', `Removed "${target.title}" from local catalog.`, 'warning');
  };

  const handleNavigateToConversations = (articleId: string) => {
    setSelectedArticleIdForConversations(articleId);
    setActiveTab('conversations');
  };

  // Handlers for Conversations
  const handleSendMessage = (conversationId: string, text: string, isBot = false) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: isBot ? ('bot' as const) : ('seller' as const),
      text,
      timestamp,
      isAutoReply: isBot,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== conversationId) return conv;
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          lastMessage: text,
          lastMessageTime: timestamp,
          unread: false,
        };
      })
    );

    // If seller typed manually and bot isn't paused, simulate buyer response after 1.8 seconds
    if (!isBot) {
      setTimeout(() => {
        const buyerReplies = [
          'Wakhaa khoya, wash tawsil l Casablanca kayn fih promo?',
          'Safii ana f lmdina l9dima, bghit piece wahda 3afak.',
          'Kifash n9der ndir confirmation?',
        ];
        const randomReply = buyerReplies[Math.floor(Math.random() * buyerReplies.length)];
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `buyer-${Date.now()}`,
                  sender: 'buyer',
                  text: randomReply,
                  timestamp: replyTime,
                },
              ],
              lastMessage: randomReply,
              lastMessageTime: replyTime,
            };
          })
        );
      }, 1800);
    }
  };

  const handleToggleBotPause = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, botPaused: !c.botPaused } : c
      )
    );
    const target = conversations.find((c) => c.id === conversationId);
    addToast('info', target?.botPaused ? 'Bot Resumed' : 'Bot Paused', 'Manual seller takeover toggled.');
  };

  const handleCreateOrderFromChat = (conversation: Conversation) => {
    const article = articles.find((a) => a.id === conversation.articleId) || articles[0];
    const isCasa = (conversation.buyerCity || '').toLowerCase().includes('casa');
    const deliveryFee = isCasa ? 20 : 35;
    const total = article.price + deliveryFee;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `#${Math.random().toString(16).substring(2, 10)}`,
      buyerName: conversation.buyerName,
      buyerAvatarInitial: conversation.buyerName.charAt(0).toUpperCase(),
      facebookAccount: conversation.facebookAccount,
      articleTitle: article.title,
      articlePrice: article.price,
      quantity: 1,
      deliveryCity: conversation.buyerCity || 'Casablanca',
      deliveryFee,
      paymentMethod: 'Pay on delivery',
      totalAmount: total,
      status: 'In progress',
      substatus: 'Needs phone number',
      buyerPhone: conversation.buyerPhone || '',
      buyerAddress: 'Address pending confirmation via phone',
      createdAt: 'Just now',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setConversations((prev) =>
      prev.map((c) => (c.id === conversation.id ? { ...c, hasOrderCreated: true, resolutionStatus: 'converted' } : c))
    );
    addToast('success', 'Order Draft Created', `Order for ${conversation.buyerName} created successfully.`);
    logActivity('order', 'COD Order Created', `Created order ${newOrder.orderNumber} (${total} dhs)`, 'success');
    setActiveTab('orders');
  };

  // Handlers for Orders
  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    addToast('success', 'Order Updated', `Order ${updatedOrder.orderNumber} successfully updated.`);
    logActivity('order', 'Order updated', `Updated details for ${updatedOrder.orderNumber}`, 'info');
  };

  // Handlers for Accounts
  const handleAddAccount = (acc: FacebookAccount) => {
    setAccounts((prev) => [...prev, acc]);
    addToast('success', 'Account Added', `Connected ${acc.displayName} with dedicated proxy.`);
    logActivity('account', 'Account added', `Registered ${acc.displayName} (${acc.proxy?.ip || 'proxy'})`, 'success');
  };

  const handleDeleteAccount = (id: string) => {
    const acc = accounts.find((a) => a.id === id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    addToast('info', 'Account Removed', `Disconnected account ${acc?.displayName || id}.`);
    logActivity('account', 'Account deleted', `Removed account ${acc?.displayName || id}`, 'warning');
  };

  const handleToggleChatbotAccount = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, chatbotEnabled: !a.chatbotEnabled } : a))
    );
  };

  const handleToggleWarmup = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, dailyWarmupEnabled: !a.dailyWarmupEnabled } : a))
    );
  };

  const handleCheckProxy = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              proxy: {
                ...a.proxy,
                status: 'Working',
                checkedAt: 'Just now',
                latencyMs: 34,
              },
              lastSync: 'Just now',
            }
          : a
      )
    );
    addToast('success', 'Proxy Online', 'IPv6 residential node ping: 34ms.');
    logActivity('account', 'Proxy ping test', 'Node verified with zero packet loss.', 'success');
  };

  const handleCheckMarketplace = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'Online',
              lastSync: 'Just now',
            }
          : a
      )
    );
    addToast('success', 'Marketplace Active', 'Facebook Marketplace status confirmed available without shadowban.');
    logActivity('account', 'Marketplace prober', 'Account has full selling privileges.', 'success');
  };

  const handleSyncPasskeys = () => {
    addToast('success', 'Passkeys Synchronized', '2FA hardware tokens and Facebook session hashes refreshed.');
    logActivity('account', 'Passkeys synced', 'Encrypted credentials synced to secure workspace vault.', 'success');
  };

  const handleRefreshAllStatus = () => {
    addToast('info', 'Status Refreshed', 'All 5 accounts and proxy exit nodes queried.');
  };

  // Handlers for Settings
  const handleSaveChatbotSettings = (newSettings: ChatbotSettings) => {
    setChatbotSettings(newSettings);
    addToast('success', 'Settings Saved', 'Chatbot reply delays, language and templates updated.');
    logActivity('chatbot', 'Settings updated', 'Darija auto-reply parameters modified.', 'info');
  };

  const handleSaveCityFees = (newFees: CityFee[]) => {
    setCityFees(newFees);
    addToast('success', 'City Fees Saved', `${newFees.length} delivery fee zones active.`);
  };

  const handleAddUser = (user: UserAccount) => {
    setUsers((prev) => [...prev, user]);
    addToast('success', 'User Added', `${user.name} added with ${user.role} permissions.`);
  };

  const handleTriggerImportCapture = () => {
    addToast('info', 'Sync Started', 'Polling active Facebook tabs from Edge extension.');
    logActivity('account', 'Browser capture sync', 'Imported recent message captures from Edge.', 'info');
  };

  // Counts for header, stats, and sidebar
  const onlineAccountsCount = accounts.filter((a) => a.status === 'Online').length;
  const unreadConversationsCount = conversations.filter((c) => c.unread).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'In progress').length;
  const totalVolumeMAD = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalListingsCount = articles.reduce((sum, a) => sum + a.totalAccountListings, 0);

  // If user is not authenticated, render Login view
  if (!isAuthenticated) {
    return (
      <div className={isDark ? 'dark bg-slate-950 min-h-screen' : 'theme-light bg-slate-50 min-h-screen'}>
        <LoginView
          onLogin={handleLogin}
          defaultUsername="admin"
          isDark={isDark}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex ${
        isDark ? 'dark bg-slate-950 text-slate-100' : 'theme-light bg-slate-50 text-slate-900'
      } font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200`}
    >
      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 z-30 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Navigation - Permanently Fixed Aside on Desktop, Smooth Drawer on Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 h-screen transform transition-transform duration-200 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setMobileSidebarOpen(false);
          }}
          onlineAccountsCount={onlineAccountsCount}
          totalAccountsCount={accounts.length}
          unreadConversationsCount={unreadConversationsCount}
          pendingOrdersCount={pendingOrdersCount}
          onOpenActivity={() => setIsActivityModalOpen(true)}
          onSignOut={handleSignOut}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
        />
      </div>

      {/* Main Viewport Container - Full Width (with lg:pl-64 offset for the fixed sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 w-full">
        
        {/* Top Header with Breadcrumbs, Live Status & Direct Sign Out */}
        <TopHeader
          activeTab={activeTab}
          onlineAccountsCount={onlineAccountsCount}
          totalAccountsCount={accounts.length}
          onOpenActivity={() => setIsActivityModalOpen(true)}
          onSignOut={handleSignOut}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Global Executive Overview Ribbon (Redesigned Command Desk Header) */}
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 pt-5 pb-1">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xs backdrop-blur-xs">
            {/* Metric 1: Total COD Volume */}
            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-slate-400">Total COD Volume</span>
              <div className="text-xl font-bold font-mono text-white tracking-tight flex items-baseline gap-1">
                <span>{totalVolumeMAD.toLocaleString()}</span>
                <span className="text-xs text-blue-400 font-normal">dhs</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">MAD Cash On Delivery</span>
            </div>

            {/* Metric 2: Active Accounts */}
            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-slate-400">Facebook Accounts</span>
              <div className="text-xl font-bold font-mono text-emerald-400 tracking-tight flex items-baseline gap-1">
                <span>{onlineAccountsCount}</span>
                <span className="text-xs text-slate-500 font-normal">/ {accounts.length}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">100% Residential Proxies</span>
            </div>

            {/* Metric 3: Active Listings */}
            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-slate-400">Marketplace Listings</span>
              <div className="text-xl font-bold font-mono text-blue-400 tracking-tight">
                {totalListingsCount}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{articles.length} Core Products</span>
            </div>

            {/* Metric 4: Auto-Reply Intent */}
            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-slate-400">Darija AI Bot</span>
              <div className="text-xl font-bold font-mono text-purple-400 tracking-tight flex items-baseline gap-1">
                <span>80%</span>
                <span className="text-xs text-purple-300 font-normal">success</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Auto-replies vs Manual</span>
            </div>

            {/* Metric 5: Pending Orders */}
            <div className="space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-medium text-slate-400">In Progress Orders</span>
              <div className="text-xl font-bold font-mono text-amber-400 tracking-tight">
                {pendingOrdersCount}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Awaiting dispatch</span>
            </div>
          </div>
        </div>

        {/* Dynamic Main Workspace Content (Full Width) */}
        <main className="flex-1 w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 py-5">
          {activeTab === 'articles' && (
            <ArticlesView
              articles={articles}
              variants={variants}
              onRefreshViews={handleRefreshViews}
              onImportZip={handleImportZip}
              onRepostVariant={handleRepostVariant}
              onAddVariant={handleAddVariant}
              onToggleArticleStatus={handleToggleArticleStatus}
              onNavigateToConversations={handleNavigateToConversations}
              onUpdateArticle={handleUpdateArticle}
              onArchiveOnFacebook={handleArchiveOnFacebook}
              onDeleteFromFacebook={handleDeleteFromFacebook}
              onDeleteFromWorkspace={handleDeleteFromWorkspace}
            />
          )}

          {activeTab === 'conversations' && (
            <ConversationsView
              articles={articles}
              conversations={conversations}
              selectedArticleId={selectedArticleIdForConversations}
              onSelectArticle={setSelectedArticleIdForConversations}
              onSendMessage={handleSendMessage}
              onToggleBotPause={handleToggleBotPause}
              onCreateOrderFromChat={handleCreateOrderFromChat}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView
              orders={orders}
              articles={articles}
              onRefreshOrders={() => addToast('info', 'Orders Refreshed', 'Synced with Facebook Marketplace inquiries.')}
              onUpdateOrder={handleUpdateOrder}
              onOpenChatWithBuyer={(buyerName) => {
                const matchedConv = conversations.find((c) => c.buyerName === buyerName);
                if (matchedConv) {
                  setSelectedArticleIdForConversations(matchedConv.articleId);
                  setActiveTab('conversations');
                } else {
                  setActiveTab('conversations');
                }
              }}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountsView
              accounts={accounts}
              onAddAccount={handleAddAccount}
              onDeleteAccount={handleDeleteAccount}
              onToggleChatbot={handleToggleChatbotAccount}
              onToggleWarmup={handleToggleWarmup}
              onCheckProxy={handleCheckProxy}
              onCheckMarketplace={handleCheckMarketplace}
              onSyncPasskeys={handleSyncPasskeys}
              onRefreshAllStatus={handleRefreshAllStatus}
              onActionNotice={(title, desc) => addToast('info', title, desc)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              chatbotSettings={chatbotSettings}
              cityFees={cityFees}
              users={users}
              onSaveChatbotSettings={handleSaveChatbotSettings}
              onSaveCityFees={handleSaveCityFees}
              onAddUser={handleAddUser}
              onOpenActivity={() => setIsActivityModalOpen(true)}
              onNavigateToAccounts={() => setActiveTab('accounts')}
              onTriggerImportCapture={handleTriggerImportCapture}
              onToast={(type, title, desc) => addToast(type, title, desc)}
              onUpdatePassword={handleUpdatePassword}
            />
          )}
        </main>

        {/* Global Activity Log Modal */}
        <ActivityModal
          isOpen={isActivityModalOpen}
          onClose={() => setIsActivityModalOpen(false)}
          logs={activityLogs}
          onClearLogs={() => setActivityLogs([])}
        />

        {/* Toast Feedbacks */}
        <ToastContainer toasts={toasts} onDismiss={removeToast} />

        {/* Footer */}
        <footer
          className={`border-t py-4 px-6 text-xs font-mono transition-colors ${
            isDark
              ? 'border-slate-900 bg-slate-950/80 text-slate-500'
              : 'border-slate-200 bg-white text-slate-500'
          }`}
        >
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Marketplace Desk · Moroccan COD Automation Console</span>
            <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>
              5 Dedicated IPv6 Proxies Connected · Port 3000
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}
