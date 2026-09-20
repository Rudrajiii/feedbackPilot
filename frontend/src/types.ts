export type PlatformType = 'social_media' | 'ride_sharing' | 'ecommerce' | 'general';

export type SentimentType = 'positive' | 'neutral' | 'negative';
export type UrgencyType = 'low' | 'mid' | 'high';

export interface SentimentResult {
  sentiment: SentimentType;
  confidence: number;
  topics: string[];
  urgency: UrgencyType;
  summary: string;
}

export interface PipelineTraceStep {
  step_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp: string;
  details?: string;
  payload?: any;
}

export interface FeedbackItem {
  id: number;
  customer_id: string;
  message: string;
  platform: PlatformType;
  context?: string;
  status: 'processing' | 'completed' | 'failed';
  sentiment?: SentimentType;
  confidence?: number;
  urgency?: UrgencyType;
  summary?: string;
  action_taken?: string;
  custom_message?: string;
  created_at: string;
  trace_steps?: PipelineTraceStep[];
}

export interface SocialMediaComment {
  id: string;
  author_name: string;
  author_handle: string;
  author_avatar: string;
  time_ago: string;
  content: string;
  likes: number;
  status?: 'unprocessed' | 'processing' | 'processed';
  pipeline_result?: FeedbackItem;
}

export interface PresetScenario {
  id: string;
  title: string;
  description: string;
  platform: PlatformType;
  context: string;
  sample_message: string;
  expected_outcome: string;
}
