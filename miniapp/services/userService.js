// 恋心物语 - 用户相关 API 服务
// 提供用户认证、情侣关系、订阅等相关的 API 调用方法

import api from './api';
import mockApiService from './mockApi';

// 是否使用模拟数据（开发阶段设为 true，生产环境设为 false）
const USE_MOCK_DATA = true;

/**
 * 用户服务类
 * 封装所有用户相关的 API 调用
 */
class UserService {

  /**
   * 获取当前用户会话信息
   * 应用启动时必须调用的第一个接口
   * @returns {Promise<Object>} 用户会话信息
   */
  async getMe() {
    if (USE_MOCK_DATA) {
      const response = await mockApiService.getMe();
      return response.data;
    }
    
    return api.get('/me', {}, { 
      showLoading: true, 
      loadingText: '加载用户信息...' 
    });
  }

  /**
   * 微信登录
   * @param {string} code - 微信登录凭证
   * @returns {Promise<Object>} 登录结果，包含 access_token
   */
  async login(code) {
    if (USE_MOCK_DATA) {
      // 模拟登录成功
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        access_token: 'mock_token_' + Date.now(),
        expires_in: 7200
      };
    }

    return api.post('/auth/login', { code }, {
      showLoading: true,
      loadingText: '登录中...'
    });
  }

  /**
   * 退出登录
   * @returns {Promise<void>}
   */
  async logout() {
    if (USE_MOCK_DATA) {
      // 模拟退出登录
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    return api.post('/auth/logout', {}, {
      showLoading: true,
      loadingText: '退出中...'
    });
  }

  /**
   * 创建情侣绑定邀请
   * @returns {Promise<Object>} 邀请码信息
   */
  async createInvitation() {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        invite_code: 'A8C3F9',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
    }

    return api.post('/couples/invitations', {}, {
      showLoading: true,
      loadingText: '生成邀请码...'
    });
  }

  /**
   * 接受情侣绑定邀请
   * @param {string} inviteCode - 邀请码
   * @returns {Promise<Object>} 绑定结果
   */
  async acceptInvitation(inviteCode) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 模拟绑定成功，切换到试用状态
      mockApiService.setUserScenario('TRIAL');
      const response = await mockApiService.getMe();
      return response.data;
    }

    return api.post('/couples/accept-invitation', { 
      invite_code: inviteCode 
    }, {
      showLoading: true,
      loadingText: '绑定中...'
    });
  }

  /**
   * 解绑情侣关系
   * @returns {Promise<Object>} 解绑结果
   */
  async unbindCouple() {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 模拟解绑成功，切换到未绑定状态
      mockApiService.setUserScenario('UNBOUND');
      const response = await mockApiService.getMe();
      return response.data;
    }

    return api.post('/couples/unbind', {}, {
      showLoading: true,
      loadingText: '解绑中...'
    });
  }

  /**
   * 更新用户个人资料
   * @param {Object} profileData - 个人资料数据
   * @returns {Promise<Object>} 更新后的用户信息
   */
  async updateProfile(profileData) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        currentUser: {
          ...mockApiService.mockUsers?.trial || {},
          ...profileData,
          updated_at: new Date().toISOString()
        }
      };
    }

    return api.put('/me', profileData, {
      showLoading: true,
      loadingText: '保存中...'
    });
  }

  /**
   * 获取订阅套餐列表
   * @returns {Promise<Array>} 套餐列表
   */
  async getSubscriptionPlans() {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return [
        {
          id: "plan_monthly_25",
          name: "月度会员",
          description: "按月订阅，灵活方便，随时取消",
          price: "25.00",
          currency: "CNY",
          duration_months: 1,
          tags: []
        },
        {
          id: "plan_yearly_249",
          name: "年度会员",
          description: "原价¥300，立省¥51，畅享全年甜蜜",
          price: "249.00",
          currency: "CNY",
          duration_months: 12,
          tags: ["最佳性价比", "立省17%"]
        }
      ];
    }

    return api.get('/subscriptions/plans', {}, {
      showLoading: true,
      loadingText: '加载套餐信息...'
    });
  }

  /**
   * 创建订阅订单
   * @param {string} planId - 套餐ID
   * @param {string} promoCode - 优惠码（可选）
   * @returns {Promise<Object>} 订单信息
   */
  async createSubscription(planId, promoCode = '') {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        order_id: `ord-uuid-${Date.now()}`,
        plan_name: "年度会员",
        original_amount: "249.00",
        discount_amount: promoCode ? "25.00" : "0.00",
        final_amount: promoCode ? "224.00" : "249.00",
        payment_gateway_payload: {
          appId: "wx123456789abcde",
          timeStamp: Math.floor(Date.now() / 1000).toString(),
          nonceStr: "mock_nonce_" + Date.now(),
          package: "prepay_id=mock_prepay_id_" + Date.now(),
          signType: "MD5",
          paySign: "MOCK_SIGNATURE_" + Date.now()
        }
      };
    }

    const requestData = { plan_id: planId };
    if (promoCode) {
      requestData.promo_code = promoCode;
    }

    return api.post('/subscriptions', requestData, {
      showLoading: true,
      loadingText: '创建订单...'
    });
  }

  /**
   * 获取通知列表
   * @returns {Promise<Object>} 通知列表和未读数量
   */
  async getNotifications() {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        unread_count: 1,
        notifications: [
          {
            id: "noti-uuid-001-expiring",
            type: "subscription_expiring_soon",
            content: "您的会员资格将于 2023年11月15日 到期，为避免影响使用，请及时续费。",
            is_read: false,
            related_resource_type: null,
            related_resource_id: null,
            created_at: "2023-11-08T10:00:00Z"
          },
          {
            id: "noti-uuid-002-new-event",
            type: "new_event_from_partner",
            content: "您的伴侣"小月"刚刚记录了一件新的甜蜜时刻，快去看看吧！",
            is_read: true,
            related_resource_type: "event",
            related_resource_id: "evt-uuid-002",
            created_at: "2023-10-25T23:05:00Z"
          }
        ]
      };
    }

    return api.get('/notifications');
  }

  /**
   * 标记通知为已读
   * @param {string} notificationId - 通知ID
   * @returns {Promise<void>}
   */
  async markNotificationAsRead(notificationId) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }

    return api.put(`/notifications/${notificationId}/read`);
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

  /**
   * 设置模拟用户场景（仅开发环境使用）
   * @param {string} scenario - 用户场景
   */
  setMockUserScenario(scenario) {
    if (USE_MOCK_DATA) {
      mockApiService.setUserScenario(scenario);
    }
  }
}

// 创建用户服务实例
const userService = new UserService();

export default userService;
