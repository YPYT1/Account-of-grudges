// 恋心物语 - API 响应类型定义
// 根据模拟后端返回数据文档定义的完整 API 响应类型

import {
  UserInfo,
  CoupleInfo,
  EventItem,
  MoodTag,
  SweetMessage,
  SubscriptionPlan,
  NotificationItem,
  MoodAnalytics,
  AccessStatus
} from './index';

// ==================== 通用 API 响应结构 ====================

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  errors?: Record<string, string>;
}

// ==================== 具体 API 响应类型 ====================

// GET /api/me - 获取当前会话信息
export interface MeResponse {
  access_status: AccessStatus;
  currentUser: UserInfo;
  partner: UserInfo | null;
  coupleInfo: CoupleInfo | null;
}

// POST /api/couples/invitations - 创建绑定邀请
export interface CreateInvitationResponse {
  invite_code: string;
  expires_at: string;
}

// POST /api/couples/accept-invitation - 接受绑定邀请
export interface AcceptInvitationResponse extends MeResponse {}

// GET /api/subscriptions/plans - 获取订阅套餐
export interface SubscriptionPlansResponse extends Array<SubscriptionPlan> {}

// POST /api/subscriptions - 创建订阅订单
export interface CreateSubscriptionResponse {
  order_id: string;
  plan_name: string;
  original_amount: string;
  discount_amount: string;
  final_amount: string;
  payment_gateway_payload: {
    appId: string;
    timeStamp: string;
    nonceStr: string;
    package: string;
    signType: string;
    paySign: string;
  };
}

// GET /api/notifications - 获取通知列表
export interface NotificationsResponse {
  unread_count: number;
  notifications: NotificationItem[];
}

// GET /api/events - 获取事件列表
export interface EventsResponse extends Array<EventItem> {}

// GET /api/events/{eventId} - 获取单个事件详情
export interface EventDetailResponse extends EventItem {}

// POST /api/events - 创建新事件
export interface CreateEventResponse extends EventItem {}

// PUT /api/events/{eventId} - 更新事件
export interface UpdateEventResponse extends EventItem {}

// DELETE /api/events/{eventId} - 删除事件
export interface DeleteEventResponse {
  id: string;
}

// GET /api/mood-tags - 获取心情标签
export interface MoodTagsResponse extends Array<MoodTag> {}

// GET /api/sweet-messages - 获取甜蜜留言
export interface SweetMessagesResponse extends Array<SweetMessage> {}

// POST /api/sweet-messages - 创建甜蜜留言
export interface CreateSweetMessageResponse extends SweetMessage {}

// GET /api/analytics/mood - 获取心情分析
export interface MoodAnalyticsResponse extends MoodAnalytics {}

// PUT /api/me - 更新用户资料
export interface UpdateProfileResponse {
  currentUser: UserInfo;
}

// POST /api/couples/unbind - 解绑情侣关系
export interface UnbindCoupleResponse extends MeResponse {}

// ==================== 错误响应类型 ====================

export interface ApiErrorResponse {
  code: number;
  message: string;
  data: null;
  errors?: Record<string, string>;
}

// ==================== 请求参数类型 ====================

// 查询参数
export interface EventsQueryParams {
  status: 'unresolved' | 'resolved';
}

export interface MoodAnalyticsQueryParams {
  period: 'weekly' | 'monthly';
}

// ==================== 微信支付相关类型 ====================

export interface WxPaymentParams {
  appId: string;
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}

// ==================== 本地存储类型 ====================

export interface StorageKeys {
  ACCESS_TOKEN: 'access_token';
  USER_INFO: 'user_info';
  COUPLE_INFO: 'couple_info';
}

// ==================== 页面数据类型 ====================

export interface PageData {
  isLoading: boolean;
  error: string | null;
}

export interface EventListPageData extends PageData {
  events: EventItem[];
  hasMore: boolean;
  page: number;
}

export interface MoodPageData extends PageData {
  analytics: MoodAnalytics | null;
  period: 'weekly' | 'monthly';
}

export interface SweetPageData extends PageData {
  messages: SweetMessage[];
  newMessage: string;
  newNickname: string;
}

export interface ProfilePageData extends PageData {
  userInfo: UserInfo | null;
  isEditing: boolean;
  editForm: {
    nickname: string;
    bio: string;
  };
}
