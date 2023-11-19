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
  async onUnload() {
    let app = getApp()
    if (app.globalData.safeSign || !app.globalData.isLogin) return
    const res = await app.call({
      path: `/setSafeSign?id=${app.globalData.id}`,
      method: 'PUT'
    })
    if (res.code == 200) {
      wx.showToast({
        title: '已完成'
      })
      app.globalData.safeSign = true
      console.log('【完成安全标识学习回调】', res)
      console.log('【恭喜你，已经完成安全标识学习！】')
    }
  },
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    wx.switchTab({
      url: '../../my/index/my'
    })
  }
})
