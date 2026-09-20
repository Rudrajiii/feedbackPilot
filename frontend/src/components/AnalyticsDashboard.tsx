import React, { useState, useEffect } from 'react';
import { getAllFeedback } from '../api';
import type { FeedbackItem } from '../types';
import { BarChart2, CheckCircle2, Cpu, Filter, ChevronRight } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [selectedTraceItem, setSelectedTraceItem] = useState<FeedbackItem | null>(null);

  useEffect(() => {
    getAllFeedback().then(res => {
      setItems(res);
      if (res.length > 0) setSelectedTraceItem(res[0]);
    });
  }, []);

  const filteredItems = items.filter(item => 
    filterPlatform === 'all' ? true : item.platform === filterPlatform
  );

  const total = filteredItems.length;
  const positiveCount = filteredItems.filter(i => i.sentiment === 'positive').length;
  const negativeCount = filteredItems.filter(i => i.sentiment === 'negative').length;
  const neutralCount = filteredItems.filter(i => i.sentiment === 'neutral').length;

  const posPercent = total ? Math.round((positiveCount / total) * 100) : 0;
  const negPercent = total ? Math.round((negativeCount / total) * 100) : 0;
  const neuPercent = total ? Math.round((neutralCount / total) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="border border-slate-800 bg-slate-900 rounded-lg p-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BarChart2 className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-100">Operations Dashboard & Execution Trace Inspector</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time analytics across all platforms (Social Media, In-App, E-Commerce) with step-by-step LCEL chain execution traces.
          </p>
        </div>

        {/* Platform Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Filter Platform:</span>
          <select
            value={filterPlatform}
            onChange={e => setFilterPlatform(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded text-xs px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Scenarios ({items.length})</option>
            <option value="social_media">Social Media Feed</option>
            <option value="ride_sharing">In-App Ride/Delivery</option>
            <option value="ecommerce">E-Commerce Store</option>
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="border border-slate-800 bg-slate-900 rounded-lg p-5 space-y-2">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Processed</span>
          <div className="text-2xl font-bold text-slate-100">{total} Items</div>
          <div className="text-xs text-emerald-400 font-mono flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Automated Triage</span>
          </div>
        </div>

        <div className="border border-emerald-500/30 bg-slate-900 rounded-lg p-5 space-y-2">
          <span className="text-xs text-emerald-400 font-medium uppercase tracking-wider">Positive Feedback</span>
          <div className="text-2xl font-bold text-emerald-400">{positiveCount} ({posPercent}%)</div>
          <p className="text-xs text-slate-400">Auto-replied or Rating Requested</p>
        </div>

        <div className="border border-rose-500/30 bg-slate-900 rounded-lg p-5 space-y-2">
          <span className="text-xs text-rose-400 font-medium uppercase tracking-wider">Escalated Negative</span>
          <div className="text-2xl font-bold text-rose-400">{negativeCount} ({negPercent}%)</div>
          <p className="text-xs text-slate-400">Direct Support Email Sent</p>
        </div>

        <div className="border border-amber-500/30 bg-slate-900 rounded-lg p-5 space-y-2">
          <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Neutral Log-Only</span>
          <div className="text-2xl font-bold text-amber-400">{neutralCount} ({neuPercent}%)</div>
          <p className="text-xs text-slate-400">Recorded to DB</p>
        </div>

      </div>

      {/* Main Grid: Feedback Log Table + Execution Trace Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Feedback Log Table */}
        <div className="lg:col-span-7 border border-slate-800 bg-slate-900 rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Recent Feedback Triage Queue</span>
            <span className="text-xs text-slate-400 font-normal">{filteredItems.length} records</span>
          </h3>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isSelected = selectedTraceItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedTraceItem(item)}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer space-y-2 ${
                    isSelected
                      ? 'border-emerald-500/50 bg-slate-950'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-xs text-slate-200">{item.customer_id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {item.platform}
                      </span>
                    </div>

                    <span className={`text-[11px] px-2 py-0.5 rounded font-mono border ${
                      item.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      item.sentiment === 'negative' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {item.sentiment?.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">"{item.message}"</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                    <span className="font-mono text-slate-400">{item.action_taken}</span>
                    <span className="flex items-center text-emerald-400 space-x-1">
                      <span>View Trace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Execution Trace Drawer */}
        <div className="lg:col-span-5 border border-slate-800 bg-slate-900 rounded-lg p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-slate-100 text-sm">LCEL Chain Execution Trace</h3>
            </div>
            {selectedTraceItem && (
              <span className="text-[11px] font-mono text-slate-400">ID: #{selectedTraceItem.id}</span>
            )}
          </div>

          {!selectedTraceItem ? (
            <div className="py-20 text-center text-xs text-slate-500">
              Select any item from the queue to view its execution trace.
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              
              {/* Item Overview */}
              <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[11px]">Context: {selectedTraceItem.context || 'General'}</div>
                <p className="text-slate-200 font-medium">"{selectedTraceItem.message}"</p>
                <div className="pt-2 text-[11px] text-emerald-400 font-mono">
                  Resulting Action: {selectedTraceItem.custom_message}
                </div>
              </div>

              {/* Step-by-Step Trace Cards */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Trace Events Log</h4>

                {selectedTraceItem.trace_steps?.map((step, idx) => (
                  <div key={idx} className="border border-slate-800 bg-slate-950 rounded p-3 space-y-1">
                    <div className="flex items-center justify-between text-slate-300 font-semibold">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono">
                          {idx + 1}
                        </span>
                        <span>{step.step_name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{step.timestamp}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] pl-7">{step.details}</p>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
