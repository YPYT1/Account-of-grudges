// 恋心物语 - TypeScript 类型定义
// 根据后端API文档和模拟数据定义的完整类型系统

// ==================== 基础类型 ====================

// 用户信息
export interface UserInfo {
  id: string;
  openid: string;
  nickname: string;
  avatar_url: string;
  display_gender: 'male' | 'female' | 'other';
  bio: string;
  status: 'active' | 'suspended' | 'deleted';
  is_admin: boolean;
  preferences: {
    notifications: {
      new_event_push: boolean;
      event_resolved_push: boolean;
      new_message_push: boolean;
    };
    theme: 'light' | 'dark' | 'system';
  };
  last_login_at: string;
  created_at: string;
}

// 情侣关系信息
export interface CoupleInfo {
  id: string;
  anniversary_date: string;
  trial_ends_at: string | null;
  subscription_expires_at: string | null;
  status: 'active' | 'unbound';
}

// 心情标签
export interface MoodTag {
  id: number;
  name: string;
  emoji_icon: string;
  category: 'positive' | 'negative' | 'neutral';
  impact_on_connection_score: number;
  score: number;
}

// 事件/帖子信息
export interface EventItem {
  id: string;
  couple_id: string;
  type: 'brainstorming' | 'sweet_moment';
  description: string;
  status: 'unresolved' | 'resolved' | 'deleted';
  solution: string | null;
  event_date: string;
  images: string[];
  location_text: string | null;
  author: {
    id: string;
    nickname: string;
    display_gender: 'male' | 'female' | 'other';
  };
  mood_tag: MoodTag;
  reactions: Array<{
    author_id: string;
    emoji: string;
  }>;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

// 甜蜜留言
export interface SweetMessage {
  id: string;
  couple_id: string;
  author_id: string;
  message: string;
  nickname: string;
  is_pinned: boolean;
  created_at: string;
  author: {
    id: string;
    display_gender: 'male' | 'female' | 'other';
  };
}

// 订阅套餐
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  duration_months: number;
  tags: string[];
}

// 通知信息
export interface NotificationItem {
  id: string;
  type: 'subscription_expiring_soon' | 'new_event_from_partner' | 'subscription_activated';
  content: string;
  is_read: boolean;
  related_resource_type: string | null;
  related_resource_id: string | null;
  created_at: string;
}

// 心情分析数据
export interface MoodAnalytics {
  period_range: string;
  trend: {
    labels: string[];
    datasets: Array<{
      label: string;
      gender: 'male' | 'female';
      data: number[];
    }>;
  };
  distribution: {
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor: string[];
    }>;
  };
}

// ==================== 访问状态类型 ====================
export type AccessStatus = 'ADMIN' | 'FULL_ACCESS' | 'TRIAL' | 'EXPIRED' | 'UNBOUND';

// ==================== 请求/响应类型 ====================

// 创建事件请求
export interface CreateEventRequest {
  type: 'brainstorming' | 'sweet_moment';
  description: string;
  event_date: string;
  mood_tag_id: number;
  images: string[];
  location_text?: string;
}

// 更新事件请求
export interface UpdateEventRequest {
  solution?: string;
  status?: 'resolved';
}

// 创建甜蜜留言请求
export interface CreateSweetMessageRequest {
  message: string;
  nickname: string;
}

// 更新用户资料请求
export interface UpdateProfileRequest {
  nickname?: string;
  bio?: string;
}

// 创建订阅请求
export interface CreateSubscriptionRequest {
  plan_id: string;
  promo_code?: string;
}

// 接受邀请请求
export interface AcceptInvitationRequest {
  invite_code: string;
}
