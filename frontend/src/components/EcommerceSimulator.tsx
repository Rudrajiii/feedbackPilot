import React, { useState } from 'react';
import { ShoppingBag, Star, CheckCircle2, Send, Package } from 'lucide-react';
import { submitFeedback } from '../api';
import type { FeedbackItem } from '../types';

export const EcommerceSimulator: React.FC = () => {
  const [reviewText, setReviewText] = useState('');
  const productName = 'Pro Wireless ANC Headphones';
  const [isProcessing, setIsProcessing] = useState(false);
  const [reviews, setReviews] = useState<FeedbackItem[]>([]);

  const handleReviewSubmit = async (overrideText?: string) => {
    const text = overrideText !== undefined ? overrideText : reviewText;
    if (!text.trim() || isProcessing) return;

    setIsProcessing(true);

    const result = await submitFeedback({
      customer_id: `Buyer_${Math.floor(100 + Math.random() * 900)}`,
      message: text,
      platform: 'ecommerce',
      context: `Product Review for ${productName}`
    });

    setReviews(prev => [result, ...prev]);
    if (overrideText === undefined) setReviewText('');
    setIsProcessing(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Info */}
      <div className="border border-slate-800 bg-slate-900 rounded-lg p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShoppingBag className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-100">E-Commerce Store Product Review Sandbox</h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Simulates product review triage for platforms like Amazon, Flipkart, or Shopify. Automatically prompts happy customers for 5-star ratings while escalating defective products or shipping issues to support.
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
            Platform: <strong className="text-slate-200">E-Commerce Storefront</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Product Page Mockup Card */}
        <div className="border border-slate-800 bg-slate-900 rounded-lg p-6 space-y-4">
          <div className="aspect-video bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center">
            <Package className="w-12 h-12 text-slate-700" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">Electronics</span>
            <h3 className="font-bold text-slate-100 text-base">{productName}</h3>
            <div className="flex items-center space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs text-slate-400 ml-2">(4.9 • 1,280 reviews)</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Active Noise Canceling over-ear headphones with 40h battery life and lossless audio support.
          </p>
        </div>

        {/* Submit Review Form */}
        <div className="lg:col-span-2 border border-slate-800 bg-slate-900 rounded-lg p-6 space-y-6">
          <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-3">
            Write Product Review
          </h3>

          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-semibold">Your Review</label>
            <textarea
              rows={4}
              placeholder="How was the build quality, audio performance, or shipping speed?"
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => handleReviewSubmit()}
            disabled={isProcessing || !reviewText.trim()}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-semibold rounded-md text-sm flex items-center justify-center space-x-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Submit Product Review</span>
          </button>

          {/* Quick Presets */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-400 font-medium">Quick Preset Reviews:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => handleReviewSubmit('The sound quality is mind blowing! Bass is deep and battery lasts forever.')}
                className="text-left text-xs p-2.5 rounded bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-300 transition-colors"
              >
                😍 "Sound quality is mind blowing..." (Positive Review)
              </button>
              <button
                onClick={() => handleReviewSubmit('Left ear speaker stopped working after 2 days. Requesting immediate replacement.')}
                className="text-left text-xs p-2.5 rounded bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-300 transition-colors"
              >
                📦 "Left ear speaker stopped working..." (Defect / Negative)
              </button>
            </div>
          </div>

          {/* Review Results */}
          {reviews.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Processed Reviews & Actions</h4>
              <div className="space-y-3">
                {reviews.map(item => (
                  <div key={item.id} className="border border-slate-800 bg-slate-950 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{item.customer_id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-mono border ${
                        item.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        item.sentiment === 'negative' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {item.sentiment?.toUpperCase()} ({item.urgency?.toUpperCase()} URGENCY)
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">"{item.message}"</p>
                    <div className="p-3 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-mono text-emerald-400 block text-[11px] mb-0.5">{item.action_taken}</span>
                        <span>{item.custom_message}</span>
                      </div>
                    </div>
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
