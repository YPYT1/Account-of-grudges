// 恋心物语 - 模拟 API 数据服务
// 基于模拟后端返回数据文档，提供完整的模拟数据响应

import { API_CODES } from '../utils/constants';

/**
 * 模拟 API 响应延迟
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Promise} 延迟 Promise
 */
function mockDelay(delay = 500) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * 创建标准 API 响应格式
 * @param {number} code - 状态码
 * @param {string} message - 响应消息
 * @param {any} data - 响应数据
 * @returns {Object} 标准响应格式
 */
function createResponse(code, message, data) {
  return { code, message, data };
}

// ==================== 模拟数据存储 ====================

// 当前用户状态（模拟不同场景）
let currentUserScenario = 'TRIAL'; // 'ADMIN', 'FULL_ACCESS', 'TRIAL', 'EXPIRED', 'UNBOUND'

// 模拟用户数据
const mockUsers = {
  admin: {
    id: "a1b2c3d4-0001-4001-8001-0123456789ab",
    openid: "openid-for-admin-user-01",
    nickname: "阿涛 (管理员)",
    avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
    display_gender: "male",
    bio: "系统的守护者，偶尔也记录生活。",
    status: "active",
    is_admin: true,
    preferences: {
      notifications: {
        new_event_push: true,
        event_resolved_push: true,
        new_message_push: false
      },
      theme: "dark"
    },
    last_login_at: "2023-10-27T10:00:00Z",
    created_at: "2023-01-15T12:00:00Z"
  },
  trial: {
    id: "c3d4e5f6-0005-4005-8005-abcdefabcdef",
    openid: "openid-for-trial-user-05",
    nickname: "试用用户A",
    avatar_url: "https://randomuser.me/api/portraits/men/50.jpg",
    display_gender: "male",
    bio: "正在体验这个神奇的小程序！",
    status: "active",
    is_admin: false,
    preferences: {
      notifications: {
        new_event_push: true,
        event_resolved_push: false,
        new_message_push: true
      },
      theme: "system"
    },
    last_login_at: "2023-10-27T14:00:00Z",
    created_at: "2023-10-15T18:30:00Z"
  }
};

// 模拟事件数据
const mockEvents = [
  {
    id: "evt-uuid-001",
    couple_id: "c1p2l3e4-0002-4002-8002-654321fedcba",
    type: "brainstorming",
    description: "说好的一起看电影，结果开场十分钟就睡着了，呼噜打得比电影声还响！",
    status: "unresolved",
    solution: null,
    event_date: "2023-10-26",
    images: [],
    location_text: "家里的沙发上",
    author: {
      id: "b2c3d4e5-0003-4003-8003-112233445566",
      nickname: "付费用户A",
      display_gender: "female"
    },
    mood_tag: {
      id: 1,
      name: "生气",
      emoji_icon: "😠"
    },
    reactions: [],
    resolved_at: null,
    created_at: "2023-10-26T22:30:00Z",
    updated_at: "2023-10-26T22:30:00Z"
  },
  {
    id: "evt-uuid-002",
    couple_id: "c1p2l3e4-0002-4002-8002-654321fedcba",
    type: "sweet_moment",
    description: "今天加班到很晚，回家发现他给我炖了汤，还准备了小惊喜，太感动了。",
    status: "unresolved",
    solution: null,
    event_date: "2023-10-25",
    images: [
      "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    location_text: null,
    author: {
      id: "b2c3d4e5-0003-4003-8003-112233445566",
      nickname: "付费用户A",
      display_gender: "female"
    },
    mood_tag: {
      id: 5,
      name: "感动",
      emoji_icon: "🥰"
    },
    reactions: [
      { author_id: "b2c3d4e5-0004-4004-8004-aabbccddeeff", emoji: "❤️" }
    ],
    resolved_at: null,
    created_at: "2023-10-25T23:00:00Z",
    updated_at: "2023-10-25T23:00:00Z"
  }
];

// 模拟心情标签数据
const mockMoodTags = [
  { id: 1, name: "生气", emoji_icon: "😠", category: "negative", impact_on_connection_score: -5, score: 2 },
  { id: 2, name: "委屈", emoji_icon: "🥺", category: "negative", impact_on_connection_score: -3, score: 3 },
  { id: 3, name: "无语", emoji_icon: "😑", category: "negative", impact_on_connection_score: -2, score: 4 },
  { id: 4, name: "平常", emoji_icon: "😐", category: "neutral", impact_on_connection_score: 0, score: 6 },
  { id: 5, name: "感动", emoji_icon: "🥰", category: "positive", impact_on_connection_score: 5, score: 9 },
  { id: 6, name: "开心", emoji_icon: "😄", category: "positive", impact_on_connection_score: 3, score: 8 },
  { id: 7, name: "惊喜", emoji_icon: "😮", category: "positive", impact_on_connection_score: 4, score: 9 }
];

// ==================== 模拟 API 方法 ====================

/**
 * 模拟 API 服务类
 */
class MockApiService {
  
  /**
   * 设置当前用户场景（用于测试不同状态）
   * @param {string} scenario - 场景类型
   */
  setUserScenario(scenario) {
    currentUserScenario = scenario;
  }

  /**
   * GET /api/me - 获取当前会话信息
   */
  async getMe() {
    await mockDelay();

    switch (currentUserScenario) {
      case 'ADMIN':
        return createResponse(API_CODES.SUCCESS, "Session info for an admin retrieved successfully.", {
          access_status: "ADMIN",
          currentUser: mockUsers.admin,
          partner: {
            id: "a1b2c3d4-0002-4002-8002-fedcba987654",
            nickname: "小月",
            avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
            display_gender: "female",
            bio: "爱画画，爱旅行，也爱身边的管理员先生。"
          },
          coupleInfo: {
            id: "c1p2l3e4-0001-4001-8001-abcdef123456",
            anniversary_date: "2020-01-01",
            trial_ends_at: null,
            subscription_expires_at: null
          }
        });

      case 'TRIAL':
        return createResponse(API_CODES.SUCCESS, "Session info for a user in trial period retrieved successfully.", {
          access_status: "TRIAL",
          currentUser: mockUsers.trial,
          partner: {
            id: "c3d4e5f6-0006-4006-8006-fedcbafedcba",
            nickname: "试用用户B",
            avatar_url: "https://randomuser.me/api/portraits/women/50.jpg",
            display_gender: "female",
            bio: "试用期感觉不错哦。"
          },
          coupleInfo: {
            id: "c1p2l3e4-0003-4003-8003-789789789789",
            anniversary_date: "2023-10-15",
            trial_ends_at: "2023-11-15T18:30:00Z",
            subscription_expires_at: null
          }
        });

      case 'UNBOUND':
        return createResponse(API_CODES.SUCCESS, "User is not bound to a couple.", {
          access_status: "UNBOUND",
          currentUser: {
            id: "e5f6g7h8-0009-4009-8009-1a2b3c4d5e6f",
            openid: "openid-for-single-user-09",
            nickname: "单身贵族C",
            avatar_url: "https://randomuser.me/api/portraits/lego/1.jpg",
            display_gender: "male",
            bio: "寻找我的另一半。",
            status: "active",
            is_admin: false,
            preferences: {
              notifications: {
                new_event_push: true,
                event_resolved_push: true,
                new_message_push: true
              },
              theme: "system"
            },
            last_login_at: "2023-10-27T14:20:00Z",
            created_at: "2023-09-01T20:00:00Z"
          },
          partner: null,
          coupleInfo: null
        });

      default:
        return createResponse(API_CODES.SUCCESS, "Session info retrieved successfully.", {
          access_status: "TRIAL",
          currentUser: mockUsers.trial,
          partner: null,
          coupleInfo: null
        });
    }
  }

  /**
   * GET /api/events - 获取事件列表
   * @param {Object} params - 查询参数
   */
  async getEvents(params = {}) {
    await mockDelay();
    
    const { status } = params;
    let filteredEvents = mockEvents;

    if (status) {
      filteredEvents = mockEvents.filter(event => event.status === status);
    }

    return createResponse(
      API_CODES.SUCCESS,
      `${status || 'All'} events retrieved successfully.`,
      filteredEvents
    );
  }

  /**
   * GET /api/mood-tags - 获取心情标签
   */
  async getMoodTags() {
    await mockDelay();
    return createResponse(
      API_CODES.SUCCESS,
      "Mood tags retrieved successfully.",
      mockMoodTags
    );
  }

  /**
   * POST /api/events - 创建新事件
   * @param {Object} data - 事件数据
   */
  async createEvent(data) {
    await mockDelay();
    
    const newEvent = {
      id: `evt-uuid-${Date.now()}`,
      couple_id: "c1p2l3e4-0003-4003-8003-789789789789",
      ...data,
      status: "unresolved",
      solution: null,
      images: data.images || [],
      author: {
        id: mockUsers.trial.id,
        nickname: mockUsers.trial.nickname,
        display_gender: mockUsers.trial.display_gender
      },
      mood_tag: mockMoodTags.find(tag => tag.id === data.mood_tag_id) || mockMoodTags[0],
      reactions: [],
      resolved_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 添加到模拟数据中
    mockEvents.unshift(newEvent);

    return createResponse(
      API_CODES.CREATED,
      "Event created successfully.",
      newEvent
    );
  }

  /**
   * PUT /api/events/{eventId} - 更新事件
   * @param {string} eventId - 事件ID
   * @param {Object} data - 更新数据
   */
  async updateEvent(eventId, data) {
    await mockDelay();
    
    const eventIndex = mockEvents.findIndex(event => event.id === eventId);
    if (eventIndex === -1) {
      return createResponse(API_CODES.NOT_FOUND, "Event not found.", null);
    }

    const updatedEvent = {
      ...mockEvents[eventIndex],
      ...data,
      updated_at: new Date().toISOString()
    };

    if (data.status === 'resolved') {
      updatedEvent.resolved_at = new Date().toISOString();
    }

    mockEvents[eventIndex] = updatedEvent;

    return createResponse(
      API_CODES.SUCCESS,
      "Event updated successfully.",
      updatedEvent
    );
  }
}

// 创建模拟 API 服务实例
const mockApiService = new MockApiService();

export default mockApiService;
