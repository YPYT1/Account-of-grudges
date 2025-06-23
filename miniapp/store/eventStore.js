// 恋心物语 - 事件状态管理
// 使用 MobX 管理事件列表、心情标签、甜蜜留言等内容状态

import { observable, action, computed } from 'mobx-miniprogram';
import eventService from '../services/eventService';
import { EVENT_STATUS, PAGINATION } from '../utils/constants';
import { showSuccess, showError, groupBy } from '../utils/util';

/**
 * 事件状态管理 Store
 */
export const eventStore = observable({
  
  // ==================== 状态数据 ====================
  
  // 基础状态
  isLoading: false,
  error: null,

  // 事件列表
  unresolvedEvents: [],
  resolvedEvents: [],
  
  // 分页状态
  unresolvedPage: 1,
  resolvedPage: 1,
  hasMoreUnresolved: true,
  hasMoreResolved: true,

  // 心情标签
  moodTags: [],
  moodTagsLoaded: false,

  // 甜蜜留言
  sweetMessages: [],
  sweetMessagesLoaded: false,

  // 心情分析数据
  moodAnalytics: null,
  currentAnalyticsPeriod: 'weekly',

  // 当前选中的事件（用于详情页）
  currentEvent: null,

  // ==================== 计算属性 ====================

  /**
   * 按心情分类的未解决事件
   */
  get unresolvedEventsByMood() {
    return groupBy(this.unresolvedEvents, 'mood_tag.category');
  },

  /**
   * 按日期分组的已解决事件
   */
  get resolvedEventsByDate() {
    return groupBy(this.resolvedEvents, (event) => {
      return new Date(event.event_date).toLocaleDateString();
    });
  },

  /**
   * 正面心情标签
   */
  get positiveMoodTags() {
    return this.moodTags.filter(tag => tag.category === 'positive');
  },

  /**
   * 负面心情标签
   */
  get negativeMoodTags() {
    return this.moodTags.filter(tag => tag.category === 'negative');
  },

  /**
   * 中性心情标签
   */
  get neutralMoodTags() {
    return this.moodTags.filter(tag => tag.category === 'neutral');
  },

  /**
   * 置顶的甜蜜留言
   */
  get pinnedSweetMessages() {
    return this.sweetMessages.filter(msg => msg.is_pinned);
  },

  /**
   * 普通甜蜜留言
   */
  get normalSweetMessages() {
    return this.sweetMessages.filter(msg => !msg.is_pinned);
  },

  // ==================== Actions ====================

  /**
   * 获取未解决事件列表
   */
  fetchUnresolvedEvents: action(async function(refresh = false) {
    if (refresh) {
      this.unresolvedPage = 1;
      this.hasMoreUnresolved = true;
    }

    if (!this.hasMoreUnresolved && !refresh) return;

    this.isLoading = true;
    this.error = null;

    try {
      const events = await eventService.getEvents(
        EVENT_STATUS.UNRESOLVED,
        this.unresolvedPage,
        PAGINATION.PAGE_SIZE
      );

      if (refresh) {
        this.unresolvedEvents = events;
      } else {
        this.unresolvedEvents.push(...events);
      }

      // 检查是否还有更多数据
      this.hasMoreUnresolved = events.length === PAGINATION.PAGE_SIZE;
      if (this.hasMoreUnresolved) {
        this.unresolvedPage += 1;
      }

    } catch (error) {
      console.error('获取未解决事件失败:', error);
      this.error = error.message;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 获取已解决事件列表
   */
  fetchResolvedEvents: action(async function(refresh = false) {
    if (refresh) {
      this.resolvedPage = 1;
      this.hasMoreResolved = true;
    }

    if (!this.hasMoreResolved && !refresh) return;

    this.isLoading = true;
    this.error = null;

    try {
      const events = await eventService.getEvents(
        EVENT_STATUS.RESOLVED,
        this.resolvedPage,
        PAGINATION.PAGE_SIZE
      );

      if (refresh) {
        this.resolvedEvents = events;
      } else {
        this.resolvedEvents.push(...events);
      }

      // 检查是否还有更多数据
      this.hasMoreResolved = events.length === PAGINATION.PAGE_SIZE;
      if (this.hasMoreResolved) {
        this.resolvedPage += 1;
      }

    } catch (error) {
      console.error('获取已解决事件失败:', error);
      this.error = error.message;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 获取事件详情
   */
  fetchEventDetail: action(async function(eventId) {
    this.isLoading = true;
    this.error = null;

    try {
      const event = await eventService.getEventDetail(eventId);
      this.currentEvent = event;
      return event;
    } catch (error) {
      console.error('获取事件详情失败:', error);
      this.error = error.message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 创建新事件
   */
  createEvent: action(async function(eventData) {
    this.isLoading = true;
    this.error = null;

    try {
      const newEvent = await eventService.createEvent(eventData);
      
      // 将新事件添加到列表开头
      this.unresolvedEvents.unshift(newEvent);
      
      showSuccess('事件发布成功');
      return newEvent;
    } catch (error) {
      console.error('创建事件失败:', error);
      this.error = error.message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 更新事件（主要用于解决事件）
   */
  updateEvent: action(async function(eventId, updateData) {
    this.isLoading = true;
    this.error = null;

    try {
      const updatedEvent = await eventService.updateEvent(eventId, updateData);
      
      // 更新当前事件
      if (this.currentEvent && this.currentEvent.id === eventId) {
        this.currentEvent = updatedEvent;
      }

      // 如果事件被解决，从未解决列表移除，添加到已解决列表
      if (updatedEvent.status === EVENT_STATUS.RESOLVED) {
        this.unresolvedEvents = this.unresolvedEvents.filter(e => e.id !== eventId);
        this.resolvedEvents.unshift(updatedEvent);
        showSuccess('事件已标记为解决');
      } else {
        // 更新未解决列表中的事件
        const index = this.unresolvedEvents.findIndex(e => e.id === eventId);
        if (index !== -1) {
          this.unresolvedEvents[index] = updatedEvent;
        }
        showSuccess('事件更新成功');
      }

      return updatedEvent;
    } catch (error) {
      console.error('更新事件失败:', error);
      this.error = error.message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 删除事件
   */
  deleteEvent: action(async function(eventId) {
    this.isLoading = true;
    this.error = null;

    try {
      await eventService.deleteEvent(eventId);
      
      // 从列表中移除事件
      this.unresolvedEvents = this.unresolvedEvents.filter(e => e.id !== eventId);
      this.resolvedEvents = this.resolvedEvents.filter(e => e.id !== eventId);
      
      // 如果删除的是当前事件，清除当前事件
      if (this.currentEvent && this.currentEvent.id === eventId) {
        this.currentEvent = null;
      }

      showSuccess('事件删除成功');
    } catch (error) {
      console.error('删除事件失败:', error);
      this.error = error.message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 获取心情标签列表
   */
  fetchMoodTags: action(async function() {
    if (this.moodTagsLoaded) return;

    try {
      const moodTags = await eventService.getMoodTags();
      this.moodTags = moodTags;
      this.moodTagsLoaded = true;
    } catch (error) {
      console.error('获取心情标签失败:', error);
      this.error = error.message;
    }
  }),

  /**
   * 获取甜蜜留言列表
   */
  fetchSweetMessages: action(async function(refresh = false) {
    if (this.sweetMessagesLoaded && !refresh) return;

    this.isLoading = true;
    this.error = null;

    try {
      const messages = await eventService.getSweetMessages();
      this.sweetMessages = messages;
      this.sweetMessagesLoaded = true;
    } catch (error) {
      console.error('获取甜蜜留言失败:', error);
      this.error = error.message;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 创建甜蜜留言
   */
  createSweetMessage: action(async function(messageData) {
    this.isLoading = true;
    this.error = null;

    try {
      const newMessage = await eventService.createSweetMessage(messageData);
      
      // 将新留言添加到列表开头
      this.sweetMessages.unshift(newMessage);
      
      showSuccess('留言发布成功');
      return newMessage;
    } catch (error) {
      console.error('创建甜蜜留言失败:', error);
      this.error = error.message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 删除甜蜜留言
   */
  deleteSweetMessage: action(async function(messageId) {
    this.isLoading = true;
    this.error = null;

    try {
      await eventService.deleteSweetMessage(messageId);
      
      // 从列表中移除留言
      this.sweetMessages = this.sweetMessages.filter(m => m.id !== messageId);
      
      showSuccess('留言删除成功');
    } catch (error) {
      console.error('删除甜蜜留言失败:', error);
      this.error = error.message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 获取心情分析数据
   */
  fetchMoodAnalytics: action(async function(period = 'weekly') {
    this.isLoading = true;
    this.error = null;
    this.currentAnalyticsPeriod = period;

    try {
      const analytics = await eventService.getMoodAnalytics(period);
      this.moodAnalytics = analytics;
    } catch (error) {
      console.error('获取心情分析失败:', error);
      this.error = error.message;
    } finally {
      this.isLoading = false;
    }
  }),

  /**
   * 为事件添加反应
   */
  addReaction: action(async function(eventId, emoji) {
    try {
      await eventService.addReaction(eventId, emoji);
      
      // 更新本地事件的反应列表
      const updateEventReaction = (event) => {
        if (event.id === eventId) {
          event.reactions.push({
            author_id: 'current_user', // 这里应该是当前用户ID
            emoji: emoji
          });
        }
      };

      this.unresolvedEvents.forEach(updateEventReaction);
      this.resolvedEvents.forEach(updateEventReaction);
      
      if (this.currentEvent && this.currentEvent.id === eventId) {
        updateEventReaction(this.currentEvent);
      }

    } catch (error) {
      console.error('添加反应失败:', error);
      showError('添加反应失败');
    }
  }),

  /**
   * 清除当前事件
   */
  clearCurrentEvent: action(function() {
    this.currentEvent = null;
  }),

  /**
   * 清除错误状态
   */
  clearError: action(function() {
    this.error = null;
  }),

  /**
   * 重置所有状态
   */
  reset: action(function() {
    this.unresolvedEvents = [];
    this.resolvedEvents = [];
    this.unresolvedPage = 1;
    this.resolvedPage = 1;
    this.hasMoreUnresolved = true;
    this.hasMoreResolved = true;
    this.sweetMessages = [];
    this.sweetMessagesLoaded = false;
    this.moodAnalytics = null;
    this.currentEvent = null;
    this.error = null;
  })
});
