import React, { useState } from 'react';
import { ArticleListing, Conversation, ChatMessage, Order, BuyerSentiment } from '../../types';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Send,
  Bot,
  User,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  Phone,
  MapPin,
  Clock,
  PauseCircle,
  PlayCircle,
  Smile,
  Meh,
  AlertTriangle,
  Frown,
  UserCheck,
} from 'lucide-react';
import { SentimentSummaryChart } from './SentimentSummaryChart';

interface ConversationsViewProps {
  articles: ArticleListing[];
  conversations: Conversation[];
  selectedArticleId: string | null;
  onSelectArticle: (articleId: string | null) => void;
  onSendMessage: (conversationId: string, text: string, isBot?: boolean) => void;
  onToggleBotPause: (conversationId: string) => void;
  onCreateOrderFromChat: (conversation: Conversation) => void;
}

export const ConversationsView: React.FC<ConversationsViewProps> = ({
  articles,
  conversations,
  selectedArticleId,
  onSelectArticle,
  onSendMessage,
  onToggleBotPause,
  onCreateOrderFromChat,
}) => {
  const [accountFilter, setAccountFilter] = useState('All accounts');
  const [productSearch, setProductSearch] = useState('');
  const [activeSentimentFilter, setActiveSentimentFilter] = useState<BuyerSentiment | 'all'>('all');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    conversations[0]?.id || null
  );
  const [messageInput, setMessageInput] = useState('');

  // Find active article
  const activeArticle = articles.find((a) => a.id === selectedArticleId);

  // Filter conversations based on selected product, account, and sentiment
  const filteredConversations = conversations.filter((c) => {
    const matchesArticle = selectedArticleId ? c.articleId === selectedArticleId : true;
    const matchesAccount = accountFilter === 'All accounts' || c.facebookAccount === accountFilter;
    const matchesSentiment = activeSentimentFilter === 'all' || c.sentiment === activeSentimentFilter;
    return matchesArticle && matchesAccount && matchesSentiment;
  });

  const activeConversation = conversations.find((c) => c.id === selectedConversationId) || filteredConversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;
    onSendMessage(activeConversation.id, messageInput.trim(), false);
    setMessageInput('');
  };

  const handleBotQuickAction = (phrase: string) => {
    if (!activeConversation) return;
    onSendMessage(activeConversation.id, phrase, true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">Conversations</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live chat connected
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time multi-account inbox with AI auto-replies and instant COD order generation.
          </p>
        </div>

        {/* Account Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Account:</label>
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
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

      {/* Sentiment Analysis & Automation Performance Summary Chart */}
      <SentimentSummaryChart
        conversations={conversations}
        activeSentimentFilter={activeSentimentFilter}
        onFilterBySentiment={setActiveSentimentFilter}
      />

      {/* Product Selector Bar (Exactly as Screenshot 5) */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Choose a product</h2>
              <span className="text-xs text-slate-500 font-mono">
                ({articles.length} products with conversations)
              </span>
            </div>
            {selectedArticleId && (
              <button
                onClick={() => onSelectArticle(null)}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 mt-0.5"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Show conversations for all products</span>
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {articles
            .filter((a) => a.title.toLowerCase().includes(productSearch.toLowerCase()))
            .map((article) => {
              const isSelected = selectedArticleId === article.id;
              return (
                <div
                  key={article.id}
                  onClick={() => onSelectArticle(isSelected ? null : article.id)}
                  className={`flex items-center gap-3.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500/50 shadow-md shadow-blue-500/5'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white text-xs truncate">{article.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-slate-400 text-[11px] font-mono">
                      <span className="text-white font-bold">{article.price} dhs</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-blue-400">{article.conversationsCount} conversations</span>
                      {article.unreadConversationsCount > 0 && (
                        <>
                          <span className="text-slate-600">·</span>
                          <span className="text-amber-400 font-semibold">{article.unreadConversationsCount} unread</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Main Split Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[640px] bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
        
        {/* Left Column: Conversation List (4 cols) */}
        <div className="lg:col-span-4 border-r border-slate-800 flex flex-col bg-slate-950/50 h-full">
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Buyer Inquiries</span>
              {activeSentimentFilter !== 'all' && (
                <span className="text-[10px] text-blue-400 font-mono">
                  ({activeSentimentFilter})
                </span>
              )}
            </div>
            <span className="font-mono text-slate-500">{filteredConversations.length} active</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs space-y-1">
                <p>No conversations found for current filter.</p>
                {activeSentimentFilter !== 'all' && (
                  <button
                    onClick={() => setActiveSentimentFilter('all')}
                    className="text-blue-400 hover:underline text-xs"
                  >
                    Reset sentiment filter
                  </button>
                )}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activeConversation?.id === conv.id;
                const isAuto = conv.interventionType === 'auto' || (!conv.interventionType && !conv.botPaused);
                const sentiment = conv.sentiment || 'neutral';

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-blue-600/15 border-l-2 border-blue-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
                          {conv.buyerName.charAt(0)}
                        </div>
                        <span className="font-semibold text-white text-xs truncate">
                          {conv.buyerName}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1 pl-8">
                      {conv.lastMessage}
                    </p>

                    {/* Meta line: sentiment, intervention mode, FB account */}
                    <div className="flex items-center justify-between pl-8 mt-2 text-[10px] font-mono">
                      <div className="flex items-center gap-2 text-slate-400">
                        {/* Sentiment tag */}
                        {sentiment === 'positive' && (
                          <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                            <Smile className="w-3 h-3" />
                            Positive
                          </span>
                        )}
                        {sentiment === 'neutral' && (
                          <span className="text-blue-400 font-medium flex items-center gap-0.5">
                            <Meh className="w-3 h-3" />
                            Neutral
                          </span>
                        )}
                        {sentiment === 'hesitant' && (
                          <span className="text-amber-400 font-medium flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" />
                            Hesitant
                          </span>
                        )}
                        {sentiment === 'negative' && (
                          <span className="text-rose-400 font-medium flex items-center gap-0.5">
                            <Frown className="w-3 h-3" />
                            Negative
                          </span>
                        )}

                        <span className="text-slate-600">·</span>

                        {/* Intervention mode */}
                        {isAuto ? (
                          <span className="text-purple-400 flex items-center gap-0.5">
                            <Bot className="w-3 h-3" />
                            Auto
                          </span>
                        ) : (
                          <span className="text-slate-300 flex items-center gap-0.5">
                            <UserCheck className="w-3 h-3 text-blue-400" />
                            Manual
                          </span>
                        )}

                        {conv.hasOrderCreated && (
                          <>
                            <span className="text-slate-600">·</span>
                            <span className="text-emerald-400 font-semibold">COD</span>
                          </>
                        )}
                      </div>

                      {conv.unread && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Chat Pane (8 cols) */}
        {activeConversation ? (
          <div className="lg:col-span-8 flex flex-col h-full bg-slate-900/40">
            
            {/* Chat Top Banner */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-sm">
                  {activeConversation.buyerName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white text-sm truncate">
                      {activeConversation.buyerName}
                    </h3>
                    <span className="text-slate-600">·</span>
                    <span className="font-mono text-xs text-blue-400">
                      {activeConversation.facebookAccount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                    {activeConversation.buyerPhone && (
                      <span className="flex items-center gap-1 font-mono text-emerald-400">
                        <Phone className="w-3 h-3" />
                        {activeConversation.buyerPhone}
                      </span>
                    )}
                    {activeConversation.buyerCity && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {activeConversation.buyerCity}
                      </span>
                    )}
                    <span className="text-slate-600">·</span>
                    {activeConversation.sentiment === 'positive' && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                        <Smile className="w-3 h-3" />
                        {activeConversation.sentimentScore || 88}% Intent
                      </span>
                    )}
                    {activeConversation.sentiment === 'neutral' && (
                      <span className="text-blue-400 font-medium flex items-center gap-1 font-mono">
                        <Meh className="w-3 h-3" />
                        {activeConversation.sentimentScore || 70}% Inquiring
                      </span>
                    )}
                    {activeConversation.sentiment === 'hesitant' && (
                      <span className="text-amber-400 font-medium flex items-center gap-1 font-mono">
                        <AlertTriangle className="w-3 h-3" />
                        {activeConversation.sentimentScore || 60}% Price Check
                      </span>
                    )}
                    {activeConversation.sentiment === 'negative' && (
                      <span className="text-rose-400 font-medium flex items-center gap-1 font-mono">
                        <Frown className="w-3 h-3" />
                        {activeConversation.sentimentScore || 30}% Friction
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Chat Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onToggleBotPause(activeConversation.id)}
                  title={activeConversation.botPaused ? 'Resume auto-replies' : 'Pause bot in this chat'}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    activeConversation.botPaused
                      ? 'bg-amber-950/30 border-amber-800/50 text-amber-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {activeConversation.botPaused ? (
                    <>
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Resume Bot</span>
                    </>
                  ) : (
                    <>
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>Bot Active</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onCreateOrderFromChat(activeConversation)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Create COD Order</span>
                </button>
              </div>
            </div>

            {/* Messages Thread View */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
              {activeConversation.messages.map((msg) => {
                const isBuyer = msg.sender === 'buyer';
                const isBot = msg.sender === 'bot';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isBuyer ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-500">
                      {isBuyer ? (
                        <>
                          <User className="w-3 h-3" />
                          <span>{activeConversation.buyerName}</span>
                        </>
                      ) : isBot ? (
                        <>
                          <Bot className="w-3 h-3 text-purple-400" />
                          <span className="text-purple-400 font-medium">Darija Auto-Reply Bot</span>
                        </>
                      ) : (
                        <span>You (Seller)</span>
                      )}
                      <span>·</span>
                      <span className="font-mono">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isBuyer
                          ? 'bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700/60'
                          : isBot
                          ? 'bg-purple-950/40 text-purple-100 border border-purple-800/50 rounded-tr-sm'
                          : 'bg-blue-600 text-white rounded-tr-sm shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Bot Suggestion Triggers */}
            <div className="px-4 py-2 bg-slate-950/50 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-slate-500 shrink-0 font-medium">Quick Darija replies:</span>
              <button
                onClick={() =>
                  handleBotQuickAction('Merhba! Kifach n9dro n3awnok?')
                }
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md whitespace-nowrap transition-colors"
              >
                👋 Greeting
              </button>
              <button
                onClick={() =>
                  handleBotQuickAction(
                    'Livraison f ga3 lmaghrib. Tkhless mlli twslek commande.'
                  )
                }
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md whitespace-nowrap transition-colors"
              >
                🚚 Delivery Terms
              </button>
              <button
                onClick={() =>
                  handleBotQuickAction(
                    '3tina smia w num dial tel w lmdina bach n confirmiw commande dialk.'
                  )
                }
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md whitespace-nowrap transition-colors"
              >
                📝 Ask Phone & City
              </button>
              <button
                onClick={() =>
                  handleBotQuickAction('Num dialna l contact: 06 60 65 75 70')
                }
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md whitespace-nowrap transition-colors"
              >
                📞 Contact Number
              </button>
            </div>

            {/* Message Input Box */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type a message or Darija response..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-40 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>

          </div>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center p-8 text-slate-500 text-xs">
            Select a conversation to begin chatting.
          </div>
        )}

      </div>

    </div>
  );
};
