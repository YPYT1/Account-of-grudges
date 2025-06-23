// 恋心物语 - 事件相关 API 服务
// 提供事件（帖子）的增删改查、心情标签、甜蜜留言等相关的 API 调用方法

import api from './api';
import mockApiService from './mockApi';

// 是否使用模拟数据（开发阶段设为 true，生产环境设为 false）
const USE_MOCK_DATA = true;

/**
 * 事件服务类
 * 封装所有事件相关的 API 调用
 */
class EventService {

  /**
   * 获取事件列表
   * @param {string} status - 事件状态：'unresolved' | 'resolved'
   * @param {number} page - 页码（用于分页）
   * @param {number} pageSize - 每页数量
   * @returns {Promise<Array>} 事件列表
   */
  async getEvents(status = 'unresolved', page = 1, pageSize = 20) {
    if (USE_MOCK_DATA) {
      const response = await mockApiService.getEvents({ status });
      return response.data;
    }

    return api.get('/events', { 
      status, 
      page, 
      page_size: pageSize 
    }, {
      showLoading: page === 1, // 只在第一页时显示加载
      loadingText: '加载事件列表...'
    });
  }

  /**
   * 获取单个事件详情
   * @param {string} eventId - 事件ID
   * @returns {Promise<Object>} 事件详情
   */
  async getEventDetail(eventId) {
    if (USE_MOCK_DATA) {
      // 模拟获取事件详情
      const response = await mockApiService.getEvents();
      const event = response.data.find(e => e.id === eventId);
      if (!event) {
        throw new Error('事件不存在');
      }
      return event;
    }

    return api.get(`/events/${eventId}`, {}, {
      showLoading: true,
      loadingText: '加载事件详情...'
    });
  }

  /**
   * 创建新事件
   * @param {Object} eventData - 事件数据
   * @returns {Promise<Object>} 创建的事件
   */
  async createEvent(eventData) {
    if (USE_MOCK_DATA) {
      const response = await mockApiService.createEvent(eventData);
      return response.data;
    }

    return api.post('/events', eventData, {
      showLoading: true,
      loadingText: '发布中...'
    });
  }

  /**
   * 更新事件（主要用于解决事件）
   * @param {string} eventId - 事件ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} 更新后的事件
   */
  async updateEvent(eventId, updateData) {
    if (USE_MOCK_DATA) {
      const response = await mockApiService.updateEvent(eventId, updateData);
      return response.data;
    }

    return api.put(`/events/${eventId}`, updateData, {
      showLoading: true,
      loadingText: '保存中...'
    });
  }

  /**
   * 删除事件
   * @param {string} eventId - 事件ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteEvent(eventId) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { id: eventId };
    }

    return api.delete(`/events/${eventId}`, {
      showLoading: true,
      loadingText: '删除中...'
    });
  }

  /**
   * 获取心情标签列表
   * @returns {Promise<Array>} 心情标签列表
   */
  async getMoodTags() {
    if (USE_MOCK_DATA) {
      const response = await mockApiService.getMoodTags();
      return response.data;
    }

    return api.get('/mood-tags');
  }

  /**
   * 为事件添加反应（表情）
   * @param {string} eventId - 事件ID
   * @param {string} emoji - 表情符号
   * @returns {Promise<Object>} 添加结果
   */
  async addReaction(eventId, emoji) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }

    return api.post(`/events/${eventId}/reactions`, { emoji });
  }

  /**
   * 移除事件反应
   * @param {string} eventId - 事件ID
   * @param {string} reactionId - 反应ID
   * @returns {Promise<Object>} 移除结果
   */
  async removeReaction(eventId, reactionId) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }

    return api.delete(`/events/${eventId}/reactions/${reactionId}`);
  }

  /**
   * 获取甜蜜留言列表
   * @returns {Promise<Array>} 甜蜜留言列表
   */
  async getSweetMessages() {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return [
        {
          id: "msg-uuid-001-pinned",
          message: "亲爱的，今天是我们在一起的第520天，永远爱你哟！❤️",
          nickname: "你的小宝贝",
          is_pinned: true,
          created_at: "2023-10-20T09:00:00Z",
          author: { 
            id: "b2c3d4e5-0003-4003-8003-112233445566", 
            display_gender: "female" 
          }
        },
        {
          id: "msg-uuid-002",
          message: "收到！也爱你，我的超人！未来的每一天都请多指教。",
          nickname: "你的专属骑士",
          is_pinned: false,
          created_at: "2023-10-20T09:05:00Z",
          author: { 
            id: "b2c3d4e5-0004-4004-8004-aabbccddeeff", 
            display_gender: "male" 
          }
        }
      ];
    }

    return api.get('/sweet-messages', {}, {
      showLoading: true,
      loadingText: '加载甜蜜留言...'
    });
  }

  /**
   * 创建甜蜜留言
   * @param {Object} messageData - 留言数据
   * @returns {Promise<Object>} 创建的留言
   */
  async createSweetMessage(messageData) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        id: `msg-uuid-${Date.now()}`,
        ...messageData,
        is_pinned: false,
        created_at: new Date().toISOString(),
        author: {
          id: "c3d4e5f6-0005-4005-8005-abcdefabcdef",
          display_gender: "male"
        }
      };
    }

    return api.post('/sweet-messages', messageData, {
      showLoading: true,
      loadingText: '发布留言...'
    });
  }

  /**
   * 删除甜蜜留言
   * @param {string} messageId - 留言ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteSweetMessage(messageId) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: messageId };
    }

    return api.delete(`/sweet-messages/${messageId}`, {
      showLoading: true,
      loadingText: '删除中...'
    });
  }

  /**
   * 置顶/取消置顶甜蜜留言
   * @param {string} messageId - 留言ID
   * @param {boolean} isPinned - 是否置顶
   * @returns {Promise<Object>} 操作结果
   */
  async togglePinMessage(messageId, isPinned) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }

    return api.put(`/sweet-messages/${messageId}/pin`, { 
      is_pinned: isPinned 
    });
  }

  /**
   * 获取心情分析数据
   * @param {string} period - 分析周期：'weekly' | 'monthly'
   * @returns {Promise<Object>} 心情分析数据
   */
  async getMoodAnalytics(period = 'weekly') {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (period === 'weekly') {
        return {
          period_range: "2023-10-23 - 2023-10-29",
          trend: {
            labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            datasets: [
              { label: "试用用户A", gender: "male", data: [7, 8, 9, 8, 6, 10, 9] },
              { label: "试用用户B", gender: "female", data: [8, 8, 7, 6, 7, 9, 8] }
            ]
          },
          distribution: {
            labels: ["开心", "感动", "生气", "无语"],
            datasets: [{ 
              data: [4, 2, 1, 1], 
              backgroundColor: ["#FFDDC1", "#FFABAB", "#A7C7E7", "#C1E1C1"] 
            }]
          }
        };
      } else {
        return {
          period_range: "2023-10-01 - 2023-10-31",
          trend: {
            labels: ["10.01", "10.02", "10.03", "10.04", "10.05", "...", "10.31"],
            datasets: [
              { 
                label: "试用用户A", 
                gender: "male", 
                data: [8,9,8,7,7,9,10,8,7,6,8,9,9,10,8,7,8,9,6,7,8,9,10,9,8,7,6,9,10,8,8] 
              },
              { 
                label: "试用用户B", 
                gender: "female", 
                data: [7,8,8,9,9,10,8,7,8,9,9,10,8,7,6,7,8,9,8,9,10,8,7,8,9,8,9,10,8,7,7] 
              }
            ]
          },
          distribution: {
            labels: ["开心", "感动", "生气", "委屈", "无语", "平常", "惊喜"],
            datasets: [{ 
              data: [25, 18, 10, 5, 8, 12, 7], 
              backgroundColor: ["#FFDDC1", "#FFABAB", "#A7C7E7", "#B9F2D4", "#C1E1C1", "#FDFD96", "#FFDFD3"] 
            }]
          }
        };
      }
    }

    return api.get('/analytics/mood', { period }, {
      showLoading: true,
      loadingText: '分析心情数据...'
    });
  }

  /**
   * 上传图片
   * @param {string} filePath - 本地文件路径
   * @returns {Promise<string>} 上传后的图片URL
   */
  async uploadImage(filePath) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // 模拟返回一个图片URL
      return `https://mock-cdn.lianxinwuyu.com/images/${Date.now()}.jpg`;
    }

    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: api.baseURL + '/upload/image',
        filePath,
        name: 'image',
        header: {
          'Authorization': `Bearer ${wx.getStorageSync('access_token')}`
        },
        success(res) {
          try {
            const data = JSON.parse(res.data);
            if (data.code === 200) {
              resolve(data.data.url);
            } else {
              reject(new Error(data.message || '上传失败'));
            }
          } catch (error) {
            reject(new Error('上传响应解析失败'));
          }
        },
        fail(error) {
          reject(new Error('上传失败'));
        }
      });
    });
  }

  /**
   * 切换模拟数据模式（仅开发环境使用）
   * @param {boolean} useMock - 是否使用模拟数据
   */
  setMockMode(useMock) {
    if (process.env.NODE_ENV === 'development') {
      USE_MOCK_DATA = useMock;
    }
  }
}

// 创建事件服务实例
const eventService = new EventService();

export default eventService;
