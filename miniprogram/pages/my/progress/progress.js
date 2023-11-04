// pages/my/progress/progress.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLoginDialog: false,
    knowProgress: 0,
    identifyingProgress: 0,
    systemProgress: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let app = getApp()
    if (!app.globalData.isLogin) {
      this.setData({
        showLoginDialog: true
      })
      return
    }
    this.setData({
      knowProgress: app.globalData.konwLedgeProgress,
      identifyingProgress: app.globalData.identifierProgress,
      systemProgress: app.globalData.regulationProgress
    })
  },
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    wx.switchTab({
      url: '../../my/index/my'
    })
  }
})
