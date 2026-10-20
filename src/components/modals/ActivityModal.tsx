import React from 'react';
import { ActivityLogItem } from '../../types';
import { X, RefreshCw, Bot, ShoppingBag, Shield, Clock } from 'lucide-react';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLogItem[];
  onClearLogs: () => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
}) => {
  if (!isOpen) return null;

  const getCategoryIcon = (category: ActivityLogItem['category']) => {
    switch (category) {
      case 'repost':
        return <RefreshCw className="w-4 h-4 text-cyan-400" />;
      case 'chatbot':
        return <Bot className="w-4 h-4 text-purple-400" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      case 'account':
      case 'proxy':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white">System Activity & Audit Logs</h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time background tasks, reposts, auto-replies and proxy checks</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logs List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No recent activity logs recorded.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3.5 p-3.5 bg-slate-950/50 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-colors"
              >
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  {getCategoryIcon(log.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-200 truncate">{log.title}</span>
                    <span className="text-xs font-mono text-slate-500 shrink-0">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{log.description}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <span>{logs.length} automated events logged today</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearLogs}
              className="px-3 py-1.5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Clear log
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
