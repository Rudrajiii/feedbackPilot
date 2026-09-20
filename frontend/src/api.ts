import type { FeedbackItem, PlatformType } from './types';

const API_BASE_URL = 'http://localhost:8000';

const mockFeedbackStore: FeedbackItem[] = [
  {
    id: 101,
    customer_id: '@alex_dev',
    message: 'ya thats a cool stuff',
    platform: 'social_media',
    context: 'Post: AI Feedback Triage Engine Architecture',
    status: 'completed',
    sentiment: 'positive',
    confidence: 0.96,
    urgency: 'low',
    summary: 'The user expressed quick casual praise for the shared AI content.',
    action_taken: 'tool_called: post_comment_reply_tool',
    custom_message: 'Thanks buddy! Glad you liked it! 🔥',
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    trace_steps: [
      { step_name: 'Sanitize & Preprocess', status: 'completed', timestamp: '0.01s', details: 'Normalized whitespace and stripped noise.' },
      { step_name: 'Sentiment & Urgency LLM Analysis', status: 'completed', timestamp: '0.42s', details: 'Positive (96%), Urgency: Low, Tone: Casual' },
      { step_name: 'LCEL Conditional Router', status: 'completed', timestamp: '0.43s', details: 'Routed to positive_agent (Social Media)' },
      { step_name: 'Agent Execution & Tool Binding', status: 'completed', timestamp: '0.89s', details: 'Executed post_comment_reply_tool -> "Thanks buddy! Glad you liked it! 🔥"' }
    ]
  },
  {
    id: 102,
    customer_id: 'User_Ride_88',
    message: 'Driver arrived 25 mins late in a dirty car and was extremely rude when I complained.',
    platform: 'ride_sharing',
    context: 'UberX Trip #UB-94821 from Airport to City Center',
    status: 'completed',
    sentiment: 'negative',
    confidence: 0.99,
    urgency: 'high',
    summary: 'Customer experienced severe delay, poor vehicle hygiene, and rude behavior.',
    action_taken: 'tool_called: notify_support_tool',
    custom_message: 'Escalated to Priority Support Email [HIGH URGENCY]',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    trace_steps: [
      { step_name: 'Sanitize & Preprocess', status: 'completed', timestamp: '0.01s', details: 'Normalized whitespace.' },
      { step_name: 'Sentiment & Urgency LLM Analysis', status: 'completed', timestamp: '0.51s', details: 'Negative (99%), Urgency: High, Topics: Delay, Hygiene, Behavior' },
      { step_name: 'LCEL Conditional Router', status: 'completed', timestamp: '0.52s', details: 'Routed to negative_agent (Escalation)' },
      { step_name: 'Agent Execution & Tool Binding', status: 'completed', timestamp: '0.94s', details: 'Executed notify_support_tool -> Email sent to support@company.com' }
    ]
  },
  {
    id: 103,
    customer_id: 'Customer_4910',
    message: 'The noise canceling headphones are fantastic! Audio clarity is crisp and battery lasts all day.',
    platform: 'ecommerce',
    context: 'Order #ORD-7712 - Pro Wireless ANC Headphones',
    status: 'completed',
    sentiment: 'positive',
    confidence: 0.98,
    urgency: 'low',
    summary: 'Praise for noise cancellation, audio quality, and battery life.',
    action_taken: 'tool_called: request_rating_tool',
    custom_message: 'Hi! We are thrilled you love the ANC headphones! Would you mind leaving a quick 5-star rating on our store?',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    trace_steps: [
      { step_name: 'Sanitize & Preprocess', status: 'completed', timestamp: '0.01s', details: 'Normalized whitespace.' },
      { step_name: 'Sentiment & Urgency LLM Analysis', status: 'completed', timestamp: '0.45s', details: 'Positive (98%), Urgency: Low, Topics: ANC, Sound, Battery' },
      { step_name: 'LCEL Conditional Router', status: 'completed', timestamp: '0.46s', details: 'Routed to positive_agent (E-Commerce)' },
      { step_name: 'Agent Execution & Tool Binding', status: 'completed', timestamp: '0.88s', details: 'Executed request_rating_tool -> Prompted 5-Star Review Request' }
    ]
  }
];

export async function submitFeedback(payload: {
  customer_id: string;
  message: string;
  platform: PlatformType;
  context?: string;
}): Promise<FeedbackItem> {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = await response.json();
      return getFeedbackById(data.id);
    }
  } catch (err) {
    console.warn('Backend API unreachable, utilizing client-side mock simulation:', err);
  }

  const isPositive = payload.message.toLowerCase().includes('cool') || 
                     payload.message.toLowerCase().includes('love') || 
                     payload.message.toLowerCase().includes('great') || 
                     payload.message.toLowerCase().includes('awesome') || 
                     payload.message.toLowerCase().includes('fast') ||
                     payload.message.toLowerCase().includes('perfect') ||
                     payload.message.toLowerCase().includes('good');

  const isNegative = payload.message.toLowerCase().includes('late') || 
                     payload.message.toLowerCase().includes('bad') || 
                     payload.message.toLowerCase().includes('terrible') || 
                     payload.message.toLowerCase().includes('dirty') || 
                     payload.message.toLowerCase().includes('rude') ||
                     payload.message.toLowerCase().includes('worst') ||
                     payload.message.toLowerCase().includes('stop');

  const sentiment = isPositive ? 'positive' : isNegative ? 'negative' : 'neutral';
  const urgency = isNegative ? 'high' : 'low';

  let action_taken = 'log_only';
  let custom_message = 'Logged to database for operational review.';

  if (sentiment === 'positive') {
    if (payload.platform === 'social_media') {
      action_taken = 'tool_called: post_comment_reply_tool';
      if (payload.message.length < 25) {
        custom_message = 'Thanks buddy! Glad you liked it! 🔥';
      } else {
        custom_message = 'Appreciated! Thanks for taking the time to share your feedback 🙌';
      }
    } else {
      action_taken = 'tool_called: request_rating_tool';
      custom_message = `Hi ${payload.customer_id}! Glad to hear you had a great experience with ${payload.context || 'us'}. Would you take 10 seconds to give us a 5-star rating? ⭐⭐⭐⭐⭐`;
    }
  } else if (sentiment === 'negative') {
    action_taken = 'tool_called: notify_support_tool';
    custom_message = `[HIGH URGENCY EMAIL] Alerted Support Admin regarding complaint from ${payload.customer_id}. Issue: "${payload.message.slice(0, 50)}..."`;
  }

  const newItem: FeedbackItem = {
    id: Date.now(),
    customer_id: payload.customer_id,
    message: payload.message,
    platform: payload.platform,
    context: payload.context,
    status: 'completed',
    sentiment,
    confidence: 0.95,
    urgency,
    summary: `Processed feedback regarding ${payload.context || 'general service'}.`,
    action_taken,
    custom_message,
    created_at: new Date().toISOString(),
    trace_steps: [
      { step_name: 'Sanitize & Preprocess', status: 'completed', timestamp: '0.01s', details: 'Trimmed whitespace and token limit validation.' },
      { step_name: 'Sentiment & Urgency LLM Analysis', status: 'completed', timestamp: '0.38s', details: `Sentiment: ${sentiment.toUpperCase()} (95%), Urgency: ${urgency.toUpperCase()}` },
      { step_name: 'LCEL Conditional Router', status: 'completed', timestamp: '0.39s', details: `Routed to ${sentiment}_agent (Platform: ${payload.platform})` },
      { step_name: 'Agent Execution & Tool Binding', status: 'completed', timestamp: '0.75s', details: `Executed ${action_taken}` }
    ]
  };

  mockFeedbackStore.unshift(newItem);
  return newItem;
}

export async function getFeedbackById(id: number): Promise<FeedbackItem> {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/${id}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Backend API fetch error, using local store:', err);
  }
  return mockFeedbackStore.find(item => item.id === id) || mockFeedbackStore[0];
}

export async function getAllFeedback(): Promise<FeedbackItem[]> {
  return [...mockFeedbackStore];
}
