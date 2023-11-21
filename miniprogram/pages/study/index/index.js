// pages/study/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    classify: ['培训学习', '考试'],
    showPracticeDialog: false,
    showLoginDialog: false
  },
  handleClick() {
    console.log('【学习功能块点击了】')
  },
  async handleAnswer(e) {
    let app = getApp()
    // 是否登录
    if (!app.globalData.isLogin) {
      this.setData({
        showLoginDialog: true
      })
      return
    }
    let type = e.currentTarget.dataset.type
    // 点击考试 进入待考试
    if (type == 'exam') {
      wx.navigateTo({
        url: '../../exam-modules/initial-entry/index'
      })
    }
    // 点击培训 进入培训前询问
    else {
      this.setData({
        showPracticeDialog: true
      })
    }
    return
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow() {},
  onHide() {
    console.log('【学习考试页隐藏】')
    this.setData({
      showLoginDialog: false,
      showPracticeDialog: false
    })
  },
  // —————————————————————————————— //
  toPractice() {
    wx.redirectTo({
      url: '../answer/answer'
    })
  },
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    this.setData({
      showLoginDialog: false
    })
    wx.switchTab({
      url: '../../my/index/my'
    })
  },
  closePracticeDialog() {
    this.setData({
      showPracticeDialog: false
    })
  }
})
