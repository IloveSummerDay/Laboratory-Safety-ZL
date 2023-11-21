// pages/home/regulation/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLoginDialog: false,
    rules: [
      '实验室安全管理办法',
      '实验室安全卫生守则',
      '实验室突发事件应急处理预案',
      '实验室安全管理办法'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let app = getApp()
    // 核验是否登录
    if (!app.globalData.isLogin) {
      this.setData({
        showLoginDialog: true
      })
    }
  },
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    wx.switchTab({
      url: '../../my/index/my'
    })
  }
})
