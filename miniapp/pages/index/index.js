Page({
  data: {
    // 用户信息
    userInfo: {
      currentUser: {
        id: "b2c3d4e5-0003-4003-8003-112233445566",
        nickname: "小美",
        avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
        display_gender: "female",
      },
      partner: {
        id: "b2c3d4e5-0004-4004-8004-aabbccddeeff",
        nickname: "小明",
        avatar_url: "https://randomuser.me/api/portraits/men/68.jpg",
        display_gender: "male",
      },
    },

    // 爱情指数
    loveProgress: 50,

    // 当前事件类型
    currentEventType: "sweet_moment",

    // 事件列表
    eventList: [
      {
        id: "evt-uuid-001",
        type: "sweet_moment",
        description: "你给我买了我最喜欢的奶茶！",
        status: "unresolved",
        event_date: "2023-10-26",
        location_text: "学校门口的奶茶店",
        author: {
          id: "b2c3d4e5-0003-4003-8003-112233445566",
          nickname: "小美",
          display_gender: "female"
        },
        mood_tag: {
          id: 1,
          name: "感动",
          emoji: "🥰",
          color: "#FADADD"
        },
        created_at: "2023-10-26T10:30:00Z"
      }
    ],

    // 心情标签列表
    moodTags: [
      { id: 1, name: "感动", emoji: "🥰", color: "#FADADD" },
      { id: 2, name: "开心", emoji: "😊", color: "#B2D9EA" },
      { id: 3, name: "生气", emoji: "😠", color: "#FF6B6B" },
      { id: 4, name: "难过", emoji: "😢", color: "#95A5A6" },
      { id: 5, name: "兴奋", emoji: "🤩", color: "#FFF3B0" }
    ],

    // 表单相关
    showAddForm: false,
    formData: {
      type: "sweet_moment",
      description: "",
      event_date: "",
      mood_tag_id: null,
      images: [],
      location_text: ""
    }
  },

  onLoad: function() {
    // 设置当前日期
    const today = new Date();
    const dateStr = today.getFullYear() + '-' + 
                   String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(today.getDate()).padStart(2, '0');
    
    this.setData({
      'formData.event_date': dateStr
    });
  },

  // 切换事件类型
  onEventTypeChange: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      currentEventType: type,
      'formData.type': type
    });
  },

  // 显示添加表单
  showAddForm: function() {
    this.setData({
      showAddForm: true
    });
  },

  // 隐藏添加表单
  hideAddForm: function() {
    this.setData({
      showAddForm: false
    });
  },

  // 防止事件冒泡
  preventDefault: function() {
    // 阻止事件冒泡
  },

  // 表单输入处理
  onDescriptionInput: function(e) {
    this.setData({
      'formData.description': e.detail.value
    });
  },

  onLocationInput: function(e) {
    this.setData({
      'formData.location_text': e.detail.value
    });
  },

  onDateChange: function(e) {
    this.setData({
      'formData.event_date': e.detail.value
    });
  },

  // 选择心情标签
  onMoodTagSelect: function(e) {
    const tagId = e.currentTarget.dataset.id;
    this.setData({
      'formData.mood_tag_id': tagId
    });
  },

  // 提交表单
  onSubmitForm: function() {
    const { formData } = this.data;
    
    // 验证必填字段
    if (!formData.description.trim()) {
      wx.showToast({
        title: '请输入事件描述',
        icon: 'none'
      });
      return;
    }

    if (!formData.mood_tag_id) {
      wx.showToast({
        title: '请选择心情标签',
        icon: 'none'
      });
      return;
    }

    // 模拟提交
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });

    // 重置表单并关闭
    this.setData({
      showAddForm: false,
      formData: {
        type: this.data.currentEventType,
        description: "",
        event_date: this.data.formData.event_date,
        mood_tag_id: null,
        images: [],
        location_text: ""
      }
    });
  }
}); 