// 恋心物语 - 登录认证页面
// 处理微信授权登录和用户认证流程

import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { userStore } from '../../store/userStore';
import { PAGES } from '../../utils/constants';

Page({
  data: {
    // 页面状态
    isLoading: false,
    canLogin: true,
    
    // UI 状态
    showPrivacyModal: false,
    agreedToPrivacy: false,
  },

  onLoad(options) {
    console.log('登录页面加载', options);
    
    // 绑定 MobX store
    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: {
        userLoading: 'isLoading',
        isLoggedIn: 'isLoggedIn',
        isCoupleBound: 'isCoupleBound',
        accessStatus: 'accessStatus',
        error: 'error'
      },
      actions: {
        login: 'login',
        clearError: 'clearError'
      }
    });

    // 检查是否已经登录
    this.checkLoginStatus();
  },

  onShow() {
    // 每次显示页面时检查登录状态
    this.checkLoginStatus();
  },

  onUnload() {
    // 销毁 store 绑定
    if (this.storeBindings) {
      this.storeBindings.destroyStoreBindings();
    }
  },

  /**
   * 检查登录状态，如果已登录则跳转
   */
  checkLoginStatus() {
    if (this.data.isLoggedIn) {
      this.redirectAfterLogin();
    }
  },

  /**
   * 登录后重定向
   */
  redirectAfterLogin() {
    if (this.data.isCoupleBound) {
      // 已绑定情侣，跳转到主页
      wx.reLaunch({
        url: PAGES.INDEX
      });
    } else {
      // 未绑定情侣，跳转到绑定页面
      wx.reLaunch({
        url: PAGES.COUPLE
      });
    }
  },

  /**
   * 处理微信登录
   */
  async handleWxLogin() {
    if (this.data.userLoading || !this.data.canLogin) {
      return;
    }

    // 检查是否同意隐私政策
    if (!this.data.agreedToPrivacy) {
      this.setData({
        showPrivacyModal: true
      });
      return;
    }

    try {
      this.setData({ isLoading: true });
      
      // 清除之前的错误
      this.clearError();
      
      // 执行登录
      const success = await this.login();
      
      if (success) {
        // 登录成功，跳转到相应页面
        this.redirectAfterLogin();
      }
      
    } catch (error) {
      console.error('登录失败:', error);
      wx.showToast({
        title: error.message || '登录失败',
        icon: 'error'
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  /**
   * 处理获取用户信息（头像、昵称等）
   */
  handleGetUserProfile(e) {
    const { userInfo } = e.detail;
    
    if (userInfo) {
      // 可以在这里处理用户信息
      console.log('获取到用户信息:', userInfo);
      
      // 继续登录流程
      this.handleWxLogin();
    } else {
      wx.showToast({
        title: '需要授权才能使用',
        icon: 'none'
      });
    }
  },

  /**
   * 同意隐私政策
   */
  agreeToPrivacy() {
    this.setData({
      agreedToPrivacy: true,
      showPrivacyModal: false
    });
    
    // 继续登录流程
    this.handleWxLogin();
  },

  /**
   * 拒绝隐私政策
   */
  rejectPrivacy() {
    this.setData({
      showPrivacyModal: false
    });
    
    wx.showToast({
      title: '需要同意隐私政策才能使用',
      icon: 'none'
    });
  },

  /**
   * 查看隐私政策
   */
  viewPrivacyPolicy() {
    wx.showModal({
      title: '隐私政策',
      content: '我们承诺保护您的隐私安全，仅收集必要的用户信息用于提供服务。详细内容请查看完整隐私政策。',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  /**
   * 查看用户协议
   */
  viewUserAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '使用本小程序即表示您同意遵守相关用户协议。请合理使用本应用，共同维护良好的使用环境。',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  /**
   * 联系客服
   */
  contactService() {
    wx.showModal({
      title: '联系客服',
      content: '如有问题，请通过以下方式联系我们：\n邮箱：support@lianxinwuyu.com\n微信：lianxinwuyu',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  /**
   * 重试登录
   */
  retryLogin() {
    this.clearError();
    this.handleWxLogin();
  }
});
