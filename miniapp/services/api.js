// 恋心物语 - API 客户端基础封装
// 封装 wx.request，提供统一的请求处理、错误拦截和响应格式化

import { API_BASE_URL, API_CODES, STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants';
import { getStorage, removeStorage, showError, showLoading, hideLoading } from '../utils/util';

/**
 * API 客户端类
 * 提供统一的 HTTP 请求封装，包含认证、错误处理、加载状态管理
 */
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  /**
   * 获取认证头
   * @returns {Object} 包含 Authorization 的头部对象
   */
  getAuthHeaders() {
    const token = getStorage(STORAGE_KEYS.ACCESS_TOKEN);
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /**
   * 处理 API 响应
   * @param {Object} response - wx.request 的响应对象
   * @returns {Promise} 处理后的响应数据或错误
   */
  handleResponse(response) {
    const { data: apiResponse, statusCode } = response;

    // HTTP 状态码检查
    if (statusCode !== 200) {
      console.error('HTTP Error:', statusCode, apiResponse);
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    // 业务状态码检查
    switch (apiResponse.code) {
      case API_CODES.SUCCESS:
      case API_CODES.CREATED:
        return apiResponse.data;

      case API_CODES.UNAUTHORIZED:
        // Token 失效，清除本地认证信息并跳转登录
        this.handleUnauthorized();
        throw new Error(apiResponse.message || ERROR_MESSAGES.UNAUTHORIZED);

      case API_CODES.FORBIDDEN:
        showError(apiResponse.message || ERROR_MESSAGES.FORBIDDEN);
        throw new Error(apiResponse.message || ERROR_MESSAGES.FORBIDDEN);

      case API_CODES.NOT_FOUND:
        showError(apiResponse.message || ERROR_MESSAGES.NOT_FOUND);
        throw new Error(apiResponse.message || ERROR_MESSAGES.NOT_FOUND);

      case API_CODES.BAD_REQUEST:
        // 参数验证错误，显示具体错误信息
        const errorMsg = this.formatValidationErrors(apiResponse.errors) || 
                        apiResponse.message || 
                        ERROR_MESSAGES.VALIDATION_ERROR;
        showError(errorMsg);
        throw new Error(errorMsg);

      case API_CODES.SERVER_ERROR:
      default:
        showError(apiResponse.message || ERROR_MESSAGES.SERVER_ERROR);
        throw new Error(apiResponse.message || ERROR_MESSAGES.SERVER_ERROR);
    }
  }

  /**
   * 处理未认证状态
   */
  handleUnauthorized() {
    // 清除本地存储的认证信息
    removeStorage(STORAGE_KEYS.ACCESS_TOKEN);
    removeStorage(STORAGE_KEYS.USER_INFO);
    removeStorage(STORAGE_KEYS.COUPLE_INFO);

    // 通知全局状态管理器（如果存在）
    const app = getApp();
    if (app.store && app.store.userStore && app.store.userStore.logout) {
      app.store.userStore.logout();
    }

    // 跳转到登录页
    wx.reLaunch({
      url: '/pages/auth/index'
    });
  }

  /**
   * 格式化验证错误信息
   * @param {Object} errors - 错误对象
   * @returns {string} 格式化后的错误信息
   */
  formatValidationErrors(errors) {
    if (!errors || typeof errors !== 'object') return '';
    
    const errorMessages = Object.values(errors);
    return errorMessages.length > 0 ? errorMessages[0] : '';
  }

  /**
   * 核心请求方法
   * @param {Object} options - 请求配置
   * @returns {Promise} 请求结果
   */
  request(options) {
    const {
      url,
      method = 'GET',
      data = {},
      headers = {},
      showLoading: shouldShowLoading = false,
      loadingText = '加载中...'
    } = options;

    // 显示加载状态
    if (shouldShowLoading) {
      showLoading(loadingText);
    }

    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + url,
        method,
        data,
        header: {
          ...this.defaultHeaders,
          ...this.getAuthHeaders(),
          ...headers
        },
        success: (response) => {
          try {
            const result = this.handleResponse(response);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        fail: (error) => {
          console.error('Request failed:', error);
          showError(ERROR_MESSAGES.NETWORK_ERROR);
          reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
        },
        complete: () => {
          if (shouldShowLoading) {
            hideLoading();
          }
        }
      });
    });
  }

  /**
   * GET 请求
   * @param {string} url - 请求路径
   * @param {Object} params - 查询参数
   * @param {Object} options - 额外配置
   * @returns {Promise} 请求结果
   */
  get(url, params = {}, options = {}) {
    // 将参数拼接到 URL
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.request({
      url: fullUrl,
      method: 'GET',
      ...options
    });
  }

  /**
   * POST 请求
   * @param {string} url - 请求路径
   * @param {Object} data - 请求体数据
   * @param {Object} options - 额外配置
   * @returns {Promise} 请求结果
   */
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    });
  }

  /**
   * PUT 请求
   * @param {string} url - 请求路径
   * @param {Object} data - 请求体数据
   * @param {Object} options - 额外配置
   * @returns {Promise} 请求结果
   */
  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    });
  }

  /**
   * DELETE 请求
   * @param {string} url - 请求路径
   * @param {Object} options - 额外配置
   * @returns {Promise} 请求结果
   */
  delete(url, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      ...options
    });
  }
}

// 创建全局 API 客户端实例
const apiClient = new ApiClient();

// 导出便捷方法
export const api = {
  get: (url, params, options) => apiClient.get(url, params, options),
  post: (url, data, options) => apiClient.post(url, data, options),
  put: (url, data, options) => apiClient.put(url, data, options),
  delete: (url, options) => apiClient.delete(url, options)
};

// 导出 API 客户端类（用于高级用法）
export { ApiClient };

export default api;
