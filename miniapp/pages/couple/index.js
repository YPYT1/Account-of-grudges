// 恋心物语 - 情侣绑定页面
// 处理情侣关系的创建和绑定

import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { userStore } from '../../store/userStore';
import { PAGES } from '../../utils/constants';
import { validateInviteCode } from '../../utils/util';

Page({
  data: {
    // 页面状态
    currentTab: 'create', // 'create' | 'join'
    
    // 创建邀请相关
    inviteCode: '',
    inviteExpireTime: '',
    
    // 加入邀请相关
    inputInviteCode: '',
    
    // UI 状态
    isLoading: false,
  },

  onLoad(options) {
    console.log('情侣绑定页面加载', options);
    
    // 绑定 MobX store
    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: {
        userLoading: 'isLoading',
        isLoggedIn: 'isLoggedIn',
        isCoupleBound: 'isCoupleBound',
        currentUser: 'currentUser',
        error: 'error'
      },
      actions: {
        createInvitation: 'createInvitation',
        acceptInvitation: 'acceptInvitation',
        clearError: 'clearError'
      }
    });

    // 检查登录状态
    this.checkAuthStatus();
  },

  onShow() {
    // 每次显示页面时检查状态
    this.checkAuthStatus();
  },

  onUnload() {
    // 销毁 store 绑定
    if (this.storeBindings) {
      this.storeBindings.destroyStoreBindings();
    }
  },

  /**
   * 检查认证状态
   */
  checkAuthStatus() {
    if (!this.data.isLoggedIn) {
      // 未登录，跳转到登录页
      wx.reLaunch({
        url: PAGES.AUTH
      });
      return;
    }

    if (this.data.isCoupleBound) {
      // 已绑定情侣，跳转到主页
      wx.reLaunch({
        url: PAGES.INDEX
      });
      return;
    }
  },

  /**
   * 切换标签页
   */
  switchTab(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({
      currentTab: tab,
      inputInviteCode: '',
      inviteCode: '',
      inviteExpireTime: ''
    });
    this.clearError();
  },

  /**
   * 创建邀请码
   */
  async handleCreateInvitation() {
    if (this.data.userLoading || this.data.isLoading) {
      return;
    }

    try {
      this.setData({ isLoading: true });
      this.clearError();

      const invitationData = await this.createInvitation();
      
      this.setData({
        inviteCode: invitationData.invite_code,
        inviteExpireTime: this.formatExpireTime(invitationData.expires_at)
      });

    } catch (error) {
      console.error('创建邀请码失败:', error);
      wx.showToast({
        title: error.message || '创建失败',
        icon: 'error'
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  /**
   * 输入邀请码
   */
  onInviteCodeInput(e) {
    const code = e.detail.value.toUpperCase();
    this.setData({
      inputInviteCode: code
    });
  },

  /**
   * 加入情侣关系
   */
  async handleJoinCouple() {
    const { inputInviteCode } = this.data;

    if (!inputInviteCode) {
      wx.showToast({
        title: '请输入邀请码',
        icon: 'none'
      });
      return;
    }

    if (!validateInviteCode(inputInviteCode)) {
      wx.showToast({
        title: '邀请码格式不正确',
        icon: 'none'
      });
      return;
    }

    if (this.data.userLoading || this.data.isLoading) {
      return;
    }

    try {
      this.setData({ isLoading: true });
      this.clearError();

      const success = await this.acceptInvitation(inputInviteCode);
      
      if (success) {
        // 绑定成功，跳转到主页
        wx.reLaunch({
          url: PAGES.INDEX
        });
      }

    } catch (error) {
      console.error('加入情侣关系失败:', error);
      wx.showToast({
        title: error.message || '绑定失败',
        icon: 'error'
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  /**
   * 复制邀请码
   */
  copyInviteCode() {
    const { inviteCode } = this.data;
    
    if (!inviteCode) {
      wx.showToast({
        title: '请先生成邀请码',
        icon: 'none'
      });
      return;
    }

    wx.setClipboardData({
      data: inviteCode,
      success: () => {
        wx.showToast({
          title: '邀请码已复制',
          icon: 'success'
        });
      },
      fail: () => {
        wx.showToast({
          title: '复制失败',
          icon: 'error'
        });
      }
    });
  },

  /**
   * 分享邀请码
   */
  shareInviteCode() {
    const { inviteCode, inviteExpireTime } = this.data;
    
    if (!inviteCode) {
      wx.showToast({
        title: '请先生成邀请码',
        icon: 'none'
      });
      return;
    }

    const shareText = `我在恋心物语等你！邀请码：${inviteCode}，有效期至：${inviteExpireTime}`;
    
    wx.setClipboardData({
      data: shareText,
      success: () => {
        wx.showToast({
          title: '分享内容已复制',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 格式化过期时间
   */
  formatExpireTime(expireTime) {
    const date = new Date(expireTime);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${month}-${day} ${hours}:${minutes}`;
  },

  /**
   * 跳转到登录页
   */
  goToLogin() {
    wx.reLaunch({
      url: PAGES.AUTH
    });
  },

  /**
   * 查看帮助
   */
  showHelp() {
    wx.showModal({
      title: '绑定帮助',
      content: '1. 创建邀请：生成邀请码分享给对方\n2. 加入情侣：输入对方的邀请码\n3. 邀请码24小时内有效\n4. 绑定后即可开始使用所有功能',
      showCancel: false,
      confirmText: '我知道了'
    });
  }
});
