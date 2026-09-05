import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Clock,
  X
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateToTab
}) => {
  const [filter, setFilter] = useState<'all' | 'alert' | 'message' | 'update'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case 'update':
      default:
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-md flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0D0D0D] text-slate-200 h-full shadow-2xl flex flex-col border-l border-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-tight uppercase font-mono">Notifications & Alerts</h3>
              <p className="text-[11px] text-slate-400">
                Live Gateway & Microservice Dispatcher
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 p-1 font-mono text-[11px]"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mark read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-4 py-2.5 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs bg-[#0A0A0A]">
          {(['all', 'alert', 'message', 'update'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-full font-medium capitalize transition whitespace-nowrap text-[11px] ${
                filter === type
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#141414] text-slate-400 hover:bg-[#1c1c1c] border border-slate-800'
              }`}
            >
              {type === 'all' ? 'All Notifications' : `${type}s`}
            </button>
          ))}
        </div>

        {/* List of Notifications */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
              <p className="text-xs font-medium">No notifications in this category.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => onMarkAsRead(item.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer relative ${
                  !item.read
                    ? 'bg-[#141414] border-blue-500/50 shadow-sm'
                    : 'bg-[#111111] border-slate-800 hover:bg-[#161616]'
                }`}
              >
                {!item.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500" />
                )}

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#0A0A0A] border border-slate-800 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-2.5 h-2.5" />
                        {item.timestamp}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#0A0A0A] text-[10px] text-slate-500 text-center font-mono tracking-wider">
          DELIVERED THROUGH NOTIFICATION MICROSERVICE & API GATEWAY
        </div>
      </div>
    </div>
  );
};
