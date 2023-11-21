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
  async onLoad(options) {
    let app = getApp()
    if (!app.globalData.isLogin) {
      this.setData({
        showLoginDialog: true
      })
      return
    }
    wx.showLoading({
      title: '加载中'
    })
    const res = await app.call({
      path: `/login?id=${app.globalData.id}&password=${app.globalData.password}`,
      method: 'POST',
      header: {
        'content-type': 'application/form-data'
      }
    })
    // 检查接口是否返回用户数据
    if (typeof res == String) {
      wx.showToast({
        icon: 'error',
        title: '请重新进入'
      })
      return
    }
    // 根据后端数据库数据实时更新学习进度
    let data = res[0]
    let konwLedgeModules = ['dianqi', 'feiwu', 'xiaofang', 'jiuyuan', 'yanlian']
    let regulationModules = ['rule1', 'rule2', 'rule3', 'rule4', 'rule5']
    let konwLedgeModules_ifDone = 0,
      regulationModules_ifDone = 0
    for (let i = 0; i < konwLedgeModules.length; i++) {
      if (data[konwLedgeModules[i]]) konwLedgeModules_ifDone += 1
    }
    for (let i = 0; i < regulationModules.length; i++) {
      if (data[regulationModules[i]]) regulationModules_ifDone += 1
    }
    this.setData({
      knowProgress: Math.round((konwLedgeModules_ifDone / konwLedgeModules.length) * 100),
      identifyingProgress: app.globalData.safeSign ? 100 : 0,
      systemProgress: Math.round((regulationModules_ifDone / regulationModules.length) * 100)
    })
    wx.hideLoading()
  },
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    wx.switchTab({
      url: '../../my/index/my'
    })
  }
})
