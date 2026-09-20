import React, { useState } from 'react';
import { Share2, Heart, MessageCircle, Send, CheckCircle2, AlertTriangle, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import { submitFeedback } from '../api';
import type { SocialMediaComment } from '../types';

export const SocialMediaSimulator: React.FC = () => {
  const [commentInput, setCommentInput] = useState('');
  const [authorHandle, setAuthorHandle] = useState('@tech_fanatic');
  const [isProcessing, setIsProcessing] = useState(false);

  const [comments, setComments] = useState<SocialMediaComment[]>([
    {
      id: 'c1',
      author_name: 'Alex Rivera',
      author_handle: '@alex_dev',
      author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
      time_ago: '15m ago',
      content: 'ya thats a cool stuff',
      likes: 12,
      status: 'processed',
      pipeline_result: {
        id: 991,
        customer_id: '@alex_dev',
        message: 'ya thats a cool stuff',
        platform: 'social_media',
        status: 'completed',
        sentiment: 'positive',
        confidence: 0.98,
        urgency: 'low',
        summary: 'Short casual praise for the product architecture post.',
        action_taken: 'tool_called: post_comment_reply_tool',
        custom_message: 'Thanks buddy! Glad you liked it! 🔥',
        created_at: new Date().toISOString()
      }
    },
    {
      id: 'c2',
      author_name: 'Marcus Vance',
      author_handle: '@marcus_v',
      author_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80',
      time_ago: '40m ago',
      content: 'Your system crashed during checkout and charged my card twice! Fix this immediately!',
      likes: 4,
      status: 'processed',
      pipeline_result: {
        id: 992,
        customer_id: '@marcus_v',
        message: 'Your system crashed during checkout and charged my card twice! Fix this immediately!',
        platform: 'social_media',
        status: 'completed',
        sentiment: 'negative',
        confidence: 0.99,
        urgency: 'high',
        summary: 'Checkout crash resulting in double charge.',
        action_taken: 'tool_called: notify_support_tool',
        custom_message: 'Privately alerted Account Owner via Urgent Email (No public argument posted)',
        created_at: new Date().toISOString()
      }
    }
  ]);

  const handlePostComment = async (overrideMsg?: string) => {
    const msgToPost = overrideMsg || commentInput;
    if (!msgToPost.trim() || isProcessing) return;

    setIsProcessing(true);
    const newCommentId = 'c_' + Date.now();
    
    const draftComment: SocialMediaComment = {
      id: newCommentId,
      author_name: authorHandle.replace('@', '').replace('_', ' '),
      author_handle: authorHandle,
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
      time_ago: 'Just now',
      content: msgToPost,
      likes: 0,
      status: 'processing'
    };

    setComments(prev => [draftComment, ...prev]);
    if (!overrideMsg) setCommentInput('');

    const result = await submitFeedback({
      customer_id: authorHandle,
      message: msgToPost,
      platform: 'social_media',
      context: 'Post: Launching FeedbackPilot Agentic Engine'
    });

    setComments(prev =>
      prev.map(c =>
        c.id === newCommentId
          ? { ...c, status: 'processed', pipeline_result: result }
          : c
      )
    );

    setIsProcessing(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Header Info Banner */}
      <div className="border border-slate-800 bg-slate-900 rounded-lg p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <Share2 className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">Social Media Feed & Admin Auto-Reply Sandbox</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              When users leave comments on a post, <strong className="text-slate-200">FeedbackPilot</strong> acts on behalf of the admin: auto-replying directly to positive comments with concise engagement, while emailing support for negative complaints.
            </p>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 self-start sm:self-auto shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="whitespace-nowrap">Mode: <strong className="text-slate-200">Admin Agent</strong></span>
          </div>
        </div>
      </div>

      {/* Main Social Post Card */}
      <div className="border border-slate-800 bg-slate-900 rounded-lg overflow-hidden">
        
        {/* Post Author Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80"
              alt="Brand Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-700 shrink-0"
            />
            <div>
              <div className="flex items-center space-x-1.5 flex-wrap">
                <h3 className="font-bold text-slate-100 text-sm">FeedbackPilot Official</h3>
                <span className="text-emerald-400 text-xs font-mono">✓ Verified</span>
              </div>
              <p className="text-xs text-slate-400">@feedbackpilot_ai • 2h ago</p>
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
            Public Announcement
          </span>
        </div>

        {/* Post Content */}
        <div className="p-4 sm:p-5 space-y-4 border-b border-slate-800">
          <p className="text-slate-200 text-sm leading-relaxed">
            🚀 Excited to announce our new agentic feedback triage engine! Built with LCEL conditional chains, FastAPI, and real-time execution tracing. Let us know what you think in the comments below! 👇
          </p>
          <div className="flex items-center space-x-6 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span className="flex items-center space-x-1"><Heart className="w-4 h-4 text-rose-400" /> <span>342 Likes</span></span>
            <span className="flex items-center space-x-1"><MessageCircle className="w-4 h-4 text-slate-400" /> <span>{comments.length} Comments</span></span>
          </div>
        </div>

        {/* Comment Input Box */}
        <div className="p-4 sm:p-5 bg-slate-950/60 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate User Comment</span>
            </label>
            
            {/* Handle Switcher */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 whitespace-nowrap">Handle:</span>
              <input
                type="text"
                value={authorHandle}
                onChange={e => setAuthorHandle(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded text-xs px-2 py-1 text-slate-200 focus:outline-none focus:border-emerald-500 w-32"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="e.g. 'ya thats a cool stuff' or 'service was terrible'"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePostComment()}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-md px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handlePostComment()}
              disabled={isProcessing || !commentInput.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-semibold rounded-md text-sm flex items-center justify-center space-x-2 transition-colors whitespace-nowrap shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Post Comment</span>
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Quick Presets:</span>
            <button
              onClick={() => handlePostComment('ya thats a cool stuff')}
              className="text-xs px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors whitespace-nowrap"
            >
              💬 "ya thats a cool stuff" (Positive Casual)
            </button>
            <button
              onClick={() => handlePostComment('Your service is terrible, I want a full refund right now!')}
              className="text-xs px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors whitespace-nowrap"
            >
              😡 "Your service is terrible..." (Negative Urgent)
            </button>
            <button
              onClick={() => handlePostComment('What technologies did you use for the backend pipeline?')}
              className="text-xs px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors whitespace-nowrap"
            >
              🤔 "What technologies..." (Neutral Question)
            </button>
          </div>
        </div>

        {/* Comment Thread */}
        <div className="p-4 sm:p-5 space-y-4 sm:space-y-6">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Comment Thread & Live AI Actions</h4>
          
          {comments.map((comment) => {
            const res = comment.pipeline_result;
            const isPos = res?.sentiment === 'positive';
            const isNeg = res?.sentiment === 'negative';
            const sentimentText = res?.sentiment || 'unknown';
            const confidencePercent = res?.confidence ? Math.round(res.confidence * 100) : 95;

            return (
              <div key={comment.id} className="border border-slate-800/80 bg-slate-900/50 rounded-lg p-4 space-y-3">
                
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center space-x-3">
                    <img src={comment.author_avatar} alt="" className="w-8 h-8 rounded-full border border-slate-700 shrink-0" />
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="font-semibold text-slate-200 text-sm">{comment.author_name}</span>
                        <span className="text-xs text-slate-400 font-mono">{comment.author_handle}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{comment.time_ago}</span>
                    </div>
                  </div>

                  {/* Sentiment Badge */}
                  {res && (
                    <span className={`text-[11px] px-2.5 py-0.5 rounded font-mono border whitespace-nowrap shrink-0 ${
                      isPos ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      isNeg ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {sentimentText.toUpperCase()} ({confidencePercent}%)
                    </span>
                  )}
                </div>

                {/* User Comment Content */}
                <p className="text-slate-200 text-sm sm:pl-11 leading-relaxed">{comment.content}</p>

                {/* Processing State */}
                {comment.status === 'processing' && (
                  <div className="sm:ml-11 p-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                    <span>FeedbackPilot processing sentiment & routing agentic response...</span>
                  </div>
                )}

                {/* Automated AI Output */}
                {res && (
                  <div className="sm:ml-11 pt-1 space-y-2">
                    
                    {/* Positive: Inline Auto-Reply on Admin Behalf */}
                    {isPos && (
                      <div className="border border-emerald-500/30 bg-emerald-950/20 rounded-md p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs text-emerald-400 font-medium flex-wrap gap-1">
                          <span className="flex items-center space-x-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Auto-Replied on Account Admin's Behalf</span>
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            tool_called: post_comment_reply_tool
                          </span>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded p-3 text-xs text-slate-200 flex items-start space-x-2.5">
                          <img
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80"
                            alt="Admin Avatar"
                            className="w-5 h-5 rounded-full mt-0.5 border border-slate-700 shrink-0"
                          />
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-300 block">FeedbackPilot Official (Admin):</span>
                            <span className="text-slate-200">{res.custom_message}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Negative: Private Email Escalation */}
                    {isNeg && (
                      <div className="border border-rose-500/30 bg-rose-950/20 rounded-md p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs text-rose-400 font-medium flex-wrap gap-1">
                          <span className="flex items-center space-x-1.5">
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>Escalated Privately to Account Owner (Email Alert)</span>
                          </span>
                          <span className="font-mono text-[10px] text-rose-300/80 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                            tool_called: notify_support_tool
                          </span>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded p-3 text-xs text-slate-300 space-y-1.5">
                          <div className="flex items-center justify-between text-slate-400 text-[11px] flex-wrap gap-1">
                            <span className="flex items-center space-x-1"><Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" /> <span>To: admin@company.com</span></span>
                            <span className="text-rose-400 font-bold bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-900">Priority: HIGH</span>
                          </div>
                          <p className="text-slate-200 font-mono text-[11px]">Subject: [HIGH URGENCY] Social Comment Escalation from {comment.author_handle}</p>
                          <p className="text-slate-400 text-[11px]">Summary: {res.summary}</p>
                          <p className="text-[11px] text-slate-500 italic">No public argument posted on feed; issue directed to private support queue.</p>
                        </div>
                      </div>
                    )}

                    {/* Neutral Log */}
                    {res.sentiment === 'neutral' && (
                      <div className="border border-amber-500/30 bg-amber-950/20 rounded-md p-3 text-xs text-amber-300 flex items-center justify-between flex-wrap gap-1">
                        <span className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                          <span>Neutral Comment Recorded (Log Only)</span>
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">action: log_only</span>
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
