// pages/home/regulation/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLoginDialog: false,
    rules: [
      '浙江传媒学院实验室安全管理办法',
      '浙江传媒学院实验室安全卫生守则',
      '媒体工程学院实验室突发事件应急处理预案',
      '浙江传媒学院实验室安全管理办法',
      '媒体工程学院实验室突发事件应急处理预案'
    ]
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
    }
  },
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    wx.switchTab({
      url: '../../my/index/my'
    })
  }
})
