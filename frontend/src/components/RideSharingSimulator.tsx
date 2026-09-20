import React, { useState } from 'react';
import { Car, Star, Send, MapPin } from 'lucide-react';
import { submitFeedback } from '../api';
import type { FeedbackItem } from '../types';

export const RideSharingSimulator: React.FC = () => {
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const tripId = 'UB-94821';
  const driverName = 'Rajesh Kumar';
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentTriages, setRecentTriages] = useState<FeedbackItem[]>([]);

  const handleSubmit = async (overrideText?: string, overrideRating?: number) => {
    const text = overrideText !== undefined ? overrideText : feedbackText;
    if (overrideRating !== undefined) setRating(overrideRating);
    if (!text.trim() || isProcessing) return;

    setIsProcessing(true);

    const result = await submitFeedback({
      customer_id: `Passenger_${Math.floor(1000 + Math.random() * 9000)}`,
      message: text,
      platform: 'ride_sharing',
      context: `Uber Trip #${tripId} with Driver ${driverName}`
    });

    setRecentTriages(prev => [result, ...prev]);
    if (overrideText === undefined) setFeedbackText('');
    setIsProcessing(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="border border-slate-800 bg-slate-900 rounded-lg p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Car className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-100">In-App Ride / Delivery Feedback Sandbox</h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Simulates ride-hailing & food delivery apps (Uber, Rapido, Swiggy). Analyzes passenger feedback post-trip, instantly triggering driver rating prompts or escalating support tickets for severe trip delays and safety issues.
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
            Platform: <strong className="text-slate-200">Ride & Delivery Service</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Mobile App Rating Interface Mockup */}
        <div className="border border-slate-800 bg-slate-900 rounded-lg p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold">
                RK
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm">{driverName}</h3>
                <p className="text-xs text-slate-400">White Swift DZire • KA-05-MH-9921</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-mono">
              Trip Finished
            </span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded border border-slate-800 text-xs text-slate-300 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Route: Airport Terminal 2 ➔ Indiranagar 100ft Road</span>
          </div>

          {/* Rating Stars */}
          <div className="space-y-2 text-center">
            <label className="text-xs text-slate-400 font-medium">How was your ride experience?</label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Input */}
          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-semibold">Write Feedback</label>
            <textarea
              rows={3}
              placeholder="Tell us about your trip..."
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => handleSubmit()}
            disabled={isProcessing || !feedbackText.trim()}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-semibold rounded-md text-sm flex items-center justify-center space-x-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Submit Trip Feedback</span>
          </button>

          {/* Preset Test Scenarios */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-400 font-medium">Quick Test Scenarios:</span>
            <div className="space-y-1.5">
              <button
                onClick={() => handleSubmit('Super smooth ride! Driver was polite and car was sparkling clean.', 5)}
                className="w-full text-left text-xs p-2 rounded bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-300 transition-colors"
              >
                ⭐ "Super smooth ride! Driver was polite..." (5 Star Praise)
              </button>
              <button
                onClick={() => handleSubmit('Driver arrived 30 mins late, vehicle was dirty, and driver refused AC.', 1)}
                className="w-full text-left text-xs p-2 rounded bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-300 transition-colors"
              >
                😡 "Driver arrived 30 mins late..." (1 Star Complaint)
              </button>
            </div>
          </div>
        </div>

        {/* Live Pipeline Processing Log */}
        <div className="border border-slate-800 bg-slate-900 rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center justify-between border-b border-slate-800 pb-3">
            <span>Live Pipeline Triage Results</span>
            <span className="text-xs text-slate-400 font-normal">{recentTriages.length} processed</span>
          </h3>

          {recentTriages.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No trip feedback submitted yet. Submit a rating to see real-time agentic triage!
            </div>
          ) : (
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {recentTriages.map((triage) => (
                <div key={triage.id} className="border border-slate-800 bg-slate-950 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">{triage.customer_id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-mono border ${
                      triage.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      triage.sentiment === 'negative' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {triage.sentiment?.toUpperCase()} ({triage.urgency?.toUpperCase()} URGENCY)
                    </span>
                  </div>

                  <p className="text-xs text-slate-200">"{triage.message}"</p>

                  <div className="p-3 rounded bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Action Executed:</span>
                      <span className="font-mono text-emerald-400">{triage.action_taken}</span>
                    </div>
                    <p className="text-slate-300 font-medium">{triage.custom_message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
