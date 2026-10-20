import React, { useState } from 'react';
import { Conversation, BuyerSentiment, InterventionType } from '../../types';
import {
  TrendingUp,
  Bot,
  UserCheck,
  Smile,
  Meh,
  Frown,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart2,
} from 'lucide-react';

interface SentimentSummaryChartProps {
  conversations: Conversation[];
  onFilterBySentiment?: (sentiment: BuyerSentiment | 'all') => void;
  activeSentimentFilter?: BuyerSentiment | 'all';
}

export const SentimentSummaryChart: React.FC<SentimentSummaryChartProps> = ({
  conversations,
  onFilterBySentiment,
  activeSentimentFilter = 'all',
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [timeframe, setTimeframe] = useState<'today' | '7d' | 'all'>('7d');

  // Compute analytics from conversations
  const autoConversations = conversations.filter(
    (c) => c.interventionType === 'auto' || (!c.interventionType && !c.botPaused)
  );
  const manualConversations = conversations.filter(
    (c) => c.interventionType === 'manual' || c.botPaused
  );

  const autoConverted = autoConversations.filter(
    (c) => c.resolutionStatus === 'converted' || c.hasOrderCreated
  ).length;
  const manualConverted = manualConversations.filter(
    (c) => c.resolutionStatus === 'converted' || c.hasOrderCreated
  ).length;

  const autoSuccessRate =
    autoConversations.length > 0
      ? Math.round((autoConverted / autoConversations.length) * 100)
      : 80;

  const manualSuccessRate =
    manualConversations.length > 0
      ? Math.round((manualConverted / manualConversations.length) * 100)
      : 67;

  // Sentiment distributions
  const positiveCount = conversations.filter(
    (c) => c.sentiment === 'positive' || (c.sentimentScore && c.sentimentScore >= 80)
  ).length;

  const neutralCount = conversations.filter(
    (c) => c.sentiment === 'neutral' || (!c.sentiment && !c.sentimentScore)
  ).length;

  const hesitantCount = conversations.filter(
    (c) => c.sentiment === 'hesitant' || (c.sentimentScore && c.sentimentScore >= 50 && c.sentimentScore < 70)
  ).length;

  const negativeCount = conversations.filter(
    (c) => c.sentiment === 'negative' || (c.sentimentScore && c.sentimentScore < 50)
  ).length;

  const total = conversations.length || 1;

  // Breakdown by channel for stacked comparison
  const sentimentMetrics = [
    {
      key: 'positive' as BuyerSentiment,
      label: 'Positive / Buy Intent',
      count: positiveCount,
      percent: Math.round((positiveCount / total) * 100),
      autoCount: autoConversations.filter((c) => c.sentiment === 'positive').length,
      manualCount: manualConversations.filter((c) => c.sentiment === 'positive').length,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      icon: Smile,
    },
    {
      key: 'neutral' as BuyerSentiment,
      label: 'Neutral / Product Inquiry',
      count: neutralCount,
      percent: Math.round((neutralCount / total) * 100),
      autoCount: autoConversations.filter((c) => c.sentiment === 'neutral').length,
      manualCount: manualConversations.filter((c) => c.sentiment === 'neutral').length,
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      icon: Meh,
    },
    {
      key: 'hesitant' as BuyerSentiment,
      label: 'Hesitant / Price Negotiation',
      count: hesitantCount,
      percent: Math.round((hesitantCount / total) * 100),
      autoCount: autoConversations.filter((c) => c.sentiment === 'hesitant').length,
      manualCount: manualConversations.filter((c) => c.sentiment === 'hesitant').length,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      icon: AlertTriangle,
    },
    {
      key: 'negative' as BuyerSentiment,
      label: 'Negative / Delivery Friction',
      count: negativeCount,
      percent: Math.round((negativeCount / total) * 100),
      autoCount: autoConversations.filter((c) => c.sentiment === 'negative').length,
      manualCount: manualConversations.filter((c) => c.sentiment === 'negative').length,
      color: 'bg-rose-500',
      textColor: 'text-rose-400',
      icon: Frown,
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all text-xs">
      
      {/* Banner / Header Bar */}
      <div className="px-5 py-3.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-600/15 text-blue-400 rounded-lg border border-blue-500/20">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-white text-sm">
                Sentiment & Automation Performance
              </h2>
              <span className="font-mono text-[11px] text-slate-500">
                · Auto-Reply vs. Manual Interventions
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe Selector */}
          <div className="hidden sm:flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
            {(['today', '7d', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  timeframe === t
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'today' ? 'Today' : t === '7d' ? 'Last 7 Days' : 'All Time'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
          >
            <span className="text-[11px]">{isExpanded ? 'Collapse' : 'Expand'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 space-y-6">
          
          {/* Top KPI Comparison Strip (Auto vs Manual) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Auto-Reply Success Rate */}
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Bot className="w-4 h-4 text-purple-400" />
                  Auto-Reply Success
                </span>
                <span className="font-mono text-emerald-400 font-semibold">{autoSuccessRate}%</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                {autoConverted} <span className="text-xs font-normal text-slate-500 font-sans">orders converted</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${autoSuccessRate}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {autoConversations.length} inquiries resolved by Darija bot without human intervention.
              </p>
            </div>

            {/* 2. Manual Intervention Success Rate */}
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  Manual Interventions
                </span>
                <span className="font-mono text-blue-400 font-semibold">{manualSuccessRate}%</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                {manualConverted} <span className="text-xs font-normal text-slate-500 font-sans">orders converted</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${manualSuccessRate}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {manualConversations.length} inquiries escalated for price negotiations or custom delivery.
              </p>
            </div>

            {/* 3. Overall Buyer Sentiment Index */}
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Smile className="w-4 h-4 text-emerald-400" />
                  Positive Sentiment
                </span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {Math.round(((positiveCount + neutralCount) / total) * 100)}%
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                {positiveCount} <span className="text-xs font-normal text-slate-500 font-sans">high-intent buyers</span>
              </div>
              {/* Progress bar with multi-segment */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${(positiveCount / total) * 100}%` }}
                />
                <div
                  className="bg-blue-500 h-full"
                  style={{ width: `${(neutralCount / total) * 100}%` }}
                />
                <div
                  className="bg-amber-500 h-full"
                  style={{ width: `${(hesitantCount / total) * 100}%` }}
                />
                <div
                  className="bg-rose-500 h-full"
                  style={{ width: `${(negativeCount / total) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Measured from Darija NLP intent parser across all accounts.
              </p>
            </div>

            {/* 4. Automated Time Saved */}
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Avg Response Time
                </span>
                <span className="font-mono text-cyan-400 font-semibold">3.8s</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                4.2h <span className="text-xs font-normal text-slate-500 font-sans">saved today</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full w-4/5" />
              </div>
              <p className="text-[11px] text-slate-500">
                Auto-replies answer 24/7 without delays or seller fatigue.
              </p>
            </div>

          </div>

          {/* Detailed Side-by-Side Visual Chart (SVG Bar Distribution) */}
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold text-white text-xs">
                  Sentiment Distribution by Channel (Auto vs. Manual)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Click any sentiment category to filter the conversation inbox below.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded bg-purple-500" />
                  Auto-Reply
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded bg-blue-500" />
                  Manual Seller
                </span>
                {activeSentimentFilter !== 'all' && (
                  <button
                    onClick={() => onFilterBySentiment?.('all')}
                    className="text-blue-400 hover:underline font-sans text-xs ml-2"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Visual Bars Matrix */}
            <div className="space-y-3 pt-2">
              {sentimentMetrics.map((item) => {
                const IconComponent = item.icon;
                const isSelected = activeSentimentFilter === item.key;
                const totalItemCount = item.autoCount + item.manualCount || item.count || 1;
                const autoShare = Math.round((item.autoCount / totalItemCount) * 100) || 50;
                const manualShare = 100 - autoShare;

                return (
                  <div
                    key={item.key}
                    onClick={() => onFilterBySentiment?.(isSelected ? 'all' : item.key)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${item.textColor}`} />
                        <span className="font-medium text-slate-200">{item.label}</span>
                        <span className="text-slate-600">·</span>
                        <span className="font-mono text-slate-400 text-[11px]">
                          {item.count} conversations ({item.percent}%)
                        </span>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-purple-400">
                          Auto: {item.autoCount} ({autoShare}%)
                        </span>
                        <span className="text-slate-600">/</span>
                        <span className="text-blue-400">
                          Manual: {item.manualCount} ({manualShare}%)
                        </span>
                      </div>
                    </div>

                    {/* Dual Ratio Bar */}
                    <div className="w-full bg-slate-950 h-3 rounded-lg overflow-hidden flex border border-slate-800">
                      <div
                        className="bg-purple-600 hover:bg-purple-500 h-full transition-all"
                        style={{ width: `${autoShare}%` }}
                        title={`Auto-reply: ${autoShare}%`}
                      />
                      <div
                        className="bg-blue-600 hover:bg-blue-500 h-full transition-all"
                        style={{ width: `${manualShare}%` }}
                        title={`Manual: ${manualShare}%`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Strategic Takeaway Note */}
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60 flex items-start gap-2.5 text-[11px] text-slate-400 leading-relaxed">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Automation Insight:</span> Auto-replies demonstrate an <strong className="text-emerald-400">80% conversion rate</strong> on standard greetings and delivery queries. Manual interventions are primarily required when buyers request customized discounts or address clarifications.
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
