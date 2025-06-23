// 恋心物语 - 全局常量定义

// ==================== API 相关常量 ====================

// API 基础地址 (开发阶段使用模拟数据，后期切换到真实后端)
export const API_BASE_URL = 'https://mock-api.lianxinwuyu.com/api';

// 业务状态码
export const API_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

// 访问状态
export const ACCESS_STATUS = {
  ADMIN: 'ADMIN',
  FULL_ACCESS: 'FULL_ACCESS',
  TRIAL: 'TRIAL',
  EXPIRED: 'EXPIRED',
  UNBOUND: 'UNBOUND'
};

// ==================== 存储键名常量 ====================

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER_INFO: 'user_info',
  COUPLE_INFO: 'couple_info',
  LAST_LOGIN: 'last_login'
};

// ==================== UI 相关常量 ====================

// 主题色彩
export const COLORS = {
  PRIMARY: '#FADADD',        // 樱花粉 (主色)
  SECONDARY: '#B2D9EA',      // 天空蓝 (对比色)
  ACCENT: '#FFF3B0',         // 柠檬黄 (点缀色)
  BACKGROUND: '#FFF9F5',     // 奶油底 (背景色)
  TEXT_PRIMARY: '#333333',   // 标准文本色
  TEXT_SECONDARY: '#666666', // 次要文本色
  TEXT_DISABLED: '#999999',  // 禁用文本色
  BORDER: '#E5E5E5',         // 边框色
  SUCCESS: '#52C41A',        // 成功色
  WARNING: '#FAAD14',        // 警告色
  ERROR: '#F5222D'           // 错误色
};

// 尺寸规范
export const SIZES = {
  // 间距
  PADDING_SMALL: 8,
  PADDING_MEDIUM: 16,
  PADDING_LARGE: 24,
  MARGIN_SMALL: 8,
  MARGIN_MEDIUM: 16,
  MARGIN_LARGE: 24,
  
  // 圆角
  BORDER_RADIUS_SMALL: 8,
  BORDER_RADIUS_MEDIUM: 16,
  BORDER_RADIUS_LARGE: 24,
  
  // 字体大小
  FONT_SIZE_SMALL: 12,
  FONT_SIZE_MEDIUM: 14,
  FONT_SIZE_LARGE: 16,
  FONT_SIZE_XLARGE: 18,
  FONT_SIZE_TITLE: 20,
  
  // 组件尺寸
  BUTTON_HEIGHT: 48,
  INPUT_HEIGHT: 44,
  CARD_PADDING: 16,
  TAB_BAR_HEIGHT: 56
};

// ==================== 业务相关常量 ====================

// 事件类型
export const EVENT_TYPES = {
  BRAINSTORMING: 'brainstorming',
  SWEET_MOMENT: 'sweet_moment'
};

// 事件状态
export const EVENT_STATUS = {
  UNRESOLVED: 'unresolved',
  RESOLVED: 'resolved',
  DELETED: 'deleted'
};

// 心情标签类别
export const MOOD_CATEGORIES = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral'
};

// 通知类型
export const NOTIFICATION_TYPES = {
  SUBSCRIPTION_EXPIRING: 'subscription_expiring_soon',
  NEW_EVENT_FROM_PARTNER: 'new_event_from_partner',
  SUBSCRIPTION_ACTIVATED: 'subscription_activated'
};

// ==================== 页面路径常量 ====================

export const PAGES = {
  INDEX: '/pages/index/index',
  AUTH: '/pages/auth/index',
  COUPLE: '/pages/couple/index',
  MOOD: '/pages/mood/mood',
  SWEET: '/pages/sweet/sweet',
  PROFILE: '/pages/profile/profile',
  EVENT_DETAIL: '/pages/events/detail',
  EVENT_ADD: '/pages/events/add'
};

// ==================== 默认配置 ====================

// 分页配置
export const PAGINATION = {
  PAGE_SIZE: 20,
  INITIAL_PAGE: 1
};

// 图片配置
export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_COUNT: 9,
  ALLOWED_TYPES: ['jpg', 'jpeg', 'png', 'gif']
};

// 文本长度限制
export const TEXT_LIMITS = {
  NICKNAME_MAX: 20,
  BIO_MAX: 100,
  EVENT_DESCRIPTION_MAX: 500,
  SWEET_MESSAGE_MAX: 200,
  SOLUTION_MAX: 300
};

// ==================== 动画配置 ====================

export const ANIMATION = {
  DURATION_FAST: 200,
  DURATION_NORMAL: 300,
  DURATION_SLOW: 500,
  EASING: 'ease-in-out'
};

// ==================== 错误消息 ====================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接异常，请检查网络设置',
  SERVER_ERROR: '服务开小差了，请稍后再试',
  UNAUTHORIZED: '登录已过期，请重新登录',
  FORBIDDEN: '您没有权限执行此操作',
  NOT_FOUND: '请求的内容不存在',
  VALIDATION_ERROR: '输入信息有误，请检查后重试',
  UPLOAD_FAILED: '图片上传失败，请重试'
};

// ==================== 成功消息 ====================

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  LOGOUT_SUCCESS: '退出登录成功',
  SAVE_SUCCESS: '保存成功',
  DELETE_SUCCESS: '删除成功',
  UPDATE_SUCCESS: '更新成功',
  CREATE_SUCCESS: '创建成功',
  BIND_SUCCESS: '绑定成功',
  UNBIND_SUCCESS: '解绑成功'
};

// ==================== 正则表达式 ====================

export const REGEX = {
  PHONE: /^1[3-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  INVITE_CODE: /^[A-Z0-9]{6}$/
};
