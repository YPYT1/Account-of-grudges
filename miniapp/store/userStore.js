// 恋心物语 - 用户状态管理
// 使用 MobX 管理用户认证、情侣关系、订阅状态等全局状态

import { observable, action, computed } from 'mobx-miniprogram';
import userService from '../services/userService';
import { STORAGE_KEYS, ACCESS_STATUS } from '../utils/constants';
import { setStorage, getStorage, removeStorage, showSuccess, showError } from '../utils/util';

/**
 * 用户状态管理 Store
 */
export const userStore = observable({
  
  // ==================== 状态数据 ====================
  
  // 基础状态
  isLoading: false,
  isInitialized: false,
  error: null,

  // 用户信息
  currentUser: null,
  partner: null,
  coupleInfo: null,
  accessStatus: ACCESS_STATUS.UNBOUND,

  // 认证状态
  accessToken: null,
  isLoggedIn: false,

  // 通知相关
  notifications: [],
  unreadNotificationCount: 0,

  // ==================== 计算属性 ====================

  /**
   * 是否已绑定情侣
   */
  get isCoupleBound() {
    return this.accessStatus !== ACCESS_STATUS.UNBOUND;
  },

  /**
   * 是否可以访问完整功能
   */
  get canAccessFullFeatures() {
    return [
      ACCESS_STATUS.ADMIN,
      ACCESS_STATUS.FULL_ACCESS,
      ACCESS_STATUS.TRIAL
    ].includes(this.accessStatus);
  },

  /**
   * 是否为管理员
   */
  get isAdmin() {
    return this.accessStatus === ACCESS_STATUS.ADMIN;
  },

  /**
   * 是否在试用期
   */
  get isInTrial() {
    return this.accessStatus === ACCESS_STATUS.TRIAL;
  },

  /**
   * 是否已过期需要续费
   */
  get isExpired() {
    return this.accessStatus === ACCESS_STATUS.EXPIRED;
  },

  /**
   * 试用期剩余天数
   */
  get trialDaysLeft() {
    if (!this.coupleInfo?.trial_ends_at) return 0;
    
    const trialEndDate = new Date(this.coupleInfo.trial_ends_at);
    const now = new Date();
    const diffTime = trialEndDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  },

  /**
   * 订阅到期时间描述
   */
  get subscriptionStatus() {
    if (this.isAdmin) return '管理员账户';
    if (!this.coupleInfo) return '未绑定';
    
    if (this.coupleInfo.subscription_expires_at) {
      const expireDate = new Date(this.coupleInfo.subscription_expires_at);
      const now = new Date();
      
      if (expireDate > now) {
        return `会员有效期至 ${expireDate.toLocaleDateString()}`;
      } else {
        return '会员已过期';
      }
    }
    
    if (this.coupleInfo.trial_ends_at) {
      const trialEndDate = new Date(this.coupleInfo.trial_ends_at);
      const now = new Date();
      
      if (trialEndDate > now) {
        return `试用期剩余 ${this.trialDaysLeft} 天`;
      } else {
        return '试用期已结束';
      }
    }
    
    return '未激活';
  },

  // ==================== Actions ====================

  /**
   * 初始化用户状态
   * 应用启动时调用，检查本地存储的认证信息
   */
  initialize: action(async function() {
    this.isLoading = true;
    this.error = null;

    try {
      // 检查本地存储的 Token
      const token = getStorage(STORAGE_KEYS.ACCESS_TOKEN);
      
      if (token) {
        this.accessToken = token;
        this.isLoggedIn = true;
        
        // 尝试获取用户会话信息
        await this.fetchUserSession();
      }
    } catch (error) {
      console.error('用户状态初始化失败:', error);
      this.error = error.message;
      // 如果获取会话失败，清除本地认证信息
      this.logout();
    } finally {
      this.isLoading = false;
      this.isInitialized = true;
    }
  }),

  /**
   * 获取用户会话信息
   */
  fetchUserSession: action(async function() {
    this.isLoading = true;
    this.error = null;

    try {
      const sessionData = await userService.getMe();
      
      this.accessStatus = sessionData.access_status;
      this.currentUser = sessionData.currentUser;
      this.partner = sessionData.partner;
      this.coupleInfo = sessionData.coupleInfo;

      // 缓存用户信息到本地存储
      setStorage(STORAGE_KEYS.USER_INFO, this.currentUser);
      setStorage(STORAGE_KEYS.COUPLE_INFO, this.coupleInfo);

    } catch (error) {
      console.error('获取用户会话失败:', error);
      this.error = error.message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 微信登录
   */
  login: action(async function() {
    this.isLoading = true;
    this.error = null;

    try {
      // 获取微信登录凭证
      const loginResult = await new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        });
      });

      if (!loginResult.code) {
        throw new Error('获取微信登录凭证失败');
      }

      // 调用后端登录接口
      const loginData = await userService.login(loginResult.code);
      
      // 保存认证信息
      this.accessToken = loginData.access_token;
      this.isLoggedIn = true;
      setStorage(STORAGE_KEYS.ACCESS_TOKEN, loginData.access_token);

      // 获取用户会话信息
      await this.fetchUserSession();

      showSuccess('登录成功');
      return true;

    } catch (error) {
      console.error('登录失败:', error);
      this.error = error.message;
      showError(error.message || '登录失败');
      return false;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 退出登录
   */
  logout: action(function() {
    // 清除状态
    this.accessToken = null;
    this.isLoggedIn = false;
    this.currentUser = null;
    this.partner = null;
    this.coupleInfo = null;
    this.accessStatus = ACCESS_STATUS.UNBOUND;
    this.notifications = [];
    this.unreadNotificationCount = 0;

    // 清除本地存储
    removeStorage(STORAGE_KEYS.ACCESS_TOKEN);
    removeStorage(STORAGE_KEYS.USER_INFO);
    removeStorage(STORAGE_KEYS.COUPLE_INFO);

    showSuccess('已退出登录');
  }),

  /**
   * 创建情侣绑定邀请
   */
  createInvitation: action(async function() {
    this.isLoading = true;
    this.error = null;

    try {
      const invitationData = await userService.createInvitation();
      showSuccess('邀请码生成成功');
      return invitationData;
    } catch (error) {
      console.error('创建邀请失败:', error);
      this.error = error.message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 接受情侣绑定邀请
   */
  acceptInvitation: action(async function(inviteCode) {
    this.isLoading = true;
    this.error = null;

    try {
      const sessionData = await userService.acceptInvitation(inviteCode);
      
      // 更新状态
      this.accessStatus = sessionData.access_status;
      this.currentUser = sessionData.currentUser;
      this.partner = sessionData.partner;
      this.coupleInfo = sessionData.coupleInfo;

      // 更新本地存储
      setStorage(STORAGE_KEYS.USER_INFO, this.currentUser);
      setStorage(STORAGE_KEYS.COUPLE_INFO, this.coupleInfo);

      showSuccess('绑定成功！');
      return true;
    } catch (error) {
      console.error('接受邀请失败:', error);
      this.error = error.message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 解绑情侣关系
   */
  unbindCouple: action(async function() {
    this.isLoading = true;
    this.error = null;

    try {
      const sessionData = await userService.unbindCouple();
      
      // 更新状态
      this.accessStatus = sessionData.access_status;
      this.partner = sessionData.partner;
      this.coupleInfo = sessionData.coupleInfo;

      // 更新本地存储
      removeStorage(STORAGE_KEYS.COUPLE_INFO);

      showSuccess('解绑成功');
      return true;
    } catch (error) {
      console.error('解绑失败:', error);
      this.error = error.message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 更新用户个人资料
   */
  updateProfile: action(async function(profileData) {
    this.isLoading = true;
    this.error = null;

    try {
      const result = await userService.updateProfile(profileData);
      
      // 更新当前用户信息
      this.currentUser = { ...this.currentUser, ...result.currentUser };
      
      // 更新本地存储
      setStorage(STORAGE_KEYS.USER_INFO, this.currentUser);

      showSuccess('资料更新成功');
      return true;
    } catch (error) {
      console.error('更新资料失败:', error);
      this.error = error.message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 获取通知列表
   */
  fetchNotifications: action(async function() {
    try {
      const notificationData = await userService.getNotifications();
      this.notifications = notificationData.notifications;
      this.unreadNotificationCount = notificationData.unread_count;
    } catch (error) {
      console.error('获取通知失败:', error);
    }
  }),

  /**
   * 标记通知为已读
   */
  markNotificationAsRead: action(async function(notificationId) {
    try {
      await userService.markNotificationAsRead(notificationId);
      
      // 更新本地状态
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification && !notification.is_read) {
        notification.is_read = true;
        this.unreadNotificationCount = Math.max(0, this.unreadNotificationCount - 1);
      }
    } catch (error) {
      console.error('标记通知已读失败:', error);
    }
  }),

  /**
   * 清除错误状态
   */
  clearError: action(function() {
    this.error = null;
  })
});
