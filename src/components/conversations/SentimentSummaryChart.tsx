import React, { useState } from 'react';
import { Conversation, BuyerSentiment, InterventionType } from '../../types';
import {
  TrendingUp,
  Bot,
  UserCheck,
  Smile,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
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



        </div>
      )}

    </div>
  );
};
