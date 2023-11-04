// pages/my/identifying_safety/identifying_safety.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLoginDialog: false
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
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    let app = getApp()
    if (app.globalData.identifierProgress !== 100) app.globalData.identifierProgress = 100
  },
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    wx.switchTab({
      url: '../../my/index/my'
    })
  }
})
