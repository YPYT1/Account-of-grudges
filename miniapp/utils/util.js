// 恋心物语 - 通用工具函数库

import { ERROR_MESSAGES } from './constants';

// ==================== 日期时间工具 ====================

/**
 * 格式化日期
 * @param {Date|string} date - 日期对象或日期字符串
 * @param {string} format - 格式化模板，支持 YYYY-MM-DD, YYYY/MM/DD, MM-DD, HH:mm 等
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 获取相对时间描述
 * @param {Date|string} date - 日期
 * @returns {string} 相对时间描述，如"刚刚"、"3分钟前"、"昨天"等
 */
export function getRelativeTime(date) {
  const now = new Date();
  const target = new Date(date);
  const diff = now.getTime() - target.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diff < minute) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)}小时前`;
  if (diff < week) return `${Math.floor(diff / day)}天前`;
  
  return formatDate(target, 'MM-DD');
}

/**
 * 计算两个日期之间的天数
 * @param {Date|string} startDate - 开始日期
 * @param {Date|string} endDate - 结束日期
 * @returns {number} 天数差
 */
export function getDaysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ==================== 字符串工具 ====================

/**
 * 截断文本并添加省略号
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截断后的文本
 */
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * 验证邀请码格式
 * @param {string} code - 邀请码
 * @returns {boolean} 是否有效
 */
export function validateInviteCode(code) {
  return /^[A-Z0-9]{6}$/.test(code);
}

/**
 * 生成随机字符串
 * @param {number} length - 长度
 * @returns {string} 随机字符串
 */
export function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ==================== 数据验证工具 ====================

/**
 * 验证必填字段
 * @param {any} value - 值
 * @returns {boolean} 是否有效
 */
export function isRequired(value) {
  return value !== null && value !== undefined && value !== '';
}

/**
 * 验证文本长度
 * @param {string} text - 文本
 * @param {number} minLength - 最小长度
 * @param {number} maxLength - 最大长度
 * @returns {boolean} 是否有效
 */
export function validateTextLength(text, minLength = 0, maxLength = Infinity) {
  if (!text) return minLength === 0;
  return text.length >= minLength && text.length <= maxLength;
}

// ==================== 数组工具 ====================

/**
 * 数组去重
 * @param {Array} array - 原数组
 * @param {string} key - 去重依据的键名（对象数组）
 * @returns {Array} 去重后的数组
 */
export function uniqueArray(array, key) {
  if (!Array.isArray(array)) return [];
  
  if (key) {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }
  
  return [...new Set(array)];
}

/**
 * 数组分组
 * @param {Array} array - 原数组
 * @param {string|Function} key - 分组依据
 * @returns {Object} 分组后的对象
 */
export function groupBy(array, key) {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
    return groups;
  }, {});
}

// ==================== 存储工具 ====================

/**
 * 安全的本地存储设置
 * @param {string} key - 键名
 * @param {any} value - 值
 */
export function setStorage(key, value) {
  try {
    wx.setStorageSync(key, value);
  } catch (error) {
    console.error('存储失败:', error);
  }
}

/**
 * 安全的本地存储获取
 * @param {string} key - 键名
 * @param {any} defaultValue - 默认值
 * @returns {any} 存储的值或默认值
 */
export function getStorage(key, defaultValue = null) {
  try {
    const value = wx.getStorageSync(key);
    return value !== '' ? value : defaultValue;
  } catch (error) {
    console.error('读取存储失败:', error);
    return defaultValue;
  }
}

/**
 * 安全的本地存储删除
 * @param {string} key - 键名
 */
export function removeStorage(key) {
  try {
    wx.removeStorageSync(key);
  } catch (error) {
    console.error('删除存储失败:', error);
  }
}

// ==================== UI 工具 ====================

/**
 * 显示成功提示
 * @param {string} title - 提示文本
 * @param {number} duration - 持续时间
 */
export function showSuccess(title, duration = 2000) {
  wx.showToast({
    title,
    icon: 'success',
    duration
  });
}

/**
 * 显示错误提示
 * @param {string} title - 提示文本
 * @param {number} duration - 持续时间
 */
export function showError(title, duration = 2000) {
  wx.showToast({
    title,
    icon: 'error',
    duration
  });
}

/**
 * 显示加载提示
 * @param {string} title - 提示文本
 */
export function showLoading(title = '加载中...') {
  wx.showLoading({ title });
}

/**
 * 隐藏加载提示
 */
export function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示确认对话框
 * @param {string} content - 内容
 * @param {string} title - 标题
 * @returns {Promise<boolean>} 用户是否确认
 */
export function showConfirm(content, title = '提示') {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success(res) {
        resolve(res.confirm);
      },
      fail() {
        resolve(false);
      }
    });
  });
}

// ==================== 防抖节流工具 ====================

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} delay - 延迟时间
 * @returns {Function} 节流后的函数
 */
export function throttle(func, delay = 300) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}
