// 恋心物语 - 小程序入口文件
// 集成 MobX 状态管理，初始化全局状态

import { userStore } from './store/userStore';
import { eventStore } from './store/eventStore';

App({
  onLaunch() {
    console.log("恋心物语小程序启动");

    // 将 store 挂载到 App 实例上，方便全局访问
    this.store = {
      userStore,
      eventStore,
    };

    // 初始化用户状态
    this.initializeApp();
  },

  onShow() {
    // 小程序从后台进入前台时
    console.log("小程序进入前台");

    // 如果用户已登录，刷新会话信息
    if (this.store.userStore.isLoggedIn) {
      this.store.userStore.fetchUserSession().catch(error => {
        console.error('刷新用户会话失败:', error);
      });
    }
  },

  onHide() {
    // 小程序从前台进入后台时
    console.log("小程序进入后台");
  },

  onError(error) {
    // 小程序发生脚本错误或 API 调用报错时触发
    console.error("小程序发生错误:", error);

    // 可以在这里上报错误到监控系统
    // this.reportError(error);
  },

  /**
   * 初始化应用
   */
  async initializeApp() {
    try {
      // 初始化用户状态（检查本地登录状态）
      await this.store.userStore.initialize();

      // 如果用户已登录且已绑定情侣，预加载一些基础数据
      if (this.store.userStore.isLoggedIn && this.store.userStore.isCoupleBound) {
        // 预加载心情标签
        this.store.eventStore.fetchMoodTags().catch(error => {
          console.error('预加载心情标签失败:', error);
        });

        // 预加载通知
        this.store.userStore.fetchNotifications().catch(error => {
          console.error('预加载通知失败:', error);
        });
      }

    } catch (error) {
      console.error('应用初始化失败:', error);
    }
  },

  /**
   * 获取全局 Store（供页面使用）
   */
  getStore() {
    return this.store;
  },

  globalData: {
    // 保留一些全局数据，但主要状态管理交给 MobX
    version: '1.0.0',
    systemInfo: null,
  },

  /**
   * 获取系统信息
   */
  getSystemInfo() {
    if (!this.globalData.systemInfo) {
      try {
        this.globalData.systemInfo = wx.getSystemInfoSync();
      } catch (error) {
        console.error('获取系统信息失败:', error);
      }
    }
    return this.globalData.systemInfo;
  }
});